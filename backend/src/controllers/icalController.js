import { Pousada, Acomodacao, CalendarioICal, Bloqueio } from '../models/index.js';
import { gerarICal, importarICal, sincronizarTodosICal } from '../services/icalService.js';

export const exportarICal = async (req, res) => {
  try {
    const { pousadaId, acomodacaoId } = req.params;
    const { token } = req.query;

    const pousada = await Pousada.findById(pousadaId);
    if (!pousada || pousada.icalToken !== token) {
      return res.status(404).send('not found');
    }

    const requestIp = req.ip || req.connection?.remoteAddress || 'unknown';
    const ics = await gerarICal(pousadaId, acomodacaoId, requestIp);

    res.set('Content-Type', 'text/calendar; charset=utf-8');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.send(ics);
  } catch (error) {
    if (error.message === 'Acomodação não encontrada' || error.message === 'Pousada não encontrada') {
      return res.status(404).send('not found');
    }
    console.error('Erro ao exportar iCal:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const listarCalendariosICal = async (req, res) => {
  try {
    const calendarios = await CalendarioICal.find({ pousadaId: req.pousadaId })
      .populate('acomodacao', 'nome')
      .sort({ createdAt: -1 });
    res.json(calendarios);
  } catch (error) {
    console.error('Erro ao listar calendários iCal:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const criarCalendarioICal = async (req, res) => {
  try {
    const { acomodacao, canal, url } = req.body;

    const acomodacaoDoc = await Acomodacao.findOne({ _id: acomodacao, pousadaId: req.pousadaId });
    if (!acomodacaoDoc) {
      return res.status(404).json({ erro: 'Acomodação não encontrada' });
    }

    const existente = await CalendarioICal.findOne({ pousadaId: req.pousadaId, acomodacao, canal });
    if (existente) {
      return res.status(400).json({ erro: 'Já existe calendário iCal para esta acomodação/canal' });
    }

    const cal = new CalendarioICal({
      pousadaId: req.pousadaId,
      acomodacao,
      canal,
      url,
      status: 'ativo'
    });
    await cal.save();

    res.status(201).json(cal);
  } catch (error) {
    console.error('Erro ao criar calendário iCal:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizarCalendarioICal = async (req, res) => {
  try {
    const cal = await CalendarioICal.findOneAndUpdate(
      { _id: req.params.id, pousadaId: req.pousadaId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!cal) {
      return res.status(404).json({ erro: 'Calendário iCal não encontrado' });
    }
    res.json(cal);
  } catch (error) {
    console.error('Erro ao atualizar calendário iCal:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const excluirCalendarioICal = async (req, res) => {
  try {
    const cal = await CalendarioICal.findOneAndDelete({ _id: req.params.id, pousadaId: req.pousadaId });
    if (!cal) {
      return res.status(404).json({ erro: 'Calendário iCal não encontrado' });
    }
    await Bloqueio.deleteMany({ pousadaId: req.pousadaId, referenciaId: cal._id, origem: 'ical' });
    res.json({ mensagem: 'Calendário iCal excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir calendário iCal:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const sincronizarICal = async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.CRON_SECRET) {
      return res.status(403).json({ erro: 'Segredo inválido' });
    }

    const { pousadaId } = req.body;
    if (!pousadaId) {
      return res.status(400).json({ erro: 'pousadaId é obrigatório' });
    }

    const resultados = await sincronizarTodosICal(pousadaId);
    res.json({ resultados, timestamp: new Date() });
  } catch (error) {
    console.error('Erro na sincronização iCal:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const sincronizarICalTodas = async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.CRON_SECRET) {
      return res.status(403).json({ erro: 'Segredo inválido' });
    }

    const { Pousada } = await import('../models/index.js');
    const pousadas = await Pousada.find({ ativo: true }).select('_id');
    
    const todosResultados = [];
    for (const p of pousadas) {
      const resultados = await sincronizarTodosICal(p._id);
      todosResultados.push({ pousadaId: p._id, resultados });
    }
    
    res.json({ resultados: todosResultados, timestamp: new Date() });
  } catch (error) {
    console.error('Erro na sincronização iCal todas:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const statusSincronia = async (req, res) => {
  try {
    const calendarios = await CalendarioICal.find({ pousadaId: req.pousadaId })
      .populate('acomodacao', 'nome')
      .select('canal url ultimaSincronizacao status ultimoErro tentativasErro');

    const agora = new Date();
    const status = calendarios.map(c => ({
      canal: c.canal,
      acomodacao: c.acomodacao?.nome,
      ultimaSincronizacao: c.ultimaSincronizacao,
      status: c.status,
      ultimoErro: c.ultimoErro,
      minutosAtras: c.ultimaSincronizacao ? Math.floor((agora - c.ultimaSincronizacao) / 60000) : null,
      parado: c.ultimaSincronizacao ? (agora - c.ultimaSincronizacao) > 2 * 60 * 60 * 1000 : true
    }));

    res.json(status);
  } catch (error) {
    console.error('Erro ao buscar status sincronia:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};