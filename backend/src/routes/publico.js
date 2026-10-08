import { Router } from 'express';
import mongoose from 'mongoose';
import { Acomodacao, Pousada } from '../models/index.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { schemas, validar } from '../middleware/validacao.js';
import { criarReserva } from '../services/reservaService.js';
const router = Router();
router.use(apiLimiter, async (req, res, next) => { try {
  const id = process.env.POUSADA_PUBLICA_ID;
  if (!mongoose.isValidObjectId(id) || !await Pousada.exists({ _id: id, ativo: true })) return res.status(503).json({ erro: 'Reservas online ainda não configuradas. Entre em contato com a pousada.' });
  req.pousadaId = id; next();
} catch (e) { next(e); } });
router.get('/acomodacoes', async (req, res, next) => { try {
  res.json(await Acomodacao.find({ pousadaId: req.pousadaId, status: 'ativa' }).select('nome tipo maxHospedes valorPadrao descricao camas').sort({ nome: 1 }).lean());
} catch (e) { next(e); } });
router.post('/reservas', validar(schemas.reservaPublica), async (req, res, next) => { try {
  const result = await criarReserva({ ...req.body, pousadaId: req.pousadaId, canal: 'direto', origem: 'api' });
  const r = result.reserva;
  res.status(201).json({ reserva: { _id: r._id, codigo: r.codigo, valorTotal: r.valorTotal, checkin: r.checkin, checkout: r.checkout, status: r.status }, mensagem: 'Reserva pendente registrada. Aguarde confirmação da pousada.' });
} catch (e) { next(e); } });
export default router;
