import OpenAI from 'openai';
import mongoose from 'mongoose';
import { EmailReserva, Reserva, Bloqueio, Acomodacao, Alerta, Pousada } from '../models/index.js';
import { enviarWhatsApp } from './whatsappService.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PROMPT_EXTRACAO = `
Extraia informações de reserva do e-mail abaixo. Retorne APENAS JSON válido.

Campos a extrair:
- plataforma: "airbnb" | "booking" | "expedia" | "outro"
- tipo: "nova" | "alteracao" | "cancelamento"
- codigoExterno: string (código da reserva na plataforma)
- nomeHospede: string
- checkin: "YYYY-MM-DD"
- checkout: "YYYY-MM-DD"
- nomeAcomodacao: string (nome do quarto/listing)
- numHospedes: number
- valorTotal: number (opcional)

Se não conseguir extrair com confiança, retorne: {"erro": "Não foi possível extrair dados da reserva"}

E-mail:
---
`;

export const extrairDadosReserva = async (corpoEmail, assunto, remetente) => {
  try {
    const plataforma = detectarPlataforma(remetente, assunto);
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é um especialista em extrair dados de reservas de e-mails de plataformas de hospedagem. Retorne apenas JSON.' },
        { role: 'user', content: PROMPT_EXTRACAO + `\nAssunto: ${assunto}\nRemetente: ${remetente}\nCorpo:\n${corpoEmail}` }
      ],
      temperature: 0,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const resultado = JSON.parse(response.choices[0].message.content);
    return { ...resultado, plataforma: resultado.plataforma || plataforma };
  } catch (error) {
    console.error('Erro na extração LLM:', error);
    return { erro: 'Erro ao processar com IA' };
  }
};

const detectarPlataforma = (remetente, assunto) => {
  const texto = `${remetente} ${assunto}`.toLowerCase();
  if (texto.includes('airbnb')) return 'airbnb';
  if (texto.includes('booking')) return 'booking';
  if (texto.includes('expedia')) return 'expedia';
  return 'outro';
};

const encontrarAcomodacaoPorNome = async (pousadaId, nomeBusca) => {
  const acomodacoes = await Acomodacao.find({ pousadaId, status: 'ativa' }).select('nome').lean();
  
  const normalizado = nomeBusca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const a of acomodacoes) {
    const nomeNormalizado = a.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (nomeNormalizado.includes(normalizado) || normalizado.includes(nomeNormalizado)) {
      return a;
    }
  }
  
  return acomodacoes[0] || null;
};

const gerarHashBloqueio = (pousadaId, acomodacaoId, data, origem, referenciaId) => {
  const str = `${pousadaId}-${acomodacaoId}-${data.toISOString().split('T')[0]}-${origem}-${referenciaId || ''}`;
  return Buffer.from(str).toString('base64url');
};

const gerarDatasPeriodo = (checkin, checkout) => {
  const datas = [];
  const inicio = new Date(checkin);
  const fim = new Date(checkout);
  for (let d = new Date(inicio); d < fim; d.setDate(d.getDate() + 1)) {
    datas.push(new Date(d));
  }
  return datas;
};

export const processarEmailReserva = async (emailDoc) => {
  const { dadosExtraidos, erro } = await extrairDadosReserva(
    emailDoc.corpo || '',
    emailDoc.assunto,
    emailDoc.remetente
  );

  if (erro) {
    emailDoc.erroExtracao = erro;
    emailDoc.extraido = false;
    await emailDoc.save();

    await Alerta.create({
      pousadaId: emailDoc.pousadaId,
      tipo: 'email_nao_processado',
      severidade: 'media',
      mensagem: `E-mail não processado automaticamente: ${emailDoc.assunto} (${emailDoc.remetente})`,
      detalhes: { emailId: emailDoc._id, erro }
    });
    return { sucesso: false, erro };
  }

  emailDoc.dadosExtraidos = dadosExtraidos;
  emailDoc.extraido = true;
  emailDoc.tipo = dadosExtraidos.tipo;

  const acomodacao = await encontrarAcomodacaoPorNome(emailDoc.pousadaId, dadosExtraidos.nomeAcomodacao);
  if (!acomodacao) {
    emailDoc.erroExtracao = 'Acomodação não encontrada';
    await emailDoc.save();
    return { sucesso: false, erro: 'Acomodação não encontrada' };
  }

  try {
    let resultado;
    switch (dadosExtraidos.tipo) {
      case 'nova':
        resultado = await processarNovaReserva(emailDoc, dadosExtraidos, acomodacao);
        break;
      case 'cancelamento':
        resultado = await processarCancelamento(emailDoc, dadosExtraidos, acomodacao);
        break;
      case 'alteracao':
        resultado = await processarAlteracao(emailDoc, dadosExtraidos, acomodacao);
        break;
      default:
        throw new Error('Tipo de reserva desconhecido');
    }

    emailDoc.reservaId = resultado.reserva?._id;
    emailDoc.processado = true;
    await emailDoc.save();

    return { sucesso: true, ...resultado };
  } catch (error) {
    emailDoc.erroExtracao = error.message;
    await emailDoc.save();
    return { sucesso: false, erro: error.message };
  }
};

const processarNovaReserva = async (emailDoc, dados, acomodacao) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const checkin = new Date(dados.checkin);
    const checkout = new Date(dados.checkout);

    const bloqueiosExistentes = await Bloqueio.find({
      pousadaId: emailDoc.pousadaId,
      acomodacao: acomodacao._id,
      data: { $gte: checkin, $lt: checkout }
    }).session(session);

    if (bloqueiosExistentes.length > 0) {
      const reservaConflito = await Reserva.findById(bloqueiosExistentes[0].referenciaId)
        .select('codigo hospede.nome canal').session(session);
      
      const msg = `🚨 OVERBOOKING VIA E-MAIL 🚨\n\n` +
        `Acomodação: ${acomodacao.nome}\n` +
        `Período: ${dados.checkin} a ${dados.checkout}\n` +
        `E-mail: ${emailDoc.remetente} (${dados.plataforma})\n` +
        `Hóspede: ${dados.nomeHospede}\n` +
        `Conflita com: ${reservaConflito?.codigo} (${reservaConflito?.canal}) - ${reservaConflito?.hospede?.nome}`;
      
      await Alerta.create({
        pousadaId: emailDoc.pousadaId,
        tipo: 'overbooking',
        severidade: 'critica',
        mensagem: msg,
        detalhes: { acomodacao: acomodacao._id, checkin, checkout, emailId: emailDoc._id }
      });
      await enviarWhatsApp(emailDoc.pousadaId, msg);
    }

    const reserva = new Reserva({
      pousadaId: emailDoc.pousadaId,
      hospede: {
        nome: dados.nomeHospede,
        email: '',
        telefone: ''
      },
      acomodacao: acomodacao._id,
      checkin,
      checkout,
      numHospedes: dados.numHospedes || 1,
      valorTotal: dados.valorTotal || 0,
      canal: dados.plataforma,
      status: 'confirmada',
      codigoExterno: dados.codigoExterno,
      origem: 'email',
      emailId: emailDoc._id
    });
    await reserva.save({ session });

    const datas = gerarDatasPeriodo(checkin, checkout);
    const bloqueios = datas.map(data => ({
      pousadaId: emailDoc.pousadaId,
      acomodacao: acomodacao._id,
      data,
      origem: 'email',
      referenciaId: reserva._id,
      hash: gerarHashBloqueio(emailDoc.pousadaId, acomodacao._id, data, 'email', reserva._id)
    }));
    await Bloqueio.insertMany(bloqueios, { session, ordered: false });

    await session.commitTransaction();
    return { reserva, acao: 'criada' };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const processarCancelamento = async (emailDoc, dados, acomodacao) => {
  const reserva = await Reserva.findOne({
    pousadaId: emailDoc.pousadaId,
    codigoExterno: dados.codigoExterno,
    status: { $ne: 'cancelada' }
  });

  if (!reserva) {
    throw new Error(`Reserva ${dados.codigoExterno} não encontrada para cancelamento`);
  }

  reserva.status = 'cancelada';
  await reserva.save();

  await Bloqueio.deleteMany({
    pousadaId: emailDoc.pousadaId,
    referenciaId: reserva._id,
    origem: { $in: ['reserva', 'email'] }
  });

  return { reserva, acao: 'cancelada' };
};

const processarAlteracao = async (emailDoc, dados, acomodacao) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reserva = await Reserva.findOne({
      pousadaId: emailDoc.pousadaId,
      codigoExterno: dados.codigoExterno,
      status: { $ne: 'cancelada' }
    }).session(session);

    if (!reserva) {
      throw new Error(`Reserva ${dados.codigoExterno} não encontrada para alteração`);
    }

    await Bloqueio.deleteMany({
      pousadaId: emailDoc.pousadaId,
      referenciaId: reserva._id,
      origem: { $in: ['reserva', 'email'] }
    }).session(session);

    const checkin = new Date(dados.checkin);
    const checkout = new Date(dados.checkout);
    
    reserva.checkin = checkin;
    reserva.checkout = checkout;
    reserva.numHospedes = dados.numHospedes || reserva.numHospedes;
    reserva.valorTotal = dados.valorTotal || reserva.valorTotal;
    await reserva.save({ session });

    const datas = gerarDatasPeriodo(checkin, checkout);
    const bloqueios = datas.map(data => ({
      pousadaId: emailDoc.pousadaId,
      acomodacao: acomodacao._id,
      data,
      origem: 'email',
      referenciaId: reserva._id,
      hash: gerarHashBloqueio(emailDoc.pousadaId, acomodacao._id, data, 'email', reserva._id)
    }));
    await Bloqueio.insertMany(bloqueios, { session, ordered: false });

    await session.commitTransaction();
    return { reserva, acao: 'alterada' };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const sincronizarEmails = async (pousadaId) => {
  const imap = (await import('imap')).default;
  const { simpleParser } = await import('mailparser');
  
  const pousada = await Pousada.findById(pousadaId);
  if (!pousada || !pousada.imapConfig?.user) {
    return { processados: 0, erro: 'Configuração IMAP não encontrada' };
  }

  return new Promise((resolve, reject) => {
    const conn = new imap({
      host: pousada.imapConfig.host,
      port: pousada.imapConfig.port,
      user: pousada.imapConfig.user,
      password: pousada.imapConfig.pass,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    conn.once('ready', () => {
      conn.openBox('INBOX', false, async (err, box) => {
        if (err) return reject(err);

        const criterio = [
          'UNSEEN',
          ['OR', ['FROM', '@airbnb.com'], ['FROM', '@booking.com'], ['FROM', '@expedia.com']]
        ];

        conn.search(criterio, async (err, uids) => {
          if (err) return reject(err);
          if (!uids || uids.length === 0) {
            conn.end();
            return resolve({ processados: 0 });
          }

          const fetch = conn.fetch(uids, { bodies: '', markSeen: true });
          let processados = 0;

          fetch.on('message', (msg) => {
            msg.on('body', async (stream) => {
              const parsed = await simpleParser(stream);
              
              const emailDoc = await EmailReserva.findOneAndUpdate(
                { messageId: parsed.messageId },
                {
                  pousadaId,
                  messageId: parsed.messageId,
                  remetente: parsed.from?.text || '',
                  assunto: parsed.subject || '',
                  dataRecebido: parsed.date || new Date(),
                  tipo: 'desconhecido',
                  corpo: parsed.text || parsed.html || ''
                },
                { upsert: true, new: true }
              );

              if (!emailDoc.processado) {
                await processarEmailReserva(emailDoc);
                processados++;
              }
            });
          });

          fetch.once('end', () => {
            conn.end();
            resolve({ processados });
          });

          fetch.once('error', (err) => {
            conn.end();
            reject(err);
          });
        });
      });
    });

    conn.once('error', (err) => reject(err));
    conn.connect();
  });
};

export const sincronizarEmailsTodas = async () => {
  const pousadas = await Pousada.find({ ativo: true, 'imapConfig.user': { $exists: true } }).select('_id');
  
  const resultados = [];
  for (const p of pousadas) {
    try {
      const result = await sincronizarEmails(p._id);
      resultados.push({ pousadaId: p._id, ...result, sucesso: true });
    } catch (error) {
      resultados.push({ pousadaId: p._id, erro: error.message, sucesso: false });
    }
  }
  return resultados;
};