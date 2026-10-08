import { describe, it, expect } from 'vitest';
import { Reserva, Alerta } from '../src/models/index.js';
import { schemas, validar } from '../src/middleware/validacao.js';

const ids = { pousadaId: '507f1f77bcf86cd799439011', acomodacao: '507f1f77bcf86cd799439012' };
const dados = { ...ids, hospede: { nome: 'Ana Teste', telefone: '11999999999' }, checkin: '2026-11-01', checkout: '2026-11-03', numHospedes: 2, valorTotal: 200, canal: 'direto' };
describe('Regressões do motor', () => {
  it('gera código antes da validação da reserva', async () => {
    const r = new Reserva(dados);
    await expect(r.validate()).resolves.toBeUndefined();
    expect(r.codigo).toMatch(/^RES-/);
  });
  it('aceita contato parcial vindo de plataformas', async () => {
    const r = new Reserva({ ...dados, canal: 'airbnb', origem: 'email', hospede: { nome: 'Ana' } });
    await expect(r.validate()).resolves.toBeUndefined();
  });
  it('aceita o alerta de bloqueio manual e registra a data', async () => {
    const a = new Alerta({ pousadaId: ids.pousadaId, tipo: 'bloqueio_manual_pendente', mensagem: 'Bloqueie' });
    await expect(a.validate()).resolves.toBeUndefined();
    expect(a.createdAt).toBeInstanceOf(Date);
  });
  it('rejeita datas invertidas e datas civis inexistentes', () => {
    expect(schemas.reserva.safeParse({ ...dados, checkin: '2026-11-04' }).success).toBe(false);
    expect(schemas.reserva.safeParse({ ...dados, checkin: '2026-02-30' }).success).toBe(false);
  });
  it('valida disponibilidade pela query sem substituir o body', () => {
    const req = { body: {}, query: { checkin: '2026-11-01', checkout: '2026-11-03', hospedes: '2' } };
    let passed = false;
    validar(schemas.disponibilidade, 'query')(req, { status: () => ({ json: () => {} }) }, () => { passed = true; });
    expect(passed).toBe(true);
    expect(req.query.hospedes).toBe(2);
  });
  it('cursor IMAP avança além de mensagens antigas pendentes de revisão', async () => {
    const { selecionarUids } = await import('../src/services/emailService.js');
    expect(selecionarUids(Array.from({ length: 120 }, (_, i) => i + 1), 100)).toEqual(Array.from({ length: 20 }, (_, i) => i + 101));
  });
});
