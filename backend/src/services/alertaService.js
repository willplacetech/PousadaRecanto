import { Alerta, CalendarioICal, EmailReserva, Pousada, Reserva } from '../models/index.js';
import { enviarWhatsApp } from './whatsappService.js';
import { detectarOverbooking } from './reservaService.js';

export const verificarSaudeSincronia = async (pousadaId) => {
  const agora = new Date();
  const alertas = [];

  const calendarios = await CalendarioICal.find({ pousadaId, status: { $ne: 'inativo' } });
  for (const cal of calendarios) {
    if (!cal.ultimaSincronizacao || (agora - cal.ultimaSincronizacao) > 2 * 60 * 60 * 1000) {
      const jaExiste = await Alerta.findOne({
        pousadaId,
        tipo: 'saude_sincronia',
        'detalhes.calendarioId': cal._id,
        resolvido: false
      });
      
      if (!jaExiste) {
        const msg = `⚠️ SINCRONIA PARADA\n\n` +
          `Canal: ${cal.canal}\n` +
          `Acomodação: ${cal.acomodacao}\n` +
          `Última sync: ${cal.ultimaSincronizacao ? cal.ultimaSincronizacao.toLocaleString('pt-BR') : 'Nunca'}\n` +
          `Tempo parado: ${cal.ultimaSincronizacao ? Math.floor((agora - cal.ultimaSincronizacao) / 60000) : '∞'} min`;
        
        await Alerta.create({
          pousadaId,
          tipo: 'saude_sincronia',
          severidade: 'alta',
          mensagem: msg,
          detalhes: { calendarioId: cal._id, canal: cal.canal }
        });
        await enviarWhatsApp(pousadaId, msg);
        alertas.push({ tipo: 'saude_sincronia', calendario: cal._id });
      }
    }
  }

  const emailsPendentes = await EmailReserva.find({
    pousadaId,
    processado: false,
    dataRecebido: { $lt: new Date(agora - 30 * 60 * 1000) }
  });

  for (const email of emailsPendentes) {
    const jaExiste = await Alerta.findOne({
      pousadaId,
      tipo: 'email_nao_processado',
      'detalhes.emailId': email._id,
      resolvido: false
    });
    
    if (!jaExiste) {
      const msg = `📧 E-MAIL NÃO PROCESSADO > 30min\n\n` +
        `Assunto: ${email.assunto}\n` +
        `Remetente: ${email.remetente}\n` +
        `Recebido: ${email.dataRecebido.toLocaleString('pt-BR')}`;
      
      await Alerta.create({
        pousadaId,
        tipo: 'email_nao_processado',
        severidade: 'media',
        mensagem: msg,
        detalhes: { emailId: email._id }
      });
      await enviarWhatsApp(pousadaId, msg);
      alertas.push({ tipo: 'email_nao_processado', email: email._id });
    }
  }

  const overbookings = await detectarOverbooking(pousadaId);
  alertas.push(...overbookings.map(o => ({ tipo: 'overbooking', alerta: o._id })));

  return alertas;
};

export const verificarBloqueiosManuaisPendentes = async (pousadaId) => {
  const agora = new Date();
  const alertasEscalados = [];

  const alertasPendentes = await Alerta.find({
    pousadaId,
    tipo: 'bloqueio_manual_pendente',
    resolvido: false
  });

  for (const alerta of alertasPendentes) {
    const horasPendentes = Math.floor((agora - alerta.createdAt) / (1000 * 60 * 60));
    
    if (horasPendentes >= 2 && alerta.severidade !== 'critica') {
      // Escalar para crítica
      alerta.severidade = 'critica';
      alerta.mensagem = `🚨 CRÍTICO: ${alerta.mensagem}\n\nJá se passaram ${horasPendentes}h sem confirmação de bloqueio manual!`;
      await alerta.save();

      // Enviar WhatsApp de lembrete
      const reserva = await Reserva.findById(alerta.detalhes?.reservaId).populate('acomodacao', 'nome');
      if (reserva) {
        const msg = `🚨 BLOQUEIO MANUAL NÃO CONFIRMADO HÁ ${horasPendentes}H\n\n` +
          `Reserva: ${reserva.codigo}\n` +
          `Hóspede: ${reserva.hospede.nome}\n` +
          `Acomodação: ${reserva.acomodacao?.nome}\n` +
          `Período: ${new Date(reserva.checkin).toLocaleDateString('pt-BR')} a ${new Date(reserva.checkout).toLocaleDateString('pt-BR')}\n\n` +
          `AÇÃO NECESSÁRIA: Bloqueie AGORA no Airbnb e Booking!\n` +
          `Links: https://www.airbnb.com/hosting/calendars | https://admin.booking.com/hotel/hoteladmin/calendar`;
        
        await enviarWhatsApp(pousadaId, msg);
      }

      alertasEscalados.push({ alertaId: alerta._id, horasPendentes });
    }
  }

  return alertasEscalados;
};

