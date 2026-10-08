import { Reserva, Bloqueio, Tarifa, Acomodacao, Alerta } from '../models/index.js';
import mongoose from 'mongoose';
import { enviarWhatsApp } from './whatsappService.js';

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

const criarAlertaBloqueioManual = async (reserva) => {
  const checkin = new Date(reserva.checkin).toLocaleDateString('pt-BR');
  const checkout = new Date(reserva.checkout).toLocaleDateString('pt-BR');
  
  const alerta = await Alerta.create({
    pousadaId: reserva.pousadaId,
    tipo: 'bloqueio_manual_pendente',
    severidade: 'media',
    mensagem: `Reserva ${reserva.codigo} (${checkin}→${checkout}) — bloqueie manualmente no Airbnb e Booking. Sincronia iCal pode levar até 2h.`,
    detalhes: { reservaId: reserva._id },
    resolvido: false
  });
  
  await enviarWhatsApp(reserva.pousadaId, 
    `⚠️ BLOQUEIO MANUAL PENDENTE\n\n` +
    `Reserva: ${reserva.codigo}\n` +
    `Hóspede: ${reserva.hospede.nome}\n` +
    `Acomodação: ${reserva.acomodacaoNome || ''}\n` +
    `Período: ${checkin} a ${checkout}\n\n` +
    `Bloqueie manualmente no Airbnb e Booking para evitar overbooking.\n` +
    `A sincronia iCal pode levar até 2h.`
  );
  
  return alerta;
};

export const verificarDisponibilidade = async (pousadaId, acomodacaoId, checkin, checkout, excluirReservaId = null) => {
  const datas = gerarDatasPeriodo(checkin, checkout);
  const datasStr = datas.map(d => d.toISOString().split('T')[0]);

  const bloqueios = await Bloqueio.find({
    pousadaId,
    acomodacao: acomodacaoId,
    data: { $in: datas }
  }).select('data origem referenciaId');

  const bloqueiosPorData = {};
  bloqueios.forEach(b => {
    const key = b.data.toISOString().split('T')[0];
    if (!bloqueiosPorData[key]) bloqueiosPorData[key] = [];
    bloqueiosPorData[key].push(b);
  });

  const conflitos = [];
  datasStr.forEach(dataStr => {
    if (bloqueiosPorData[dataStr]) {
      bloqueiosPorData[dataStr].forEach(b => {
        if (excluirReservaId && b.referenciaId?.toString() === excluirReservaId.toString()) return;
        conflitos.push({
          data: dataStr,
          origem: b.origem,
          referenciaId: b.referenciaId
        });
      });
    }
  });

  return { disponivel: conflitos.length === 0, conflitos, datas };
};

export const calcularPrecoPeriodo = async (pousadaId, acomodacaoId, checkin, checkout) => {
  const datas = gerarDatasPeriodo(checkin, checkout);
  let total = 0;
  const detalhes = [];

  for (const data of datas) {
    const tarifa = await Tarifa.findOne({
      pousadaId,
      acomodacao: acomodacaoId,
      data: { $gte: new Date(data.setHours(0,0,0,0)), $lt: new Date(data.setHours(23,59,59,999)) }
    });

    if (tarifa && tarifa.bloqueado) {
      return { erro: 'Data bloqueada para manutenção', data: data.toISOString().split('T')[0] };
    }

    const valor = tarifa?.valor || 0;
    total += valor;
    detalhes.push({
      data: data.toISOString().split('T')[0],
      valor
    });
  }

  return { total, detalhes };
};

