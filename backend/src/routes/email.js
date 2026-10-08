import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { multiTenant, ensurePousadaId } from '../middleware/multiTenant.js';
import { validar, schemas } from '../middleware/validacao.js';
import {
  listarEmails,
  buscarEmail,
  reprocessarEmail,
  sincronizarEmail,
  sincronizarEmailTodas,
  configEmail,
  atualizarConfigEmail
} from '../controllers/emailController.js';

const router = Router();

router.use(authMiddleware, multiTenant);

router.get('/emails', listarEmails);
router.get('/emails/:id', buscarEmail);
router.post('/emails/:id/reprocessar', reprocessarEmail);
router.get('/email/config', configEmail);
router.put('/email/config', ensurePousadaId, validar(schemas.emailConfig), atualizarConfigEmail);

// Sync endpoints (chamados pelo cron-job.org com secret)
router.post('/sync/email', sincronizarEmail);
router.post('/sync/email/todas', sincronizarEmailTodas);

export default router;