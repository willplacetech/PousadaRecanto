import { Router } from 'express';

import {
  listarAlertas,
  resolverAlerta,
  statsDashboard
} from '../controllers/alertaController.js';

const router = Router();



router.get('/alertas', listarAlertas);
router.patch('/alertas/:id/resolver', resolverAlerta);
router.get('/dashboard/stats', statsDashboard);

// Health check endpoint (chamado pelo cron-job.org)

export default router;