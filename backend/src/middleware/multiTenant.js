export const multiTenant = (req, res, next) => {
  if (!req.pousadaId) {
    return res.status(400).json({ erro: 'Contexto de pousada não encontrado' });
  }

  req.query.pousadaId = req.pousadaId.toString();
  next();
};

export const ensurePousadaId = (req, res, next) => {
  if (req.body.pousadaId && req.body.pousadaId !== req.pousadaId.toString()) {
    return res.status(403).json({ erro: 'Não é permitido acessar dados de outra pousada' });
  }
  req.body.pousadaId = req.pousadaId.toString();
  next();
};