import { Reserva, Acomodacao, Alerta } from '../models/index.js';

import {
  verificarDisponibilidade,
  calcularPrecoPeriodo,
  criarReserva,
  atualizarStatusReserva,
  listarReservas,
  calendarioMensal,
  detectarOverbooking
} from '../services/reservaService.js';
import { enviarWhatsApp } from '../services/whatsappService.js';

export const getDisponibilidade = async (req, res) => {
  try {
    const { checkin, checkout, hospedes } = req.query;

    const acomodacoes = await Acomodacao.find({
      pousadaId: req.pousadaId,
      status: 'ativa',
      maxHospedes: { $gte: hospedes || 1 }
    }).lean();

    const resultados = [];
    for (const a of acomodacoes) {
      const disp = await verificarDisponibilidade(req.pousadaId, a._id, checkin, checkout);
      if (disp.disponivel) {
        const preco = await calcularPrecoPeriodo(req.pousadaId, a._id, checkin, checkout);
        if (!preco.erro) {
          resultados.push({
            acomodacao: { id: a._id, nome: a.nome, tipo: a.tipo, maxHospedes: a.maxHospedes, camas: a.camas },
            precoTotal: preco.total,
            detalhesPreco: preco.detalhes,
            noites: Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24))
          });
        }
      }
    }

    res.json(resultados);
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const criarReservaController = async (req, res) => {
  try {
    const dados = {
      ...req.body,
      pousadaId: req.pousadaId,
      checkin: new Date(req.body.checkin),
      checkout: new Date(req.body.checkout)
    };

    const resultado = await criarReserva(dados, req.usuario._id);

    await enviarWhatsApp(req.pousadaId, 
      `✅ Nova reserva ${resultado.reserva.codigo} - ${resultado.reserva.hospede.nome} - ${resultado.reserva.acomodacao}`
    );

    const response = {
      reserva: resultado.reserva,
      preco: resultado.preco
    };

    // Adicionar alerta de bloqueio manual se reserva direta
    if (resultado.alertaBloqueio) {
      response.alertaBloqueio = {
        mensagem: '⚠️ Bloqueie esta data manualmente no Airbnb e Booking (sincronia iCal pode levar até 2h).',
        links: {
          airbnb: 'https://www.airbnb.com/hosting/calendars',
          booking: 'https://admin.booking.com/hotel/hoteladmin/calendar'
        },
        confirmado: false
      };
    }

    res.status(201).json(response);
  } catch (error) {
    if (error.message.startsWith('CONFLITO:')) {
      const codigoConflito = error.message.replace('CONFLITO:', '');
      return res.status(409).json({ 
        erro: 'Conflito de datas', 
        codigoConflito,
        mensagem: `Já existe uma reserva (${codigoConflito}) para estas datas`
      });
    }
    if (error.message.includes('não comporta')) {
      return res.status(400).json({ erro: error.message });
    }
    if (!error.status) console.error('Erro ao criar reserva:', error.name);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const confirmarBloqueioManual = async (req, res) => {
  try {
    const { plataformas } = req.body;
    const reserva = await Reserva.findOne({ _id: req.params.id, pousadaId: req.pousadaId });
    
    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }

    if (reserva.canal !== 'direto') {
      return res.status(400).json({ erro: 'Apenas reservas diretas podem ter bloqueio manual confirmado' });
    }

    reserva.bloqueioManualConfirmado = true;
    reserva.bloqueioManualConfirmadoEm = new Date();
    reserva.bloqueioManualPlataformas = plataformas || [];
    await reserva.save();

    await Alerta.findOneAndUpdate(
      { pousadaId: req.pousadaId, 'detalhes.reservaId': reserva._id, tipo: 'bloqueio_manual_pendente', resolvido: false },
      { resolvido: true, resolvidoEm: new Date(), resolvidoPor: req.usuario._id }
    );

    res.json({ 
      sucesso: true, 
      mensagem: 'Bloqueio manual confirmado ✅',
      reserva: {
        bloqueioManualConfirmado: reserva.bloqueioManualConfirmado,
        bloqueioManualConfirmadoEm: reserva.bloqueioManualConfirmadoEm,
        bloqueioManualPlataformas: reserva.bloqueioManualPlataformas
      }
    });
  } catch (error) {
    console.error('Erro ao confirmar bloqueio manual:', error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const listarReservasController = async (req, res) => {
  try {
    const { status, canal, inicio, fim, page = 1, limit = 20 } = req.query;
    const reservas = await listarReservas(req.pousadaId, { status, canal, inicio, fim });
    const total = await Reserva.countDocuments({ 
      pousadaId: req.pousadaId,
      ...(status && { status }),
      ...(canal && { canal }),
      ...(inicio || fim ? { checkin: { ...(inicio && { $gte: new Date(inicio)}), ...(fim && { $lte: new Date(fim)}) } } : {})
    });

    res.json({
      reservas,
      paginacao: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const buscarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findOne({ _id: req.params.id, pousadaId: req.pousadaId })
      .populate('acomodacao', 'nome tipo maxHospedes camas');
    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }
    res.json(reserva);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const atualizarStatusReservaController = async (req, res) => {
  try {
    const { status } = req.body;
    const reserva = await atualizarStatusReserva(req.params.id, status, req.pousadaId, req.usuario._id);
    res.json(reserva);
  } catch (error) {
    if (!error.status) console.error('Erro ao atualizar status:', error.name);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const getCalendario = async (req, res) => {
  try {
    const { ano, mes } = req.query;
    const calendario = await calendarioMensal(req.pousadaId, parseInt(ano), parseInt(mes));
    res.json(calendario);
  } catch (error) {
    console.error('Erro ao buscar calendário:', error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const checkOverbooking = async (req, res) => {
  try {
    const alertas = await detectarOverbooking(req.pousadaId);
    res.json({ alertas, total: alertas.length });
  } catch (error) {
    console.error('Erro ao verificar overbooking:', error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const listarBloqueiosPendentes = async (req, res) => {
  try {
    const alertas = await Alerta.find({
      pousadaId: req.pousadaId,
      tipo: 'bloqueio_manual_pendente',
      resolvido: false
    }).sort({ createdAt: 1 });

    const reservasComAlerta = [];
    for (const alerta of alertas) {
      const reserva = await Reserva.findById(alerta.detalhes?.reservaId)
        .populate('acomodacao', 'nome');
      if (reserva) {
        const horasPendentes = Math.floor((Date.now() - alerta.createdAt) / (1000 * 60 * 60));
        const severidadeAtual = horasPendentes >= 2 ? 'critica' : 'media';
        
        reservasComAlerta.push({
          reserva: {
            codigo: reserva.codigo,
            checkin: reserva.checkin,
            checkout: reserva.checkout,
            acomodacao: reserva.acomodacao?.nome,
            hospede: reserva.hospede.nome
          },
          alerta: {
            id: alerta._id,
            createdAt: alerta.createdAt,
            horasPendentes,
            severidade: severidadeAtual,
            mensagem: alerta.mensagem
          },
          links: {
            airbnb: 'https://www.airbnb.com/hosting/calendars',
            booking: 'https://admin.booking.com/hotel/hoteladmin/calendar'
          }
        });
      }
    }

    res.json(reservasComAlerta);
  } catch (error) {
    console.error('Erro ao listar bloqueios pendentes:', error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};