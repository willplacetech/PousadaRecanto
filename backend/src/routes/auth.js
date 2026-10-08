import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimit.js';
import { validar, schemas } from '../middleware/validacao.js';
import { authMiddleware } from '../middleware/auth.js';
import { login, trocarSenha, me } from '../controllers/authController.js';

const router = Router();

router.post('/login', authLimiter, validar(schemas.login), login);
router.post('/trocar-senha', authMiddleware, validar(schemas.trocaSenha), trocarSenha);
router.get('/me', authMiddleware, me);

export default router;