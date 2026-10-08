import { Router } from 'express';
import { ensurePousadaId } from '../middleware/multiTenant.js';
import { validar, schemas } from '../middleware/validacao.js';
import {
  listarEmails,
  buscarEmail,
  reprocessarEmail,
  sincronizarEmail,
  configEmail,
  atualizarConfigEmail
} from '../controllers/emailController.js';

const router = Router();



router.get('/emails', listarEmails);
router.get('/emails/:id', buscarEmail);
router.post('/emails/:id/reprocessar', reprocessarEmail);
router.get('/email/config', configEmail);
router.put('/email/config', ensurePousadaId, validar(schemas.emailConfig), atualizarConfigEmail);

// Sync endpoints (chamados pelo cron-job.org com secret)

router.post('/email/sincronizar', (req, res) => { req.body.pousadaId = req.pousadaId; return sincronizarEmail(req, res); });
export default router;