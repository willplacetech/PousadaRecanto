import mongoose from 'mongoose';
import { EmailReserva, Reserva, Bloqueio, Acomodacao, Alerta, Pousada } from '../models/index.js';
import { extrairDadosReserva, selecionarAcomodacao } from './emailExtraction.js';
import { normalizarDia, gerarDatasPeriodo } from './datas.js';
import { detectarOverbooking } from './reservaService.js';
export { extrairDadosReserva } from './emailExtraction.js';

const marcarFalha = async (email, erro) => {
  email.erroExtracao = erro; email.processado = false; await email.save();
  await Alerta.findOneAndUpdate({ pousadaId: email.pousadaId, chave: `email:${email._id}` }, { $set: { tipo: 'email_nao_processado', severidade: 'media', mensagem: `Revise o e-mail: ${email.assunto}. ${erro}`, detalhes: { emailId: email._id }, resolvido: false } }, { upsert: true, runValidators: true });
  return { sucesso: false, erro };
};
export const processarEmailReserva = async email => {
  if (email.processado) return { sucesso: true, acao: 'duplicada', reserva: email.reservaId };
  const { dadosExtraidos: dados, erro } = await extrairDadosReserva(email.corpo || '', email.assunto, email.remetente);
  if (erro || !dados) return marcarFalha(email, erro || 'Extração inválida');
  const session = await mongoose.startSession();
  let resultado;
  try {
    email.dadosExtraidos = dados; email.extraido = true; email.tipo = dados.tipo;
    await session.withTransaction(async () => {
      let reserva = await Reserva.findOne({ pousadaId: email.pousadaId, canal: dados.plataforma, codigoExterno: dados.codigoExterno }).session(session);
      if (dados.tipo === 'nova' && reserva) { resultado = { reserva, acao: 'duplicada' }; return; }
      if (dados.tipo !== 'nova' && !reserva) throw new Error('Reserva não encontrada para alteração/cancelamento');
      if (reserva?.status === 'checkout') throw new Error('Reserva encerrada; revise manualmente a notificação');
      if (dados.tipo === 'cancelamento') {
        await Acomodacao.updateOne({ _id: reserva.acomodacao, pousadaId: email.pousadaId }, { $inc: { versaoDisponibilidade: 1 } }, { session });
        reserva.status = 'cancelada'; await reserva.save({ session });
        await Bloqueio.deleteMany({ pousadaId: email.pousadaId, referenciaId: reserva._id, origem: { $in: ['email','reserva'] } }).session(session);
        resultado = { reserva, acao: 'cancelada' }; return;
      }
      const quartos = await Acomodacao.find({ pousadaId: email.pousadaId, status: 'ativa' }).session(session).lean();
      const quarto = selecionarAcomodacao(quartos, dados.nomeAcomodacao);
      if (!quarto) throw new Error('Acomodação ausente ou ambígua; revise manualmente');
      if ((dados.numHospedes || reserva?.numHospedes) > quarto.maxHospedes) throw new Error('Reserva externa excede capacidade; revise manualmente');
      // All booking writers lock the room to serialize availability changes.
      const ids = [...new Set([String(quarto._id), ...(reserva ? [String(reserva.acomodacao)] : [])])].sort();
      for (const id of ids) await Acomodacao.updateOne({ _id: id, pousadaId: email.pousadaId }, { $inc: { versaoDisponibilidade: 1 } }, { session });
      const checkin = normalizarDia(dados.checkin), checkout = normalizarDia(dados.checkout);
      const datas = gerarDatasPeriodo(checkin, checkout);
      if (!reserva) reserva = new Reserva({ pousadaId: email.pousadaId, acomodacao: quarto._id, hospede: { nome: dados.nomeHospede }, numHospedes: dados.numHospedes, canal: dados.plataforma, codigoExterno: dados.codigoExterno, origem: 'email', emailId: email._id, valorTotal: dados.valorTotal ?? 0 });
      else {
        if (reserva.status === 'cancelada') throw new Error('Reserva já cancelada; revise a alteração');
        await Bloqueio.deleteMany({ pousadaId: email.pousadaId, referenciaId: reserva._id, origem: { $in: ['reserva','email'] } }).session(session);
        reserva.acomodacao = quarto._id;
        if (dados.nomeHospede) reserva.hospede.nome = dados.nomeHospede;
        if (dados.numHospedes) reserva.numHospedes = dados.numHospedes;
        if (dados.valorTotal !== undefined) reserva.valorTotal = dados.valorTotal;
      }
      reserva.checkin = checkin; reserva.checkout = checkout;
      if (dados.tipo === 'nova') reserva.status = 'confirmada';
      await reserva.save({ session });
      // The same externally identified booking can already exist in the iCal snapshot.
      await Bloqueio.deleteMany({ pousadaId: email.pousadaId, acomodacao: quarto._id, origem: 'ical', canal: dados.plataforma, codigoExterno: dados.codigoExterno, data: { $gte: checkin, $lt: checkout } }).session(session);
      await Bloqueio.insertMany(datas.map(data => ({ pousadaId: email.pousadaId, acomodacao: quarto._id, data, origem: 'email', referenciaId: reserva._id, canal: dados.plataforma, codigoExterno: dados.codigoExterno, hash: `${reserva._id}:${data.toISOString().slice(0,10)}` })), { session });
      resultado = { reserva, acao: dados.tipo === 'nova' ? 'criada' : 'alterada' };
    });
    email.reservaId = resultado.reserva._id; email.processado = true; email.erroExtracao = undefined; await email.save();
    await Alerta.updateMany({ pousadaId: email.pousadaId, chave: `email:${email._id}` }, { resolvido: true, resolvidoEm: new Date() });
    await detectarOverbooking(email.pousadaId);
    return { sucesso: true, ...resultado };
  } catch (e) { return marcarFalha(email, e.message); }
  finally { await session.endSession(); }
};

