import { Reserva, Bloqueio, Tarifa, Acomodacao, Alerta, CalendarioICal } from '../models/index.js';
import mongoose from 'mongoose';
import { enviarWhatsApp } from './whatsappService.js';
import { normalizarDia, gerarDatasPeriodo, hojeSaoPaulo } from './datas.js';
export { gerarDatasPeriodo } from './datas.js';

const erro = (mensagem, status) => Object.assign(new Error(mensagem), { status });
export const verificarDisponibilidade = async (pousadaId, acomodacao, checkin, checkout, excluirReservaId = null, session = null) => {
  const datas = gerarDatasPeriodo(checkin, checkout);
  const bloqueios = await Bloqueio.find({ pousadaId, acomodacao, data: { $gte: datas[0], $lt: normalizarDia(checkout) }, ...(excluirReservaId ? { referenciaId: { $ne: excluirReservaId } } : {}) }).session(session).lean();
  return { disponivel: bloqueios.length === 0, conflitos: bloqueios, datas };
};
export const calcularPrecoPeriodo = async (pousadaId, acomodacao, checkin, checkout, session = null) => {
  const datas = gerarDatasPeriodo(checkin, checkout);
  const quarto = await Acomodacao.findOne({ _id: acomodacao, pousadaId }).session(session).lean();
  if (!quarto) throw erro('Acomodação não encontrada', 404);
  const tarifas = await Tarifa.find({ pousadaId, acomodacao, data: { $gte: datas[0], $lt: normalizarDia(checkout) } }).session(session).lean();
  const mapa = new Map(tarifas.map(t => [t.data.toISOString().slice(0, 10), t]));
  const detalhes = [];
  for (const data of datas) {
    const chave = data.toISOString().slice(0, 10), tarifa = mapa.get(chave);
    if (tarifa?.bloqueado) return { erro: 'Data bloqueada para manutenção', data: chave };
    detalhes.push({ data: chave, valor: tarifa?.valor ?? quarto.valorPadrao });
  }
  return { total: detalhes.reduce((s, d) => s + d.valor, 0), detalhes };
};
export const criarReserva = async (dados, usuarioId) => {
  const session = await mongoose.startSession();
  let resultado;
  try {
    await session.withTransaction(async () => {
      const { pousadaId, acomodacao } = dados;
      const quarto = await Acomodacao.findOneAndUpdate({ _id: acomodacao, pousadaId, status: 'ativa' }, { $inc: { versaoDisponibilidade: 1 } }, { new: true, session });
      if (!quarto) throw erro('Acomodação não encontrada ou inativa', 404);
      if (quarto.maxHospedes < dados.numHospedes) throw erro('Acomodação não comporta o número de hóspedes', 400);
      const checkin = normalizarDia(dados.checkin), checkout = normalizarDia(dados.checkout);
      if (checkin < hojeSaoPaulo()) throw erro('Check-in deve ser hoje ou uma data futura', 400);
      const disp = await verificarDisponibilidade(pousadaId, acomodacao, checkin, checkout, null, session);
      if (!disp.disponivel) throw Object.assign(erro('Conflito de datas: acomodação indisponível', 409), { conflito: disp.conflitos[0], dados });
      const preco = await calcularPrecoPeriodo(pousadaId, acomodacao, checkin, checkout, session);
      if (preco.erro) throw erro(preco.erro, 409);
      const r = new Reserva({ ...dados, checkin, checkout, valorTotal: dados.valorTotal ?? preco.total, status: 'pendente', createdBy: usuarioId });
      await r.save({ session });
      await Bloqueio.insertMany(disp.datas.map(data => ({ pousadaId, acomodacao, data, origem: 'reserva', referenciaId: r._id, canal: r.canal, codigoExterno: r.codigoExterno, hash: `${r._id}:${data.toISOString().slice(0, 10)}` })), { session });
      let alertaBloqueio = null;
      if (r.canal === 'direto') {
        [alertaBloqueio] = await Alerta.create([{ pousadaId, tipo: 'bloqueio_manual_pendente', severidade: 'media', chave: `manual:${r._id}`, mensagem: `Reserva ${r.codigo} — bloqueie as datas no Airbnb e Booking e confirme no painel.`, detalhes: { reservaId: r._id } }], { session });
      }
      resultado = { reserva: r, preco: preco.detalhes, alertaBloqueio };
    });
  } catch (e) {
    if (e.conflito) {
      const chave = `tentativa:${dados.acomodacao}:${normalizarDia(dados.checkin).toISOString().slice(0, 10)}:${normalizarDia(dados.checkout).toISOString().slice(0, 10)}`;
      await Alerta.findOneAndUpdate({ pousadaId: dados.pousadaId, chave }, { $set: { tipo: 'overbooking', severidade: 'critica', resolvido: false, mensagem: 'Tentativa de reserva em datas já ocupadas. A reserva foi impedida.', detalhes: { acomodacao: dados.acomodacao, data: e.conflito.data, tentativaImpedida: true } } }, { upsert: true, new: true, runValidators: true });
    }
    throw e;
  } finally { await session.endSession(); }
  if (resultado.alertaBloqueio) await enviarWhatsApp(dados.pousadaId, resultado.alertaBloqueio.mensagem);
  return resultado;
};
const transicoes = { pendente: ['confirmada','cancelada'], confirmada: ['checkin','cancelada'], checkin: ['checkout','cancelada'], checkout: [], cancelada: [] };
export const atualizarStatusReserva = async (reservaId, novoStatus, pousadaId) => {
  const session = await mongoose.startSession();
  let reserva;
  try {
    await session.withTransaction(async () => {
      reserva = await Reserva.findOne({ _id: reservaId, pousadaId }).session(session);
      if (!reserva) throw erro('Reserva não encontrada', 404);
      if (reserva.status === novoStatus) return;
      if (!transicoes[reserva.status]?.includes(novoStatus)) throw erro('Transição de status inválida', 400);
      await Acomodacao.updateOne({ _id: reserva.acomodacao, pousadaId }, { $inc: { versaoDisponibilidade: 1 } }, { session });
      reserva.status = novoStatus;
      await reserva.save({ session });
      if (novoStatus === 'cancelada') {
        await Bloqueio.deleteMany({ pousadaId, referenciaId: reservaId, origem: { $in: ['reserva','email'] } }).session(session);
        await Alerta.updateMany({ pousadaId, 'detalhes.reservaId': reservaId, tipo: 'bloqueio_manual_pendente', resolvido: false }, { resolvido: true, resolvidoEm: new Date() }).session(session);
      }
    });
  } finally { await session.endSession(); }
  await detectarOverbooking(pousadaId);
  return reserva;
};
export const listarReservas = async (pousadaId, filtros = {}) => {
  const query = { pousadaId };
  if (filtros.status) query.status = filtros.status;
  if (filtros.canal) query.canal = filtros.canal;
  if (filtros.inicio || filtros.fim) query.checkin = { ...(filtros.inicio ? { $gte: normalizarDia(filtros.inicio) } : {}), ...(filtros.fim ? { $lte: normalizarDia(filtros.fim) } : {}) };
  return Reserva.find(query).populate('acomodacao', 'nome tipo').sort({ checkin: -1 });
};
export const calendarioMensal = async (pousadaId, ano, mes) => {
  if (!Number.isInteger(ano) || ano < 2000 || ano > 2200 || !Number.isInteger(mes) || mes < 1 || mes > 12) throw erro('Mês/ano inválido', 400);
  const inicio = new Date(Date.UTC(ano, mes - 1, 1)), fim = new Date(Date.UTC(ano, mes, 1));
  const [quartos, reservas, bloqueios, calendarios, tarifas] = await Promise.all([
    Acomodacao.find({ pousadaId }).select('nome').lean(),
    Reserva.find({ pousadaId, status: { $in: ['pendente','confirmada','checkin'] }, checkin: { $lt: fim }, checkout: { $gt: inicio } }).lean(),
    Bloqueio.find({ pousadaId, data: { $gte: inicio, $lt: fim } }).lean(),
    CalendarioICal.find({ pousadaId }).select('canal').lean(),
    Tarifa.find({ pousadaId, bloqueado: true, data: { $gte: inicio, $lt: fim } }).lean()
  ]);
  const result = Object.fromEntries(quartos.map(q => [String(q._id), { nome: q.nome, dias: {} }]));
  const canais = new Map(calendarios.map(c => [String(c._id), c.canal]));
  const add = (aid, dia, item) => {
    const q = result[String(aid)]; if (!q) return;
    const data = normalizarDia(dia); if (data < inicio || data >= fim) return;
    const key = data.toISOString().slice(0, 10), prev = q.dias[key];
    if (!prev) q.dias[key] = item;
    else if (prev.reservaId !== item.reservaId || prev.canal !== item.canal) q.dias[key] = { ...prev, conflito: true, eventos: [...(prev.eventos || [prev]), item] };
  };
  for (const r of reservas) for (const d of gerarDatasPeriodo(r.checkin, r.checkout)) add(r.acomodacao, d, { reservaId: String(r._id), codigo: r.codigo, hospede: r.hospede.nome, canal: r.canal, status: r.status });
  for (const b of bloqueios.filter(b => ['ical','manutencao'].includes(b.origem))) add(b.acomodacao, b.data, { canal: b.canal || canais.get(String(b.referenciaId)) || 'manual', origem: b.origem, codigo: b.codigoExterno || 'Indisponível' });
  for (const t of tarifas) add(t.acomodacao, t.data, { canal: 'manual', origem: 'manutencao', codigo: t.motivoBloqueio || 'Manutenção' });
  return result;
};
export const detectarOverbooking = async pousadaId => {
  const [bloqueios, reservas, calendarios] = await Promise.all([
    Bloqueio.find({ pousadaId, data: { $gte: hojeSaoPaulo() } }).lean(),
    Reserva.find({ pousadaId, status: { $ne: 'cancelada' } }).select('codigo canal codigoExterno').lean(),
    CalendarioICal.find({ pousadaId }).select('canal').lean()
  ]);
  const rs = new Map(reservas.map(r => [String(r._id), r])), cs = new Map(calendarios.map(c => [String(c._id), c.canal]));
  const noites = new Map();
  for (const b of bloqueios) {
    const r = rs.get(String(b.referenciaId)), canal = b.canal || r?.canal || cs.get(String(b.referenciaId)) || b.origem;
    const identity = (b.codigoExterno || r?.codigoExterno) ? `${canal}:${b.codigoExterno || r.codigoExterno}` : `${b.origem}:${b.referenciaId}:${b.uidExterno || ''}`;
    const key = `${b.acomodacao}:${normalizarDia(b.data).toISOString().slice(0,10)}`;
    if (!noites.has(key)) noites.set(key, { acomodacao: b.acomodacao, data: b.data, entradas: new Map() });
    noites.get(key).entradas.set(identity, { canal, codigo: r?.codigo || b.codigoExterno || 'Bloqueio externo', reservaId: r?._id });
  }
  const chaves = [], alertas = [];
  for (const [key, noite] of noites) {
    if (noite.entradas.size < 2) continue;
    const chave = `ocupacao:${key}`; chaves.push(chave);
    const itens = [...noite.entradas.values()];
    const existente = await Alerta.findOne({ pousadaId, chave });
    const mensagem = `OVERBOOKING: ${itens.map(i => `${i.codigo} (${i.canal})`).join(' vs ')} — ${key}. Verifique as plataformas.`;
    const a = await Alerta.findOneAndUpdate({ pousadaId, chave }, { $set: { tipo: 'overbooking', severidade: 'critica', mensagem, resolvido: false, detalhes: { acomodacao: noite.acomodacao, data: noite.data, reservas: itens.map(i => i.reservaId).filter(Boolean) } } }, { upsert: true, new: true, runValidators: true });
    if (!existente || existente.resolvido) await enviarWhatsApp(pousadaId, mensagem);
    alertas.push(a);
  }
  await Alerta.updateMany({ pousadaId, tipo: 'overbooking', chave: { $regex: '^ocupacao:', $nin: chaves }, resolvido: false }, { resolvido: true, resolvidoEm: new Date() });
  return alertas;
};
