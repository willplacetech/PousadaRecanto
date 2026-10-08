import { z } from 'zod';
import { normalizarDia } from '../services/datas.js';
export const validar = (schema, fonte = 'body') => (req, res, next) => {
  try { req[fonte] = schema.parse(req[fonte]); next(); }
  catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ erro: 'Dados inválidos', detalhes: error.errors.map(e => `${e.path.join('.')}: ${e.message}`) });
    next(error);
  }
};
const id = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Identificador inválido');
const dia = z.string().refine(v => { try { return v === normalizarDia(v).toISOString().slice(0, 10); } catch { return false; } }, 'Data deve ser YYYY-MM-DD válida');
const periodo = data => data.checkout > data.checkin && (new Date(data.checkout) - new Date(data.checkin)) <= 366 * 86400000;
const hospede = z.object({ nome: z.string().trim().min(2).max(100), email: z.union([z.string().email().max(254), z.literal('')]).optional(), telefone: z.string().trim().min(10).max(20) });
const reserva = z.object({ hospede, acomodacao: id, checkin: dia, checkout: dia, numHospedes: z.number().int().min(1).max(20), valorTotal: z.number().min(0).optional(), canal: z.enum(['direto', 'airbnb', 'booking', 'expedia', 'outro']).default('direto'), codigoExterno: z.string().trim().min(1).max(200).optional(), origem: z.enum(['manual', 'ical', 'email', 'api']).default('manual'), observacoes: z.string().max(500).optional() });
export const schemas = {
  login: z.object({ email: z.string().trim().toLowerCase().email(), senha: z.string().min(6).max(200) }),
  trocaSenha: z.object({ senhaAtual: z.string().min(6), novaSenha: z.string().min(10).max(200), confirmarSenha: z.string() }).refine(d => d.novaSenha === d.confirmarSenha, { message: 'Senhas não conferem', path: ['confirmarSenha'] }),
  acomodacao: z.object({ nome: z.string().trim().min(1).max(100), tipo: z.enum(['standard','luxo','suite','chalé','bangalô','outro']), maxHospedes: z.number().int().min(1).max(20), camas: z.string().min(1).max(200), valorPadrao: z.number().min(0), status: z.enum(['ativa','inativa','manutencao']).optional(), descricao: z.string().max(1000).optional(), fotos: z.array(z.string().url()).optional() }),
  tarifa: z.object({ acomodacao: id, data: dia, valor: z.number().min(0), bloqueado: z.boolean().optional(), motivoBloqueio: z.string().max(200).optional() }),
  tarifaLote: z.object({ acomodacao: id, inicio: dia, fim: dia, valor: z.number().min(0), bloqueado: z.boolean().optional(), motivoBloqueio: z.string().max(200).optional() }).refine(d => d.fim >= d.inicio && new Date(d.fim) - new Date(d.inicio) <= 365 * 86400000, 'Período inválido'),
  reserva: reserva.refine(periodo, 'Período inválido'),
  reservaPublica: reserva.pick({ hospede: true, acomodacao: true, checkin: true, checkout: true, numHospedes: true, observacoes: true }).refine(periodo, 'Período inválido'),
  reservaStatus: z.object({ status: z.enum(['pendente','confirmada','cancelada','checkin','checkout']) }),
  bloqueioManual: z.object({ plataformas: z.array(z.enum(['airbnb','booking'])).min(2).refine(v => new Set(v).size === 2, 'Confirme Airbnb e Booking') }),
  calendarioICal: z.object({ acomodacao: id, canal: z.enum(['airbnb','booking','expedia','outro']), url: z.string().url().refine(v => /^https?:\/\//i.test(v), 'Use HTTP ou HTTPS'), status: z.enum(['ativo','inativo','erro']).optional() }),
  emailConfig: z.object({ ativo: z.boolean().optional(), host: z.string().min(1).max(200), port: z.number().int().min(1).max(65535), user: z.string().email(), pass: z.string().max(500).optional() }),
  disponibilidade: z.object({ checkin: dia, checkout: dia, hospedes: z.coerce.number().int().min(1).max(20).optional() }).refine(periodo, 'Período inválido'),
  pousada: z.object({ nome: z.string().trim().min(2).max(100), email: z.string().email(), whatsapp: z.string().min(10).max(40), endereco: z.string().max(500).optional(), whatsappAtivo: z.boolean().optional() })
};
