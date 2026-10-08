import { Router } from 'express';
import { ensurePousadaId } from '../middleware/multiTenant.js';
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



router.get('/disponibilidade', validar(schemas.disponibilidade, 'query'), getDisponibilidade);
router.post('/reservas', ensurePousadaId, validar(schemas.reserva), criarReservaController);
router.get('/reservas', listarReservasController);
router.get('/reservas/calendario', getCalendario);
router.get('/reservas/overbooking', checkOverbooking);
router.get('/reservas/bloqueios-pendentes', listarBloqueiosPendentes);
router.get('/reservas/:id', buscarReserva);
router.patch('/reservas/:id/status', ensurePousadaId, validar(schemas.reservaStatus), atualizarStatusReservaController);
router.patch('/reservas/:id/bloqueio-manual', ensurePousadaId, validar(schemas.bloqueioManual), confirmarBloqueioManual);

export default router;