export const criarReserva = async (dados, usuarioId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { pousadaId, acomodacao, checkin, checkout, ...resto } = dados;

    const disponibilidade = await verificarDisponibilidade(pousadaId, acomodacao, checkin, checkout);
    if (!disponibilidade.disponivel) {
      const conflito = disponibilidade.conflitos[0];
      const reservaConflito = await Reserva.findById(conflito.referenciaId).select('codigo hospede.nome');
      throw new Error(`CONFLITO:${reservaConflito?.codigo || conflito.referenciaId}`);
    }

    const preco = await calcularPrecoPeriodo(pousadaId, acomodacao, checkin, checkout);
    if (preco.erro) throw new Error(preco.erro);

    const acomodacaoDoc = await Acomodacao.findById(acomodacao);
    if (!acomodacaoDoc || acomodacaoDoc.maxHospedes < dados.numHospedes) {
      throw new Error('Acomodação não comporta o número de hóspedes');
    }

    const valorTotal = dados.valorTotal || preco.total;

    const reserva = new Reserva({
      ...resto,
      pousadaId,
      acomodacao,
      checkin: new Date(checkin),
      checkout: new Date(checkout),
      valorTotal,
      createdBy: usuarioId
    });
    await reserva.save({ session });

    const datas = gerarDatasPeriodo(checkin, checkout);
    const bloqueios = datas.map(data => ({
      pousadaId,
      acomodacao,
      data,
      origem: 'reserva',
      referenciaId: reserva._id,
      hash: gerarHashBloqueio(pousadaId, acomodacao, data, 'reserva', reserva._id)
    }));

    await Bloqueio.insertMany(bloqueios, { session, ordered: false });

    await session.commitTransaction();

    // Alerta de bloqueio manual se reserva direta
    let alertaBloqueio = null;
    if (reserva.canal === 'direto') {
      // Popular nome da acomodação para o alerta
      reserva.acomodacaoNome = acomodacaoDoc.nome;
      alertaBloqueio = await criarAlertaBloqueioManual(reserva);
    }

    return { reserva, preco: preco.detalhes, alertaBloqueio };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const atualizarStatusReserva = async (reservaId, novoStatus, pousadaId, usuarioId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reserva = await Reserva.findOne({ _id: reservaId, pousadaId }).session(session);
    if (!reserva) throw new Error('Reserva não encontrada');

    const statusAnterior = reserva.status;
    reserva.status = novoStatus;
    await reserva.save({ session });

    if (novoStatus === 'cancelada' && statusAnterior !== 'cancelada') {
      await Bloqueio.deleteMany({
        pousadaId,
        referenciaId: reservaId,
        origem: 'reserva'
      }).session(session);
    }

    await session.commitTransaction();

    if (novoStatus === 'confirmada' && statusAnterior === 'pendente') {
      await notificarConfirmacao(reserva);
    }

    return reserva;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const notificarConfirmacao = async (reserva) => {
  try {
    const acomodacao = await Acomodacao.findById(reserva.acomodacao);
    const msg = `✅ Reserva confirmada!\n\n` +
      `Código: ${reserva.codigo}\n` +
      `Hóspede: ${reserva.hospede.nome}\n` +
      `Acomodação: ${acomodacao?.nome}\n` +
      `Check-in: ${reserva.checkin.toLocaleDateString('pt-BR')}\n` +
      `Check-out: ${reserva.checkout.toLocaleDateString('pt-BR')}\n` +
      `Valor: R$ ${reserva.valorTotal.toFixed(2)}`;
    await enviarWhatsApp(reserva.pousadaId, msg);
  } catch (error) {
    console.error('Erro ao notificar confirmação:', error);
  }
};

export const listarReservas = async (pousadaId, filtros = {}) => {
  const query = { pousadaId };
  if (filtros.status) query.status = filtros.status;
  if (filtros.canal) query.canal = filtros.canal;
  if (filtros.inicio || filtros.fim) {
    query.checkin = {};
    if (filtros.inicio) query.checkin.$gte = new Date(filtros.inicio);
    if (filtros.fim) query.checkin.$lte = new Date(filtros.fim);
  }

  return Reserva.find(query)
    .populate('acomodacao', 'nome tipo')
    .sort({ checkin: -1 });
};

export const calendarioMensal = async (pousadaId, ano, mes) => {
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59);

  const reservas = await Reserva.find({
    pousadaId,
    status: { $in: ['pendente', 'confirmada', 'checkin'] },
    $or: [
      { checkin: { $gte: inicio, $lte: fim } },
      { checkout: { $gte: inicio, $lte: fim } },
      { checkin: { $lte: inicio }, checkout: { $gte: fim } }
    ]
  }).populate('acomodacao', 'nome').lean();

  const acomodacoes = await Acomodacao.find({ pousadaId, status: 'ativa' }).select('nome').lean();

  const calendario = {};
  acomodacoes.forEach(a => {
    calendario[a._id.toString()] = { nome: a.nome, dias: {} };
  });

  reservas.forEach(r => {
    const aid = r.acomodacao._id.toString();
    if (!calendario[aid]) return;
    const checkin = new Date(r.checkin);
    const checkout = new Date(r.checkout);
    for (let d = new Date(checkin); d < checkout; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0];
      calendario[aid].dias[key] = {
        reservaId: r._id,
        codigo: r.codigo,
        hospede: r.hospede.nome,
        canal: r.canal,
        status: r.status
      };
    }
  });

  return calendario;
};

export const detectarOverbooking = async (pousadaId) => {
  const bloqueios = await Bloqueio.aggregate([
    { $match: { pousadaId: new mongoose.Types.ObjectId(pousadaId) } },
    {
      $group: {
        _id: { acomodacao: '$acomodacao', data: '$data' },
        count: { $sum: 1 },
        origens: { $push: '$origem' },
        referencias: { $push: '$referenciaId' }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);

  const alertas = [];
  for (const b of bloqueios) {
    const reservas = await Reserva.find({
      _id: { $in: b.referencias.filter(r => r) },
      status: { $ne: 'cancelada' }
    }).select('codigo hospede.nome canal').lean();

    if (reservas.length >= 2) {
      const msg = `OVERBOOKING: ${reservas.map(r => `${r.codigo} (${r.canal})`).join(' vs ')} — acomodação ${b._id.acomodacao}, noite ${b._id.data.toISOString().split('T')[0]}. Resolva agora.`;
      const alerta = new Alerta({
        pousadaId,
        tipo: 'overbooking',
        severidade: 'critica',
        mensagem: msg,
        detalhes: { acomodacao: b._id.acomodacao, data: b._id.data, reservas: reservas.map(r => r._id) }
      });
      await alerta.save();
      await enviarWhatsApp(pousadaId, msg);
      alertas.push(alerta);
    }
  }

  return alertas;
};