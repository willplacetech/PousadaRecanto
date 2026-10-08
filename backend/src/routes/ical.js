import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { multiTenant, ensurePousadaId } from '../middleware/multiTenant.js';
import { validar, schemas } from '../middleware/validacao.js';
import { icalExportLimiter } from '../middleware/rateLimit.js';
import {
  exportarICal,
  listarCalendariosICal,
  criarCalendarioICal,
  atualizarCalendarioICal,
  excluirCalendarioICal,
  sincronizarICal,
  sincronizarICalTodas,
  statusSincronia
} from '../controllers/icalController.js';

const router = Router();

// Export público (sem auth, só token) - com rate limit
router.get('/ical/:pousadaId/:acomodacaoId.ics', icalExportLimiter, exportarICal);

// Rotas autenticadas
router.use(authMiddleware, multiTenant);

router.get('/ical/status', statusSincronia);
router.get('/ical', listarCalendariosICal);
router.post('/ical', ensurePousadaId, validar(schemas.calendarioICal), criarCalendarioICal);
router.put('/ical/:id', ensurePousadaId, atualizarCalendarioICal);
router.delete('/ical/:id', ensurePousadaId, excluirCalendarioICal);

// Sync endpoints (chamados pelo cron-job.org com secret)
router.post('/sync/ical', sincronizarICal);
router.post('/sync/ical/todas', sincronizarICalTodas);

export default router;