import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

const gerarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, role: usuario.role, pousadaId: String(usuario.pousadaId._id || usuario.pousadaId) },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email }).populate('pousadaId');
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario);

    res.json({
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role,
        primeiroAcesso: usuario.primeiroAcesso,
        pousada: {
          id: usuario.pousadaId._id,
          nome: usuario.pousadaId.nome
        }
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const trocarSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const usuario = await Usuario.findById(req.usuario._id);

    const senhaValida = await usuario.compararSenha(senhaAtual);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'Senha atual incorreta' });
    }

    usuario.senhaHash = novaSenha;
    usuario.primeiroAcesso = false;
    await usuario.save();

    res.json({ mensagem: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const me = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id).select('-senhaHash').populate('pousadaId');
    res.json({
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role,
        primeiroAcesso: usuario.primeiroAcesso,
        pousada: usuario.pousadaId
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
