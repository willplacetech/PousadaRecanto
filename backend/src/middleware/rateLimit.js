import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: 5,
  message: { erro: 'Muitas tentativas de login, tente novamente em 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { erro: 'Muitas requisições, tente novamente mais tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const syncLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { erro: 'Muitas requisições de sincronização, tente novamente em 1 minuto' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const icalExportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { erro: 'Muitas requisições de exportação iCal, tente novamente em 1 minuto' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
});