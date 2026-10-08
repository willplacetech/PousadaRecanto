import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).select('-senhaHash');
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário não encontrado ou inativo' });
    }

    req.usuario = usuario;
    req.pousadaId = usuario.pousadaId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ erro: 'Token inválido' });
    }
    return res.status(500).json({ erro: 'Erro na autenticação' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id).select('-senhaHash');
      if (usuario && usuario.ativo) {
        req.usuario = usuario;
        req.pousadaId = usuario.pousadaId;
      }
    }
    next();
  } catch {
    next();
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.role)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
};