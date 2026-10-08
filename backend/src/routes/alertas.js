import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { multiTenant, ensurePousadaId } from '../middleware/multiTenant.js';
import {
  listarAlertas,
  resolverAlerta,
  sincronizarSaude,
  statsDashboard,
  verificarBloqueiosManuaisPendentes
} from '../controllers/alertaController.js';

const router = Router();

router.use(authMiddleware, multiTenant);

router.get('/alertas', listarAlertas);
router.patch('/alertas/:id/resolver', resolverAlerta);
router.get('/dashboard/stats', statsDashboard);
router.post('/sync/bloqueios-pendentes', verificarBloqueiosManuaisPendentes);

// Health check endpoint (chamado pelo cron-job.org)
router.post('/sync/saude', sincronizarSaude);

export default router;