export const verificarSaudeTodas = async () => {
  const { Pousada } = await import('../models/index.js');
  const pousadas = await Pousada.find({ ativo: true }).select('_id');
  
  const resultados = [];
  for (const p of pousadas) {
    try {
      const alertas = await verificarSaudeSincronia(p._id);
      const escalados = await verificarBloqueiosManuaisPendentes(p._id);
      resultados.push({ pousadaId: p._id, alertas, escalados, sucesso: true });
    } catch (error) {
      resultados.push({ pousadaId: p._id, erro: error.message, sucesso: false });
    }
  }
  return resultados;
};

export const listarAlertas = async (req, res) => {
  try {
    const { resolvido, tipo, severidade, page = 1, limit = 50 } = req.query;
    const filtro = { pousadaId: req.pousadaId };
    if (resolvido !== undefined) filtro.resolvido = resolvido === 'true';
    if (tipo) filtro.tipo = tipo;
    if (severidade) filtro.severidade = severidade;

    const alertas = await Alerta.find(filtro)
      .populate('resolvidoPor', 'email')
      .sort({ data: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Alerta.countDocuments(filtro);

    res.json({
      alertas,
      paginacao: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Erro ao listar alertas:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const resolverAlerta = async (req, res) => {
  try {
    const alerta = await Alerta.findOneAndUpdate(
      { _id: req.params.id, pousadaId: req.pousadaId },
      { resolvido: true, resolvidoEm: new Date(), resolvidoPor: req.usuario._id },
      { new: true }
    );
    if (!alerta) {
      return res.status(404).json({ erro: 'Alerta não encontrado' });
    }
    res.json(alerta);
  } catch (error) {
    console.error('Erro ao resolver alerta:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const sincronizarSaude = async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.CRON_SECRET) {
      return res.status(403).json({ erro: 'Segredo inválido' });
    }

    const { pousadaId } = req.body;
    if (pousadaId) {
      const alertas = await verificarSaudeSincronia(pousadaId);
      res.json({ alertas, timestamp: new Date() });
    } else {
      const resultados = await verificarSaudeTodas();
      res.json({ resultados, timestamp: new Date() });
    }
  } catch (error) {
    console.error('Erro na verificação de saúde:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const statsDashboard = async (req, res) => {
  try {
    const [alertasCriticos, alertasNaoResolvidos, calendarios, emailsPendentes, reservasHoje] = await Promise.all([
      Alerta.countDocuments({ pousadaId: req.pousadaId, resolvido: false, severidade: 'critica' }),
      Alerta.countDocuments({ pousadaId: req.pousadaId, resolvido: false }),
      CalendarioICal.find({ pousadaId: req.pousadaId, status: { $ne: 'inativo' } })
        .populate('acomodacao', 'nome')
        .select('canal ultimaSincronizacao status ultimoErro'),
      EmailReserva.countDocuments({ pousadaId: req.pousadaId, processado: false }),
      (async () => {
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        return (await import('../models/index.js')).Reserva.countDocuments({
          pousadaId: req.pousadaId,
          status: { $in: ['pendente', 'confirmada'] },
          checkin: { $gte: hoje, $lt: amanha }
        });
      })()
    ]);

    const syncStatus = calendarios.map(c => ({
      canal: c.canal,
      acomodacao: c.acomodacao?.nome,
      ultimaSincronizacao: c.ultimaSincronizacao,
      status: c.status,
      minutosAtras: c.ultimaSincronizacao ? Math.floor((Date.now() - c.ultimaSincronizacao) / 60000) : null,
      erro: c.ultimoErro
    }));

    res.json({
      alertasCriticos,
      alertasNaoResolvidos,
      emailsPendentes,
      reservasHoje,
      sincronias: syncStatus
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};