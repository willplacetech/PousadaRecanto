import { Acomodacao, Tarifa, Bloqueio, Reserva } from '../models/index.js';
import mongoose from 'mongoose';
import { normalizarDia, gerarDatasPeriodo, hojeSaoPaulo } from '../services/datas.js';

const gravarTarifas = async (pousadaId, dados, datas, tarifaId = null) => {
  const session = await mongoose.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      const quarto = await Acomodacao.findOneAndUpdate({ _id: dados.acomodacao, pousadaId }, { $inc: { versaoDisponibilidade: 1 } }, { session, new: true });
      if (!quarto) throw Object.assign(new Error('Acomodação não encontrada'), { status: 404 });
      if (dados.bloqueado && (await Bloqueio.exists({ pousadaId, acomodacao: dados.acomodacao, data: { $in: datas } }).session(session) || await Reserva.exists({ pousadaId, acomodacao: dados.acomodacao, status: { $in: ['pendente','confirmada','checkin'] }, checkin: { $lte: datas.at(-1) }, checkout: { $gt: datas[0] } }).session(session))) throw Object.assign(new Error('Uma das noites está reservada; manutenção não aplicada'), { status: 409 });
      await Tarifa.bulkWrite(datas.map(data => ({ updateOne: { filter: tarifaId ? { _id: tarifaId, pousadaId } : { pousadaId, acomodacao: dados.acomodacao, data }, update: { $set: { acomodacao: dados.acomodacao, data, valor: dados.valor, bloqueado: dados.bloqueado ?? false, motivoBloqueio: dados.motivoBloqueio || '' } }, upsert: !tarifaId } })), { session });
      result = await Tarifa.find({ pousadaId, acomodacao: dados.acomodacao, data: { $in: datas } }).session(session);
    });
    return result;
  } finally { await session.endSession(); }
};


export const listarAcomodacoes = async (req, res) => {
  try {
    const { status, tipo } = req.query;
    const filtro = { pousadaId: req.pousadaId };
    if (status) filtro.status = status;
    if (tipo) filtro.tipo = tipo;

    const acomodacoes = await Acomodacao.find(filtro).sort({ nome: 1 });
    res.json(acomodacoes);
  } catch (error) {
    console.error('Erro ao listar acomodações:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const buscarAcomodacao = async (req, res) => {
  try {
    const acomodacao = await Acomodacao.findOne({
      _id: req.params.id,
      pousadaId: req.pousadaId
    });
    if (!acomodacao) {
      return res.status(404).json({ erro: 'Acomodação não encontrada' });
    }
    res.json(acomodacao);
  } catch (error) {
    console.error('Erro ao buscar acomodação:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const criarAcomodacao = async (req, res) => {
  try {
    const acomodacao = new Acomodacao({
      ...req.body,
      pousadaId: req.pousadaId
    });
    await acomodacao.save();
    res.status(201).json(acomodacao);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ erro: 'Já existe uma acomodação com este nome' });
    }
    console.error('Erro ao criar acomodação:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizarAcomodacao = async (req, res) => {
  try {
    const acomodacao = await Acomodacao.findOneAndUpdate(
      { _id: req.params.id, pousadaId: req.pousadaId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!acomodacao) {
      return res.status(404).json({ erro: 'Acomodação não encontrada' });
    }
    res.json(acomodacao);
  } catch (error) {
    console.error('Erro ao atualizar acomodação:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const excluirAcomodacao = async (req, res) => {
  try {
    const ocupada = await Bloqueio.exists({ pousadaId: req.pousadaId, acomodacao: req.params.id, data: { $gte: hojeSaoPaulo() } });
    if (ocupada) return res.status(409).json({ erro: 'Acomodação tem noites ocupadas. Cancele ou transfira as reservas antes de desativar.' });
    const acomodacao = await Acomodacao.findOneAndUpdate({ _id: req.params.id, pousadaId: req.pousadaId }, { status: 'inativa' }, { new: true });
    if (!acomodacao) {
      return res.status(404).json({ erro: 'Acomodação não encontrada' });
    }
    res.json({ mensagem: 'Acomodação desativada. Histórico preservado.' });
  } catch (error) {
    console.error('Erro ao excluir acomodação:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const listarTarifas = async (req, res) => {
  try {
    const { acomodacao, inicio, fim } = req.query;
    const filtro = { pousadaId: req.pousadaId };
    if (acomodacao) filtro.acomodacao = acomodacao;
    if (inicio || fim) {
      filtro.data = {};
      if (inicio) filtro.data.$gte = new Date(inicio);
      if (fim) filtro.data.$lte = new Date(fim);
    }

    const tarifas = await Tarifa.find(filtro)
      .populate('acomodacao', 'nome')
      .sort({ data: 1 });
    res.json(tarifas);
  } catch (error) {
    console.error('Erro ao listar tarifas:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const criarTarifa = async (req, res) => {
  try {
    const tarifas = await gravarTarifas(req.pousadaId, req.body, [normalizarDia(req.body.data)]);
    res.status(201).json(tarifas[0]);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ erro: 'Já existe tarifa para esta acomodação nesta data' });
    }
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const criarTarifasLote = async (req, res) => {
  try {
    const { inicio, fim } = req.body;
    const datas = gerarDatasPeriodo(inicio, new Date(+normalizarDia(fim) + 86400000));
    const tarifas = await gravarTarifas(req.pousadaId, req.body, datas);
    res.status(201).json({ criadas: tarifas.length });
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const atualizarTarifa = async (req, res) => {
  try {
    const tarifa = await Tarifa.findOne({ _id: req.params.id, pousadaId: req.pousadaId });
    if (!tarifa) {
      return res.status(404).json({ erro: 'Tarifa não encontrada' });
    }
    const tarifas = await gravarTarifas(req.pousadaId, req.body, [normalizarDia(req.body.data)], tarifa._id);
    res.json(tarifas[0]);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro interno do servidor' });
  }
};

export const excluirTarifa = async (req, res) => {
  try {
    const tarifa = await Tarifa.findOneAndDelete({
      _id: req.params.id,
      pousadaId: req.pousadaId
    });
    if (!tarifa) {
      return res.status(404).json({ erro: 'Tarifa não encontrada' });
    }
    res.json({ mensagem: 'Tarifa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir tarifa:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
