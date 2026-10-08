import { Router } from 'express';
import { ensurePousadaId } from '../middleware/multiTenant.js';
import { validar, schemas } from '../middleware/validacao.js';
import {
  listarAcomodacoes,
  buscarAcomodacao,
  criarAcomodacao,
  atualizarAcomodacao,
  excluirAcomodacao,
  listarTarifas,
  criarTarifa,
  criarTarifasLote,
  atualizarTarifa,
  excluirTarifa
} from '../controllers/acomodacaoController.js';

const router = Router();



router.get('/acomodacoes', listarAcomodacoes);
router.get('/acomodacoes/:id', buscarAcomodacao);
router.post('/acomodacoes', ensurePousadaId, validar(schemas.acomodacao), criarAcomodacao);
router.put('/acomodacoes/:id', ensurePousadaId, validar(schemas.acomodacao), atualizarAcomodacao);
router.delete('/acomodacoes/:id', ensurePousadaId, excluirAcomodacao);

router.get('/tarifas', listarTarifas);
router.post('/tarifas', ensurePousadaId, validar(schemas.tarifa), criarTarifa);
router.post('/tarifas/lote', ensurePousadaId, validar(schemas.tarifaLote), criarTarifasLote);
router.put('/tarifas/:id', ensurePousadaId, validar(schemas.tarifa), atualizarTarifa);
router.delete('/tarifas/:id', ensurePousadaId, excluirTarifa);

export default router;