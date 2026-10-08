import { z } from 'zod';

export const validar = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: 'Dados inválidos',
        detalhes: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      });
    }
    next(error);
  }
};

export const schemas = {
  login: z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
  }),

  trocaSenha: z.object({
    senhaAtual: z.string().min(6),
    novaSenha: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
    confirmarSenha: z.string()
  }).refine(data => data.novaSenha === data.confirmarSenha, {
    message: 'Senhas não conferem',
    path: ['confirmarSenha']
  }),

  acomodacao: z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(100),
    tipo: z.enum(['standard', 'luxo', 'suite', 'chalé', 'bangalô', 'outro']),
    maxHospedes: z.number().int().min(1).max(20),
    camas: z.string().min(1, 'Descrição das camas é obrigatória').max(200),
    valorPadrao: z.number().min(0),
    status: z.enum(['ativa', 'inativa', 'manutencao']).optional(),
    descricao: z.string().max(1000).optional(),
    fotos: z.array(z.string().url()).optional()
  }),

  tarifa: z.object({
    acomodacao: z.string(),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve ser YYYY-MM-DD'),
    valor: z.number().min(0),
    bloqueado: z.boolean().optional(),
    motivoBloqueio: z.string().max(200).optional()
  }),

  tarifaLote: z.object({
    acomodacao: z.string(),
    inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    valor: z.number().min(0),
    bloqueado: z.boolean().optional()
  }),

  reserva: z.object({
    hospede: z.object({
      nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
      email: z.string().email('Email inválido'),
      telefone: z.string().min(10, 'Telefone inválido').max(20)
    }),
    acomodacao: z.string(),
    checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    numHospedes: z.number().int().min(1),
    valorTotal: z.number().min(0),
    canal: z.enum(['direto', 'airbnb', 'booking', 'expedia', 'outro']).default('direto'),
    codigoExterno: z.string().optional(),
    origem: z.enum(['manual', 'ical', 'email', 'api']).default('manual'),
    observacoes: z.string().max(500).optional()
  }),

  reservaStatus: z.object({
    status: z.enum(['pendente', 'confirmada', 'cancelada', 'checkin', 'checkout'])
  }),

  calendarioICal: z.object({
    acomodacao: z.string(),
    canal: z.enum(['airbnb', 'booking', 'expedia', 'outro']),
    url: z.string().url('URL inválida')
  }),

  emailConfig: z.object({
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535),
    user: z.string().email(),
    pass: z.string().min(1)
  }),

  disponibilidade: z.object({
    checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hospedes: z.coerce.number().int().min(1).optional()
  })
};