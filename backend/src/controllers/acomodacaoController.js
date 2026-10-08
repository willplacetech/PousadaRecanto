import { Acomodacao, Tarifa } from '../models/index.js';
import mongoose from 'mongoose';

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
    const acomodacao = await Acomodacao.findOneAndDelete({
      _id: req.params.id,
      pousadaId: req.pousadaId
    });
    if (!acomodacao) {
      return res.status(404).json({ erro: 'Acomodação não encontrada' });
    }
    await Tarifa.deleteMany({ acomodacao: req.params.id });
    res.json({ mensagem: 'Acomodação excluída com sucesso' });
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
    const tarifa = new Tarifa({
      ...req.body,
      pousadaId: req.pousadaId,
      data: new Date(req.body.data)
    });
    await tarifa.save();
    res.status(201).json(tarifa);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ erro: 'Já existe tarifa para esta acomodação nesta data' });
    }
    console.error('Erro ao criar tarifa:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const criarTarifasLote = async (req, res) => {
  try {
    const { acomodacao, inicio, fim, valor, bloqueado } = req.body;
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
    const tarifas = [];

    for (let d = new Date(inicioDate); d <= fimDate; d.setDate(d.getDate() + 1)) {
      tarifas.push({
        pousadaId: req.pousadaId,
        acomodacao,
        data: new Date(d),
        valor,
        bloqueado: bloqueado || false
      });
    }

    const result = await Tarifa.insertMany(tarifas, { ordered: false });
    res.status(201).json({ criadas: result.length });
  } catch (error) {
    console.error('Erro ao criar tarifas em lote:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizarTarifa = async (req, res) => {
  try {
    const tarifa = await Tarifa.findOneAndUpdate(
      { _id: req.params.id, pousadaId: req.pousadaId },
      { ...req.body, data: req.body.data ? new Date(req.body.data) : undefined },
      { new: true, runValidators: true }
    );
    if (!tarifa) {
      return res.status(404).json({ erro: 'Tarifa não encontrada' });
    }
    res.json(tarifa);
  } catch (error) {
    console.error('Erro ao atualizar tarifa:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
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