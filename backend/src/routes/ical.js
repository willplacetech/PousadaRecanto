import { Router } from 'express';
import { ensurePousadaId } from '../middleware/multiTenant.js';
import { validar, schemas } from '../middleware/validacao.js';

import {
  listarCalendariosICal,
  criarCalendarioICal,
  atualizarCalendarioICal,
  excluirCalendarioICal,
  sincronizarICal,
  statusSincronia
} from '../controllers/icalController.js';

const router = Router();

// Export pÃºblico (sem auth, sÃ³ token) - com rate limit

// Rotas autenticadas


router.get('/ical/status', statusSincronia);
router.get('/ical', listarCalendariosICal);
router.post('/ical', ensurePousadaId, validar(schemas.calendarioICal), criarCalendarioICal);
router.put('/ical/:id', ensurePousadaId, validar(schemas.calendarioICal), atualizarCalendarioICal);
router.delete('/ical/:id', ensurePousadaId, excluirCalendarioICal);

// Sync endpoints (chamados pelo cron-job.org com secret)

router.post('/ical/sincronizar', (req, res) => { req.body.pousadaId = req.pousadaId; return sincronizarICal(req, res); });
export default router;