import { EmailReserva } from '../models/index.js';
import { sincronizarEmails, sincronizarEmailsTodas } from '../services/emailService.js';

export const listarEmails = async (req, res) => {
  try {
    const { processado, limite = 50 } = req.query;
    const filtro = { pousadaId: req.pousadaId };
    if (processado !== undefined) filtro.processado = processado === 'true';

    const emails = await EmailReserva.find(filtro)
      .sort({ dataRecebido: -1 })
      .limit(parseInt(limite));
    res.json(emails);
  } catch (error) {
    console.error('Erro ao listar e-mails:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const buscarEmail = async (req, res) => {
  try {
    const email = await EmailReserva.findOne({ _id: req.params.id, pousadaId: req.pousadaId });
    if (!email) {
      return res.status(404).json({ erro: 'E-mail não encontrado' });
    }
    res.json(email);
  } catch (error) {
    console.error('Erro ao buscar e-mail:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const reprocessarEmail = async (req, res) => {
  try {
    const email = await EmailReserva.findOne({ _id: req.params.id, pousadaId: req.pousadaId }).select('+corpo');
    if (!email) {
      return res.status(404).json({ erro: 'E-mail não encontrado' });
    }

    email.processado = false;
    email.erroExtracao = null;
    await email.save();

    const { processarEmailReserva } = await import('../services/emailService.js');
    const resultado = await processarEmailReserva(email);

    res.json({ resultado, processado: email.processado });
  } catch (error) {
    console.error('Erro ao reprocessar e-mail:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const sincronizarEmail = async (req, res) => {
  try {

    const { pousadaId } = req.body;
    if (!pousadaId) {
      return res.status(400).json({ erro: 'pousadaId é obrigatório' });
    }

    const resultado = await sincronizarEmails(pousadaId);
    res.json({ ...resultado, timestamp: new Date() });
  } catch (error) {
    console.error('Erro na sincronização de e-mail:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const sincronizarEmailTodas = async (req, res) => {
  try {

    const resultados = await sincronizarEmailsTodas();
    res.json({ resultados, timestamp: new Date() });
  } catch (error) {
    console.error('Erro na sincronização de e-mail todas:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const configEmail = async (req, res) => {
  try {
    const { Pousada } = await import('../models/index.js');
    const pousada = await Pousada.findById(req.pousadaId);
    if (!pousada) {
      return res.status(404).json({ erro: 'Pousada não encontrada' });
    }
    
    res.json({
      host: pousada.imapConfig?.host,
      port: pousada.imapConfig?.port,
      user: pousada.imapConfig?.user,
      configured: !!pousada.imapConfig?.user
      ,ativo: !!pousada.imapConfig?.ativo
    });
  } catch (error) {
    console.error('Erro ao buscar config e-mail:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizarConfigEmail = async (req, res) => {
  try {
    const { Pousada } = await import('../models/index.js');
    const { host, port, user, pass, ativo } = req.body;
    const anterior = await Pousada.findById(req.pousadaId);
    const update = { 'imapConfig.host': host, 'imapConfig.port': port, 'imapConfig.user': user, 'imapConfig.ativo': ativo ?? true };
    if (anterior?.imapConfig?.user !== user || anterior?.imapConfig?.host !== host) { update['imapConfig.ultimoUid'] = 0; update['imapConfig.uidValidity'] = ''; }
    if (pass) update['imapConfig.pass'] = pass;
    const pousada = await Pousada.findByIdAndUpdate(req.pousadaId, { $set: update }, { new: true, runValidators: true });
    res.json({ configured: !!pousada?.imapConfig?.user, ativo: pousada?.imapConfig?.ativo });
  } catch (error) {
    console.error('Erro ao atualizar config e-mail:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