const emAndamento = new Map();
const callbackPromise = fn => new Promise((resolve, reject) => fn((err, data) => err ? reject(err) : resolve(data)));
export const selecionarUids = (uids, cursor, limite = 100) => uids.filter(uid => uid > cursor).sort((a,b) => a-b).slice(0,limite);
async function syncImap(pousadaId) {
  const { default: Imap } = await import('imap');
  const { simpleParser } = await import('mailparser');
  const p = await Pousada.findById(pousadaId).select('+imapConfig.pass');
  if (!p?.imapConfig?.ativo) return { processados: 0, desativado: true };
  if (!p.imapConfig.user || !p.imapConfig.pass) throw new Error('Credenciais IMAP não configuradas');
  const conn = new Imap({ host: p.imapConfig.host, port: p.imapConfig.port, user: p.imapConfig.user, password: p.imapConfig.pass, tls: true, connTimeout: 15000, authTimeout: 15000, socketTimeout: 60000, tlsOptions: { rejectUnauthorized: true } });
  let connectionError;
  conn.on('error', e => { connectionError = e; });
  try {
    await new Promise((resolve, reject) => { conn.once('ready', resolve); conn.once('error', reject); conn.connect(); });
    const box = await callbackPromise(cb => conn.openBox('INBOX', false, cb));
    const validity = String(box.uidvalidity);
    const cursor = p.imapConfig.uidValidity === validity ? p.imapConfig.ultimoUid || 0 : 0;
    const uids = await callbackPromise(cb => conn.search(['UNSEEN', ['OR', ['FROM','airbnb.com'], ['OR', ['FROM','booking.com'], ['FROM','expedia.com']]]], cb));
    let processados = 0, falhos = 0;
    for (const uid of selecionarUids(uids || [], cursor)) {
      if (connectionError) throw connectionError;
      const raw = await new Promise((resolve, reject) => {
        const chunks = []; let length = 0;
        const f = conn.fetch(uid, { bodies: '', markSeen: false });
        f.on('message', msg => msg.on('body', stream => { stream.on('data', chunk => { length += chunk.length; if (length > 2 * 1024 * 1024) { reject(new Error('Email excede limite de 2 MB')); conn.end(); } else chunks.push(chunk); }); stream.on('error', reject); }));
        f.once('error', reject); f.once('end', () => resolve(Buffer.concat(chunks)));
      });
      const parsed = await simpleParser(raw, { skipHtmlToText: false, skipImageLinks: true });
      const from = parsed.from?.value?.[0]?.address || '';
      if (!/@(?:[\w-]+\.)*(?:airbnb|booking|expedia)\.com$/i.test(from)) {
        await Pousada.updateOne({ _id: pousadaId }, { $set: { 'imapConfig.uidValidity': validity, 'imapConfig.ultimoUid': uid } }); continue;
      }
      const messageId = parsed.messageId || `imap:${validity}:${uid}`;
      const email = await EmailReserva.findOneAndUpdate({ pousadaId, messageId }, { $setOnInsert: { pousadaId, messageId, remetente: from, assunto: parsed.subject || '(sem assunto)', dataRecebido: parsed.date || new Date(), corpo: (parsed.text || '').slice(0,80000), tipo: 'desconhecido' } }, { upsert: true, new: true, runValidators: true }).select('+corpo');
      const result = await processarEmailReserva(email);
      // Failed extraction is durably available for review; do not starve newer mail.
      await Pousada.updateOne({ _id: pousadaId }, { $set: { 'imapConfig.uidValidity': validity, 'imapConfig.ultimoUid': uid } });
      if (result.sucesso) { await callbackPromise(cb => conn.addFlags(uid, '\\Seen', cb)); processados++; }
      else falhos++;
    }
    return { processados, falhos };
  } finally { conn.end(); }
}
export const sincronizarEmails = pousadaId => {
  const key = String(pousadaId);
  if (emAndamento.has(key)) return emAndamento.get(key);
  const p = syncImap(pousadaId).finally(() => emAndamento.delete(key));
  emAndamento.set(key, p); return p;
};
export const sincronizarEmailsTodas = async () => {
  const pousadas = await Pousada.find({ ativo: true, 'imapConfig.ativo': true }).select('_id');
  const resultados = [];
  for (const p of pousadas) {
    try { resultados.push({ pousadaId: p._id, ...await sincronizarEmails(p._id), sucesso: true }); }
    catch (e) { resultados.push({ pousadaId: p._id, sucesso: false, erro: e.message }); }
  }
  return resultados;
};
