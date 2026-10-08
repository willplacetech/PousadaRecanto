import ical from 'ical-generator';
import mongoose from 'mongoose';
import { createHash } from 'node:crypto';
import { Bloqueio, Acomodacao, Pousada, CalendarioICal, Reserva, Tarifa, Alerta } from '../models/index.js';
import { normalizarDia, gerarDatasPeriodo, hojeSaoPaulo } from './datas.js';
import { downloadCalendar, parseCalendar } from './icalEvents.js';
import { detectarOverbooking } from './reservaService.js';

export const gerarICal = async (pousadaId, acomodacaoId, requestIp = null) => {
  const [q, p] = await Promise.all([Acomodacao.findOne({ _id: acomodacaoId, pousadaId }), Pousada.findById(pousadaId)]);
  if (!q) throw new Error('Acomodação não encontrada');
  if (!p) throw new Error('Pousada não encontrada');
  const hoje = hojeSaoPaulo();
  const [bloqueios, reservas, tarifas] = await Promise.all([
    Bloqueio.find({ pousadaId, acomodacao: acomodacaoId, data: { $gte: hoje } }).lean(),
    Reserva.find({ pousadaId, acomodacao: acomodacaoId, status: { $in: ['pendente','confirmada','checkin'] }, checkout: { $gt: hoje } }).lean(),
    Tarifa.find({ pousadaId, acomodacao: acomodacaoId, bloqueado: true, data: { $gte: hoje } }).lean()
  ]);
  const noites = new Map();
  for (const b of bloqueios) noites.set(normalizarDia(b.data).toISOString().slice(0,10), b.origem === 'manutencao' ? 'Manutenção' : 'Reservado');
  for (const r of reservas) for (const d of gerarDatasPeriodo(r.checkin, r.checkout)) if (d >= hoje) noites.set(d.toISOString().slice(0,10), 'Reservado');
  for (const t of tarifas) noites.set(normalizarDia(t.data).toISOString().slice(0,10), 'Manutenção');
  const cal = ical({ name: `${p.nome} — ${q.nome}`, timezone: 'America/Sao_Paulo', prodId: { company: 'Recanto da Paz', product: 'gestao' } });
  for (const [date, summary] of [...noites.entries()].sort()) {
    const start = normalizarDia(date);
    cal.createEvent({ id: `night-${pousadaId}-${acomodacaoId}-${date}@pousadarecanto`, summary, start, end: new Date(+start + 86400000), allDay: true, transparent: false });
  }
  if (requestIp) {
    await Pousada.updateOne({ _id: pousadaId }, { ultimoPullIcal: new Date(), ipUltimoPull: requestIp });
    await CalendarioICal.updateMany({ pousadaId, acomodacao: acomodacaoId }, { ultimoPullIcal: new Date(), ultimoPullIp: requestIp });
  }
  return cal.toString();
};
export const importarICal = async (pousadaId, config) => {
  const cal = await CalendarioICal.findOneAndUpdate({ _id: config._id, pousadaId, status: { $ne: 'inativo' } }, { $inc: { sincronizacaoVersao: 1 } }, { new: true });
  if (!cal) throw new Error('Calendário iCal não encontrado');
  const session = await mongoose.startSession();
  let novos = 0, removidos = 0;
  try {
    const eventos = parseCalendar(await downloadCalendar(cal.url));
    await session.withTransaction(async () => {
      // A later download or configuration change invalidates this snapshot.
      const vigente = await CalendarioICal.findOne({ _id: cal._id, pousadaId, sincronizacaoVersao: cal.sincronizacaoVersao, url: cal.url, status: { $ne: 'inativo' } }).session(session);
      if (!vigente) throw Object.assign(new Error('Snapshot iCal substituído por sincronização/configuração mais recente'), { obsolete: true });
      const q = await Acomodacao.findOneAndUpdate({ _id: cal.acomodacao, pousadaId }, { $inc: { versaoDisponibilidade: 1 } }, { new: true, session });
      if (!q) throw new Error('Acomodação não encontrada');
      const reservas = await Reserva.find({ pousadaId, acomodacao: cal.acomodacao, canal: cal.canal, status: { $ne: 'cancelada' }, codigoExterno: { $exists: true } }).session(session).lean();
      const snapshot = eventos.filter(e => !reservas.some(r => e.codigoExterno === r.codigoExterno && e.data >= r.checkin && e.data < r.checkout)).map(e => ({ ...e, pousadaId, acomodacao: cal.acomodacao, origem: 'ical', referenciaId: cal._id, canal: cal.canal, hash: createHash('sha256').update(`${pousadaId}:${cal._id}:${e.uidExterno}:${e.data.toISOString().slice(0,10)}`).digest('hex') }));
      const porHash = new Map(snapshot.map(b => [b.hash, b]));
      const scope = { pousadaId, referenciaId: cal._id, origem: 'ical' };
      const antes = await Bloqueio.find(scope).session(session).select('hash').lean();
      novos = [...porHash.keys()].filter(h => !antes.some(b => b.hash === h)).length;
      if (porHash.size) await Bloqueio.bulkWrite([...porHash.values()].map(b => ({ updateOne: { filter: { pousadaId, hash: b.hash }, update: { $set: b }, upsert: true } })), { session });
      const deleted = await Bloqueio.deleteMany({ ...scope, hash: { $nin: [...porHash.keys()] } }).session(session);
      removidos = deleted.deletedCount;
      const atualizado = await CalendarioICal.updateOne({ _id: cal._id, pousadaId, sincronizacaoVersao: cal.sincronizacaoVersao, url: cal.url, status: { $ne: 'inativo' } }, { $set: { ultimaSincronizacao: new Date(), status: 'ativo', tentativasErro: 0 }, $unset: { ultimoErro: 1 } }, { session });
      if (!atualizado.matchedCount) throw Object.assign(new Error('Snapshot iCal obsoleto'), { obsolete: true });
    });
    await Alerta.updateMany({ pousadaId, chave: `ical:${cal._id}` }, { resolvido: true, resolvidoEm: new Date() });
    const conflitos = await detectarOverbooking(pousadaId);
    return { novos, removidos, conflitos: conflitos.length, erros: 0 };
  } catch (e) {
    if (e.obsolete) throw e;
    const atual = await CalendarioICal.updateOne({ _id: cal._id, pousadaId, sincronizacaoVersao: cal.sincronizacaoVersao, url: cal.url, status: { $ne: 'inativo' } }, { $set: { ultimoErro: e.message, status: 'erro' }, $inc: { tentativasErro: 1 } });
    if (!atual.matchedCount) throw e;
    await Alerta.findOneAndUpdate({ pousadaId, chave: `ical:${cal._id}` }, { $set: { tipo: 'sincronia_falhou', severidade: 'alta', resolvido: false, mensagem: `Sincronia ${cal.canal} falhou: ${e.message}`, detalhes: { calendarioId: cal._id } } }, { upsert: true, runValidators: true });
    throw e;
  } finally { await session.endSession(); }
};
const emAndamento = new Map();
export const sincronizarTodosICal = pousadaId => {
  const key = String(pousadaId);
  if (emAndamento.has(key)) return emAndamento.get(key);
  const run = (async () => {
    const calendarios = await CalendarioICal.find({ pousadaId, status: { $ne: 'inativo' } });
    const resultados = [];
    for (const cal of calendarios) {
      try { resultados.push({ calendario: cal._id, canal: cal.canal, ...await importarICal(pousadaId, cal), sucesso: true }); }
      catch (e) { resultados.push({ calendario: cal._id, canal: cal.canal, erro: e.message, sucesso: false }); }
    }
    return resultados;
  })().finally(() => emAndamento.delete(key));
  emAndamento.set(key, run); return run;
};
