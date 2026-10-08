import { beforeAll, afterAll, beforeEach, describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Pousada, Usuario, Acomodacao, Reserva, Bloqueio, Alerta, Tarifa, CalendarioICal, EmailReserva } from '../src/models/index.js';
import * as downloads from '../src/services/icalEvents.js';
import * as extraction from '../src/services/emailExtraction.js';
let app, db, p, quarto, token, leitor;
const body = () => ({ hospede: { nome: 'Ana Teste', telefone: '11999999999' }, acomodacao: String(quarto._id), checkin: '2027-01-10', checkout: '2027-01-12', numHospedes: 2 });
beforeAll(async () => {
  process.env.JWT_SECRET = 'teste-um-segredo-longo-32-caracteres';
  process.env.CRON_SECRET = 'segredo-cron-teste';
  process.env.WHATSAPP_ENABLED = 'false';
  db = await MongoMemoryReplSet.create({ replSet: { count: 1 }, binary: { version: '8.0.17' } });
  await mongoose.connect(db.getUri());
  await Promise.all(Object.values(mongoose.models).map(m => m.init()));
  app = (await import('../src/app.js')).default;
}, 180000);
afterAll(async () => { await mongoose.disconnect(); if (db) await db.stop(); });
beforeEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(Object.values(mongoose.models).map(m => m.deleteMany({})));
  p = await Pousada.create({ nome: 'Pousada Teste', email: 'p@example.com', whatsapp: '5511999999999', imapConfig: { pass: 'SECRETO', ativo: false } });
  quarto = await Acomodacao.create({ pousadaId: p._id, nome: 'Suíte', tipo: 'suite', maxHospedes: 2, camas: 'Casal', valorPadrao: 150 });
  const dono = await Usuario.create({ pousadaId: p._id, email: 'admin@example.com', senhaHash: 'SenhaLonga123', role: 'dono' });
  const visual = await Usuario.create({ pousadaId: p._id, email: 'leitor@example.com', senhaHash: 'SenhaLonga123', role: 'visualizacao' });
  token = jwt.sign({ id: dono._id }, process.env.JWT_SECRET);
  leitor = jwt.sign({ id: visual._id }, process.env.JWT_SECRET);
  process.env.POUSADA_PUBLICA_ID = String(p._id);
});
const auth = () => ({ Authorization: `Bearer ${token}` });
describe('API integrada com replica set efêmero', () => {
  it('login e configuração não expõem senha IMAP', async () => {
    const r = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', senha: 'SenhaLonga123' });
    expect(r.status).toBe(200);
    const me = await request(app).get('/api/auth/me').set(auth());
    expect(JSON.stringify(me.body)).not.toContain('SECRETO');
    const config = await request(app).get('/api/pousada').set(auth());
    expect(config.status).toBe(200);
    expect(JSON.stringify(config.body)).not.toContain('SECRETO');
  });
  it('reserva pública calcula preço e bloqueia checkout exclusivamente', async () => {
    const r = await request(app).post('/api/publico/reservas').send({ ...body(), valorTotal: 1, pousadaId: new mongoose.Types.ObjectId() });
    expect(r.status).toBe(201);
    expect(r.body.reserva.valorTotal).toBe(300);
    expect(await Bloqueio.countDocuments()).toBe(2);
    expect(await Bloqueio.countDocuments({ data: new Date('2027-01-12') })).toBe(0);
    expect(await Alerta.countDocuments({ tipo: 'bloqueio_manual_pendente' })).toBe(1);
  });
  it('impede duplicação concorrente e cria alerta de conflito', async () => {
    const rs = await Promise.all([request(app).post('/api/publico/reservas').send(body()), request(app).post('/api/publico/reservas').send(body())]);
    expect(rs.map(r => r.status).sort()).toEqual([201, 409]);
    expect(await Reserva.countDocuments()).toBe(1);
    expect(await Alerta.countDocuments({ tipo: 'overbooking' })).toBe(1);
  });
  it('confirma bloqueio manual e resolve alerta vinculado', async () => {
    const r = await request(app).post('/api/publico/reservas').send(body());
    const conf = await request(app).patch(`/api/reservas/${r.body.reserva._id}/bloqueio-manual`).set(auth()).send({ plataformas: ['airbnb', 'booking'] });
    expect(conf.status).toBe(200);
    expect(await Alerta.countDocuments({ tipo: 'bloqueio_manual_pendente', resolvido: false })).toBe(0);
  });
  it('cron usa cabeçalho sem JWT e recusa segredo ausente/incorreto', async () => {
    expect((await request(app).post('/api/sync/ical')).status).toBe(403);
    expect((await request(app).post('/api/sync/ical').set('x-cron-secret', 'errado')).status).toBe(403);
    expect((await request(app).post('/api/sync/ical').set('x-cron-secret', process.env.CRON_SECRET)).status).toBe(200);
  });
  it('perfil de visualização pode ler mas não escrever', async () => {
    expect((await request(app).get('/api/acomodacoes').set('Authorization', `Bearer ${leitor}`)).status).toBe(200);
    expect((await request(app).post('/api/reservas').set('Authorization', `Bearer ${leitor}`).send(body())).status).toBe(403);
  });
  it('acomodação de outra pousada é rejeitada', async () => {
    await Acomodacao.updateOne({ _id: quarto._id }, { pousadaId: new mongoose.Types.ObjectId() });
    expect((await request(app).post('/api/reservas').set(auth()).send(body())).status).toBe(404);
    expect(await Reserva.countDocuments()).toBe(0);
  });
  it('cancelamento libera noites e não permite reativação arbitrária', async () => {
    const r = await request(app).post('/api/publico/reservas').send(body());
    expect((await request(app).patch(`/api/reservas/${r.body.reserva._id}/status`).set(auth()).send({ status: 'cancelada' })).status).toBe(200);
    expect(await Bloqueio.countDocuments()).toBe(0);
    expect((await request(app).patch(`/api/reservas/${r.body.reserva._id}/status`).set(auth()).send({ status: 'confirmada' })).status).toBe(400);
  });
  it('tarifa diária substitui apenas a diária informada', async () => {
    await Tarifa.create({ pousadaId: p._id, acomodacao: quarto._id, data: new Date('2027-01-10'), valor: 200 });
    const r = await request(app).post('/api/publico/reservas').send(body());
    expect(r.body.reserva.valorTotal).toBe(350);
    const disp = await request(app).get('/api/disponibilidade?checkin=2027-01-12&checkout=2027-01-14&hospedes=2').set(auth());
    expect(disp.status).toBe(200);
    expect(disp.body[0].precoTotal).toBe(300);
  });
  it('detecta conflito iCal contra reserva, deduplica e resolve ao liberar noites', async () => {
    const r = await request(app).post('/api/publico/reservas').send(body());
    await Bloqueio.create({ pousadaId: p._id, acomodacao: quarto._id, data: new Date('2027-01-10'), origem: 'ical', referenciaId: new mongoose.Types.ObjectId(), hash: 'externo', canal: 'booking', codigoExterno: 'BK-1' });
    const { detectarOverbooking } = await import('../src/services/reservaService.js');
    await detectarOverbooking(p._id); await detectarOverbooking(p._id);
    expect(await Alerta.countDocuments({ tipo: 'overbooking', resolvido: false })).toBe(1);
    await request(app).patch(`/api/reservas/${r.body.reserva._id}/status`).set(auth()).send({ status: 'cancelada' });
    await detectarOverbooking(p._id);
    expect(await Alerta.countDocuments({ tipo: 'overbooking', resolvido: false })).toBe(0);
  });
  it('reconcilia datas alteradas e canceladas iCal sem tocar na reserva local', async () => {
    const cal = await CalendarioICal.create({ pousadaId: p._id, acomodacao: quarto._id, canal: 'booking', url: 'https://example.com/cal.ics' });
    const event = (start, end, extra = '') => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:BK1\r\nDTSTART;VALUE=DATE:${start}\r\nDTEND;VALUE=DATE:${end}\r\n${extra}END:VEVENT\r\nEND:VCALENDAR\r\n`;
    const mock = vi.spyOn(downloads, 'downloadCalendar').mockResolvedValue(event('20270110','20270112'));
    const { importarICal } = await import('../src/services/icalService.js');
    await importarICal(p._id, cal); expect(await Bloqueio.countDocuments({ origem: 'ical' })).toBe(2);
    mock.mockResolvedValue(event('20270111','20270113')); await importarICal(p._id, cal);
    expect(await Bloqueio.countDocuments({ origem: 'ical', data: new Date('2027-01-10') })).toBe(0);
    mock.mockResolvedValue('<html>bad</html>'); await expect(importarICal(p._id, cal)).rejects.toThrow();
    expect(await Bloqueio.countDocuments({ origem: 'ical' })).toBe(2);
    mock.mockResolvedValue(event('20270111','20270113','STATUS:CANCELLED\r\n')); await importarICal(p._id, cal);
    expect(await Bloqueio.countDocuments({ origem: 'ical' })).toBe(0);
  });
  it('snapshot iCal atrasado não substitui uma sincronização mais nova', async () => {
    const cal = await CalendarioICal.create({ pousadaId: p._id, acomodacao: quarto._id, canal: 'booking', url: 'https://example.com/cal.ics' });
    const body = date => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:BK1\r\nDTSTART;VALUE=DATE:${date}\r\nDTEND;VALUE=DATE:20270113\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
    let release, started;
    const ready = new Promise(resolve => { started = resolve; });
    vi.spyOn(downloads, 'downloadCalendar').mockImplementationOnce(() => { started(); return new Promise(resolve => { release = resolve; }); }).mockResolvedValueOnce(body('20270112'));
    const { importarICal } = await import('../src/services/icalService.js');
    const old = importarICal(p._id, cal); await ready;
    await importarICal(p._id, cal); release(body('20270110'));
    await expect(old).rejects.toThrow();
    expect(await Bloqueio.countDocuments({ origem: 'ical' })).toBe(1);
    expect((await Bloqueio.findOne()).data.toISOString().slice(0,10)).toBe('2027-01-12');
  });
  it('e-mail cria, deduplica, altera e cancela pelo código sem exigir quarto no cancelamento', async () => {
    const extrair = vi.spyOn(extraction, 'extrairDadosReserva').mockResolvedValue({ dadosExtraidos: { tipo: 'nova', plataforma: 'booking', codigoExterno: 'BOOK1', checkin: '2027-01-10', checkout: '2027-01-12', nomeAcomodacao: 'Suíte', nomeHospede: 'Ana', numHospedes: 2 } });
    const { processarEmailReserva } = await import('../src/services/emailService.js');
    const create = i => EmailReserva.create({ pousadaId: p._id, messageId: `msg-${i}`, remetente: 'noreply@booking.com', assunto: 'Reserva', corpo: 'Texto' });
    const e1 = await create(1); expect((await processarEmailReserva(e1)).sucesso).toBe(true);
    expect((await processarEmailReserva(await create(2))).sucesso).toBe(true); expect(await Reserva.countDocuments()).toBe(1);
    await Reserva.updateOne({}, { status: 'checkin' });
    extrair.mockResolvedValue({ dadosExtraidos: { tipo: 'alteracao', plataforma: 'booking', codigoExterno: 'BOOK1', checkin: '2027-01-12', checkout: '2027-01-15', nomeAcomodacao: 'Suíte' } });
    expect((await processarEmailReserva(await create(3))).sucesso).toBe(true); expect(await Bloqueio.countDocuments()).toBe(3);
    expect((await Reserva.findOne()).status).toBe('checkin');
    await Reserva.updateOne({}, { status: 'checkout' });
    expect((await processarEmailReserva(await create(5))).sucesso).toBe(false);
    expect((await Reserva.findOne()).status).toBe('checkout');
    await Reserva.updateOne({}, { status: 'checkin' });
    extrair.mockResolvedValue({ dadosExtraidos: { tipo: 'cancelamento', plataforma: 'booking', codigoExterno: 'BOOK1' } });
    expect((await processarEmailReserva(await create(4))).sucesso).toBe(true); expect(await Bloqueio.countDocuments()).toBe(0);
    expect((await Reserva.findOne()).status).toBe('cancelada');
  });
  it('tarifas não podem apontar para acomodação de outra pousada', async () => {
    await Acomodacao.updateOne({ _id: quarto._id }, { pousadaId: new mongoose.Types.ObjectId() });
    const r = await request(app).post('/api/tarifas').set(auth()).send({ acomodacao: String(quarto._id), data: '2027-01-10', valor: 100 });
    expect(r.status).toBe(404); expect(await Tarifa.countDocuments()).toBe(0);
  });
  it('exportação iCal exige token e mantém UID sem expor hóspede', async () => {
    await request(app).post('/api/publico/reservas').send(body());
    const url = `/api/ical/${p._id}/${quarto._id}.ics`;
    expect((await request(app).get(url)).status).toBe(404);
    const a = await request(app).get(url).query({ token:p.icalToken });
    const b = await request(app).get(url).query({ token:p.icalToken });
    expect(a.status).toBe(200); expect(a.text).not.toContain('Ana Teste');
    expect(a.text.match(/^UID:.*$/gm)).toEqual(b.text.match(/^UID:.*$/gm));
    expect(a.text).toContain('DTSTART;VALUE=DATE:20270110');
    expect(a.text).not.toContain('DTSTART;VALUE=DATE:20270112');
    expect((await Pousada.findById(p._id)).ultimoPullIcal).toBeInstanceOf(Date);
  });
  it('manutenção recusa noite reservada e exclusão preserva referência da acomodação', async () => {
    await request(app).post('/api/publico/reservas').send(body());
    const r = await request(app).post('/api/tarifas').set(auth()).send({ acomodacao: String(quarto._id), data: '2027-01-10', valor: 100, bloqueado: true });
    expect(r.status).toBe(409);
    expect((await request(app).delete(`/api/acomodacoes/${quarto._id}`).set(auth())).status).toBe(409);
    expect(await Acomodacao.countDocuments()).toBe(1);
  });
});
