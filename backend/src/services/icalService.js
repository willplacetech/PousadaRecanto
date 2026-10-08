import ical from 'ical-generator';
import { Bloqueio, Acomodacao, Pousada, CalendarioICal, Reserva, Tarifa } from '../models/index.js';
import crypto from 'crypto';

export const gerarICal = async (pousadaId, acomodacaoId, requestIp = null) => {
  const acomodacao = await Acomodacao.findById(acomodacaoId);
  if (!acomodacao || acomodacao.pousadaId.toString() !== pousadaId.toString()) {
    throw new Error('Acomodação não encontrada');
  }

  const pousada = await Pousada.findById(pousadaId);
  if (!pousada) {
    throw new Error('Pousada não encontrada');
  }

  const agora = new Date();
  agora.setHours(0, 0, 0, 0);

  // 1. Bloqueios diretos (origem: reserva, email, manutencao)
  const bloqueios = await Bloqueio.find({
    pousadaId,
    acomodacao: acomodacaoId,
    data: { $gte: agora }
  }).sort({ data: 1 });

  // 2. Reservas confirmadas (status ≠ cancelada)
  const reservas = await Reserva.find({
    pousadaId,
    acomodacao: acomodacaoId,
    status: { $in: ['confirmada', 'checkin'] },
    checkout: { $gte: agora }
  }).select('codigo canal checkin checkout').lean();

  // 3. Tarifas bloqueadas (manutenção)
  const manutencoes = await Tarifa.find({
    pousadaId,
    acomodacao: acomodacaoId,
    bloqueado: true,
    data: { $gte: agora }
  }).select('data motivoBloqueio').lean();

  const cal = ical({
    name: `Pousada ${pousada.nome} — ${acomodacao.nome}`,
    timezone: 'America/Sao_Paulo',
    prodId: { company: 'pousadarecanto.com', product: 'ical-export' },
    url: `https://pousadarecanto.onrender.com`
  });

  // Mapa de datas ocupadas para evitar duplicatas
  const datasOcupadas = new Map(); // key: YYYY-MM-DD -> { summary, description, uids: [] }

  // Processar Bloqueios
  for (const b of bloqueios) {
    const dataStr = b.data.toISOString().split('T')[0];
    const proximaData = new Date(b.data);
    proximaData.setDate(proximaData.getDate() + 1);
    const proximaDataStr = proximaData.toISOString().split('T')[0];

    const isManutencao = b.origem === 'manutencao';
    const summary = isManutencao ? 'Manutenção' : 'Reservado';
    const uid = `${b._id}@pousadarecanto`;
    const description = isManutencao
      ? `Manutenção/Indisponível`
      : `Bloqueio via ${b.origem}`;

    if (!datasOcupadas.has(dataStr)) {
      datasOcupadas.set(dataStr, { summary, description, uids: [uid], start: new Date(b.data), end: proximaData });
    } else {
      datasOcupadas.get(dataStr).uids.push(uid);
    }
  }

  // Processar Reservas confirmadas
  for (const r of reservas) {
    const checkin = new Date(r.checkin);
    checkin.setHours(0, 0, 0, 0);
    const checkout = new Date(r.checkout);
    checkout.setHours(0, 0, 0, 0);

    if (checkout <= agora) continue;

    for (let d = new Date(Math.max(checkin, agora)); d < checkout; d.setDate(d.getDate() + 1)) {
      const dataStr = d.toISOString().split('T')[0];
      const proximaData = new Date(d);
      proximaData.setDate(proximaData.getDate() + 1);

      const uid = `reserva-${r.codigo}-${dataStr}@pousadarecanto`;
      const summary = 'Reservado';
      const description = `Reserva ${r.codigo} — ${r.canal}`;

      if (!datasOcupadas.has(dataStr)) {
        datasOcupadas.set(dataStr, { summary, description, uids: [uid], start: new Date(d), end: proximaData });
      } else {
        const existing = datasOcupadas.get(dataStr);
        existing.uids.push(uid);
        existing.description += ` | ${description}`;
      }
    }
  }

  // Processar Manutenções (Tarifas bloqueadas)
  for (const m of manutencoes) {
    const dataStr = new Date(m.data).toISOString().split('T')[0];
    const data = new Date(dataStr);
    data.setHours(0, 0, 0, 0);
    const proximaData = new Date(data);
    proximaData.setDate(proximaData.getDate() + 1);

    if (data < agora) continue;

    const uid = `manutencao-${m._id}-${dataStr}@pousadarecanto`;
    const summary = 'Manutenção';
    const description = m.motivoBloqueio ? `Manutenção: ${m.motivoBloqueio}` : 'Manutenção/Indisponível';

    if (!datasOcupadas.has(dataStr)) {
      datasOcupadas.set(dataStr, { summary, description, uids: [uid], start: data, end: proximaData });
    } else {
      const existing = datasOcupadas.get(dataStr);
      existing.uids.push(uid);
      if (existing.summary !== 'Manutenção') {
        existing.summary = 'Manutenção';
      }
      existing.description += ` | ${description}`;
    }
  }

  // Criar eventos no calendário (um por noite)
  for (const [dataStr, evento] of datasOcupadas.entries()) {
    // Usar o primeiro UID como principal (iCal exige um UID por evento)
    cal.createEvent({
      id: evento.uids[0],
      summary: evento.summary,
      start: evento.start,
      end: evento.end,
      allDay: true,
      transparent: false,
      description: evento.description
    });
  }

  // Atualizar log de pull no CalendarioICal (se houver config para esta acomodação)
  if (requestIp) {
    await CalendarioICal.updateMany(
      { pousadaId, acomodacao: acomodacaoId },
      { $set: { ultimoPullIcal: new Date(), ultimoPullIp: requestIp } }
    );
  }

  return cal.toString();
};

