import { timingSafeEqual } from 'node:crypto';
export const cronAuth = (req, res, next) => {
  const expected = process.env.CRON_SECRET;
  const provided = req.get('x-cron-secret');
  if (!expected || !provided || Buffer.byteLength(expected) !== Buffer.byteLength(provided) || !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) return res.status(403).json({ erro: 'Segredo de sincronização inválido' });
  next();
};
export const escritaPermitida = (req, res, next) => {
  if (!['GET','HEAD','OPTIONS'].includes(req.method) && req.usuario?.role === 'visualizacao') return res.status(403).json({ erro: 'Perfil de visualização não pode alterar dados' });
  next();
};
