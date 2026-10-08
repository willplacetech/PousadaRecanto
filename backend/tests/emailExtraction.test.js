import { afterEach, describe, expect, it, vi } from 'vitest';
import { extrairDadosReserva, validarDadosReserva, selecionarAcomodacao } from '../src/services/emailExtraction.js';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('email extraction', () => {
  it('allows cancellation with only external identity', () => {
    expect(validarDadosReserva({ tipo: 'cancelamento', plataforma: 'booking', codigoExterno: 'ABC' })).toEqual({ tipo: 'cancelamento', plataforma: 'booking', codigoExterno: 'ABC' });
  });
  it.each(['2026-02-30', '2026-10-32', '2026-1-01'])('rejects invalid civil date %s', checkin => {
    expect(() => validarDadosReserva({ tipo: 'nova', plataforma: 'booking', codigoExterno: 'ABC', checkin, checkout: '2026-11-01', nomeHospede: 'Ana', nomeAcomodacao: 'Suite', numHospedes: 2 })).toThrow();
  });
  it('refuses ambiguous and absent accommodation matches', () => {
    const rooms = [{ _id: '1', nome: 'Suite Azul' }, { _id: '2', nome: 'Suite Verde' }];
    expect(selecionarAcomodacao(rooms, 'Suite')).toBeNull();
    expect(selecionarAcomodacao(rooms, 'Chale')).toBeNull();
    expect(selecionarAcomodacao(rooms, 'Suíte Azul')).toEqual(rooms[0]);
  });
  it('returns the validated extraction wrapper from Gemini JSON', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test'); vi.stubEnv('LLM_PROVIDER', 'gemini');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: '{"tipo":"cancelamento","plataforma":"booking","codigoExterno":"ABC"}' }] } }] }) })));
    expect(await extrairDadosReserva('cancelled ABC', 'Cancelamento', 'booking')).toEqual({ dadosExtraidos: { tipo: 'cancelamento', plataforma: 'booking', codigoExterno: 'ABC' } });
  });
  it('surfaces missing provider credentials without startup failure', async () => {
    vi.stubEnv('GEMINI_API_KEY', ''); vi.stubEnv('GOOGLE_API_KEY', ''); vi.stubEnv('LLM_PROVIDER', 'gemini');
    expect((await extrairDadosReserva('body', 'subject', 'sender')).erro).toBeTruthy();
  });
});
