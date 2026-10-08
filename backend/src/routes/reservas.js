import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { multiTenant, ensurePousadaId } from '../middleware/multiTenant.js';
import { validar, schemas } from '../middleware/validacao.js';
import {
  getDisponibilidade,
  criarReservaController,
  listarReservasController,
  buscarReserva,
  atualizarStatusReservaController,
  getCalendario,
  checkOverbooking,
  confirmarBloqueioManual,
  listarBloqueiosPendentes
} from '../controllers/reservaController.js';

const router = Router();

router.use(authMiddleware, multiTenant);

router.get('/disponibilidade', validar(schemas.disponibilidade), getDisponibilidade);
router.post('/reservas', ensurePousadaId, validar(schemas.reserva), criarReservaController);
router.get('/reservas', listarReservasController);
router.get('/reservas/calendario', getCalendario);
router.get('/reservas/overbooking', checkOverbooking);
router.get('/reservas/bloqueios-pendentes', listarBloqueiosPendentes);
router.get('/reservas/:id', buscarReserva);
router.patch('/reservas/:id/status', ensurePousadaId, validar(schemas.reservaStatus), atualizarStatusReservaController);
router.patch('/reservas/:id/bloqueio-manual', ensurePousadaId, confirmarBloqueioManual);

export default router;