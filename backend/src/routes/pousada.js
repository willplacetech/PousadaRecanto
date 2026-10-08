import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { Pousada } from '../models/index.js';
import { requireRole } from '../middleware/auth.js';
import { validar, schemas } from '../middleware/validacao.js';
const router = Router();
const selecionar = 'nome email whatsapp whatsappAtivo endereco icalToken ultimoPullIcal ipUltimoPull';
router.get('/', async (req, res, next) => { try {
  const p = await Pousada.findById(req.pousadaId).select(selecionar).lean();
  if (!p) return res.status(404).json({ erro: 'Pousada não encontrada' });
  res.json(p);
} catch (e) { next(e); } });
router.put('/', requireRole('dono','gestor','gerente'), validar(schemas.pousada), async (req, res, next) => { try {
  const p = await Pousada.findByIdAndUpdate(req.pousadaId, { $set: req.body }, { new: true, runValidators: true }).select(selecionar);
  res.json(p);
} catch (e) { next(e); } });
router.post('/ical-token', requireRole('dono','gestor','gerente'), async (req, res, next) => { try {
  const p = await Pousada.findByIdAndUpdate(req.pousadaId, { icalToken: randomUUID() }, { new: true }).select(selecionar);
  res.json(p);
} catch (e) { next(e); } });
export default router;