export const importarICal = async (pousadaId, calendarioConfig) => {
  const { CalendarioICal } = await import('../models/index.js');
  const { default: fetch } = await import('node-fetch');
  const icalParse = (await import('node-ical')).default;

  const cal = await CalendarioICal.findById(calendarioConfig._id);
  if (!cal || cal.pousadaId.toString() !== pousadaId.toString()) {
    throw new Error('Calendário iCal não encontrado');
  }

  try {
    const response = await fetch(cal.url, { timeout: 30000 });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.text();

    const eventos = icalParse.parseICS(data);
    const bloqueiosParaCriar = [];
    let novos = 0, atualizados = 0, erros = 0;

    for (const [key, evento] of Object.entries(eventos)) {
      if (evento.type !== 'VEVENT') continue;
      if (!evento.start) continue;

      const inicio = new Date(evento.start);
      const fim = evento.end ? new Date(evento.end) : new Date(inicio.getTime() + 24*60*60*1000);
      const summary = evento.summary || '';

      if (summary.includes('BLOQUEADO') || summary.includes('MANUTENÇÃO') || summary.includes('MANUTENCAO')) continue;

      for (let d = new Date(inicio); d < fim; d.setDate(d.getDate() + 1)) {
        const dataStr = d.toISOString().split('T')[0];
        const hash = Buffer.from(`${pousadaId}-${cal.acomodacao}-${dataStr}-ical-${cal._id}`).toString('base64url');

        const existe = await Bloqueio.findOne({ hash });
        if (existe) {
          atualizados++;
          continue;
        }

        bloqueiosParaCriar.push({
          pousadaId,
          acomodacao: cal.acomodacao,
          data: new Date(d),
          origem: 'ical',
          referenciaId: cal._id,
          hash
        });
        novos++;
      }
    }

    if (bloqueiosParaCriar.length > 0) {
      await Bloqueio.insertMany(bloqueiosParaCriar, { ordered: false });
    }

    cal.ultimaSincronizacao = new Date();
    cal.status = 'ativo';
    cal.ultimoErro = null;
    cal.tentativasErro = 0;
    await cal.save();

    return { novos, atualizados, erros };
  } catch (error) {
    cal.ultimoErro = error.message;
    cal.tentativasErro += 1;
    cal.status = cal.tentativasErro > 3 ? 'erro' : 'ativo';
    await cal.save();

    if (cal.tentativasErro > 3) {
      const { Alerta } = await import('../models/index.js');
      await Alerta.create({
        pousadaId,
        tipo: 'sincronia_falhou',
        severidade: 'alta',
        mensagem: `Sincronia iCal falhou 3+ vezes: ${cal.canal} (${cal.acomodacao}) - ${error.message}`,
        detalhes: { calendarioId: cal._id, erro: error.message }
      });
    }

    throw error;
  }
};

export const sincronizarTodosICal = async (pousadaId) => {
  const { CalendarioICal } = await import('../models/index.js');
  const calendarios = await CalendarioICal.find({ pousadaId, status: { $ne: 'inativo' } });
  
  const resultados = [];
  for (const cal of calendarios) {
    try {
      const result = await importarICal(pousadaId, cal);
      resultados.push({ calendario: cal._id, canal: cal.canal, ...result, sucesso: true });
    } catch (error) {
      resultados.push({ calendario: cal._id, canal: cal.canal, erro: error.message, sucesso: false });
    }
  }
  return resultados;
};