import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';

const accommodation = { _id: 'a1', nome: 'Suíte Jardim', tipo: 'suite', maxHospedes: 3, camas: 'Casal', valorPadrao: 220, status: 'ativa' };
async function api(page, role = 'dono') {
  const calls = [];
  await page.route('**/api/**', async route => {
    const request = route.request(); const path = new URL(request.url()).pathname;
    calls.push({ path, method: request.method(), body: request.postDataJSON() });
    let data = [];
    if (path === '/api/auth/login') data = { token: 'test-token', usuario: { email: 'dono@test.com', role, pousada: { id: 'p1', nome: 'Recanto da Paz' } } };
    if (path === '/api/auth/me') data = { usuario: { email: 'dono@test.com', role, pousada: { id: 'p1', nome: 'Recanto da Paz' } } };
    if (path === '/api/dashboard/stats') data = { reservasHoje: 2, alertasCriticos: 1, alertasNaoResolvidos: 1, emailsPendentes: 3 };
    if (path === '/api/alertas') data = [{ _id: 'al1', mensagem: 'Bloqueie as plataformas', tipo: 'bloqueio_manual_pendente', detalhes: { reservaId: 'r1' } }];
    if (path === '/api/acomodacoes') data = [accommodation];
    if (path === '/api/reservas') data = request.method() === 'POST' ? { reserva: { codigo: 'R-123', valorTotal: 440 }, preco: { total: 440 } } : { reservas: [] };
    if (path === '/api/reservas/calendario') data = { a1: { nome: 'Suíte Jardim', dias: { '2026-10-08': { canal: 'airbnb', origem: 'ical' } } } };
    if (path === '/api/pousada') data = { _id: 'p1', nome: 'Recanto da Paz', email: 'contato@test.com', whatsapp: '19999999999', icalToken: 'ical-test' };
    if (path === '/api/email/config') data = { host: 'imap.test.com', port: 993, user: 'contato@test.com' };
    await route.fulfill({ json: data });
  });
  return calls;
}
async function login(page) {
  await page.goto('/painel');
  await page.getByLabel('E-mail').fill('dono@test.com');
  await page.getByLabel('Senha', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
}
test('login, manual blocking, create reservation and navigate management', async ({ page }) => {
  const calls = await api(page); await login(page);
  await page.getByRole('button', { name: 'Confirmar bloqueio' }).click();
  expect(calls.some(c => c.path === '/api/reservas/r1/bloqueio-manual' && c.method === 'PATCH')).toBeTruthy();
  await page.getByRole('link', { name: 'Reservas', exact: true }).click();
  await page.getByRole('button', { name: 'Nova reserva' }).click();
  await page.getByLabel('Nome do hóspede').fill('Maria Silva');
  await page.getByLabel('Telefone').fill('19999999999');
  await page.getByLabel('Entrada').fill('2026-10-20');
  await page.getByLabel('Saída').fill('2026-10-22');
  await page.getByLabel('Acomodação', { exact: true }).selectOption('a1');
  await page.getByRole('button', { name: 'Registrar reserva' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'R-123' })).toBeVisible();
  expect(calls.find(c => c.path === '/api/reservas' && c.method === 'POST').body.hospede.nome).toBe('Maria Silva');
  for (const name of ['Calendário', 'Acomodações', 'Sincronização', 'Configurações']) {
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page.getByRole('heading', { name, exact: true, level: 1 })).toBeVisible();
  }
});
test('accommodation and tariff creation send validated values', async ({ page }) => {
  const calls = await api(page); await login(page);
  await page.getByRole('link', { name: 'Acomodações', exact: true }).click();
  await page.getByRole('button', { name: 'Nova acomodação' }).click();
  await page.getByLabel('Nome', { exact: true }).fill('Chalé Bosque');
  await page.getByLabel('Camas').fill('Uma cama de casal');
  await page.getByLabel('Diária padrão (R$)').fill('280');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Alterações salvas' })).toBeVisible();
  expect(calls.find(c => c.path === '/api/acomodacoes' && c.method === 'POST').body.valorPadrao).toBe(280);
  await page.getByRole('button', { name: 'Tarifas por período' }).click();
  await page.getByLabel('Acomodação', { exact: true }).selectOption('a1');
  await page.getByLabel('Início', { exact: true }).fill('2026-12-20');
  await page.getByLabel('Fim (inclusive)').fill('2026-12-30');
  await page.getByLabel('Valor (R$)').fill('320');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect.poll(() => calls.some(c => c.path === '/api/tarifas/lote' && c.body.valor === 320)).toBeTruthy();
});
test('sync and settings preserve IMAP secret and use authenticated manual routes', async ({ page }) => {
  const calls = await api(page); await login(page);
  await page.getByRole('link', { name: 'Sincronização', exact: true }).click();
  await expect(page.getByLabel('Link iCal Suíte Jardim')).toHaveValue(/\/api\/ical\/p1\/a1.ics\?token=ical-test/);
  await page.getByRole('button', { name: 'Sincronizar iCal', exact: true }).click();
  await expect.poll(() => calls.some(c => c.path === '/api/ical/sincronizar' && c.method === 'POST')).toBeTruthy();
  await page.getByRole('button', { name: 'Buscar e-mails agora' }).click();
  await expect.poll(() => calls.some(c => c.path === '/api/email/sincronizar' && c.method === 'POST')).toBeTruthy();
  await page.getByLabel('Servidor IMAP').fill('imap.changed.com');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect.poll(() => calls.some(c => c.path === '/api/email/config' && c.method === 'PUT')).toBeTruthy();
  expect(calls.find(c => c.path === '/api/email/config' && c.method === 'PUT').body).not.toHaveProperty('pass');
  await page.getByRole('link', { name: 'Configurações', exact: true }).click();
  await page.getByLabel('Nome da pousada').fill('Recanto atualizado');
  await page.getByRole('button', { name: 'Salvar', exact: true }).first().click();
  await expect.poll(() => calls.some(c => c.path === '/api/pousada' && c.method === 'PUT')).toBeTruthy();
});
test('read-only role cannot mutate and session expires safely', async ({ page }) => {
  await api(page, 'visualizacao'); await login(page);
  await expect(page.getByRole('button', { name: 'Confirmar bloqueio' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Reservas', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Nova reserva' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Sincronização', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sincronizar iCal', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Salvar', exact: true })).toHaveCount(0);
  await page.route('**/api/acomodacoes', route => route.fulfill({ status: 401, json: { erro: 'Sessão expirada' } }));
  await page.getByRole('link', { name: 'Acomodações', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
});
test('server errors are visible without invented dashboard values', async ({ page }) => {
  await api(page);
  await page.route('**/api/dashboard/stats', route => route.fulfill({ status: 503, json: { erro: 'Serviço indisponível' } }));
  await login(page);
  await expect(page.getByRole('alert')).toContainText('Serviço indisponível');
});
test('calendar includes external blocks and panel fits mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await api(page); await login(page);
  await page.getByRole('link', { name: 'Calendário', exact: true }).click();
  await page.getByLabel('Mês', { exact: true }).fill('2026-10');
  await page.getByRole('button', { name: 'Suíte Jardim, 08/10/2026, airbnb' }).click();
  await expect(page.getByRole('heading', { name: 'Suíte Jardim · 08/10/2026' })).toBeVisible();
  await expect(page.getByLabel('Suíte Jardim, 09/10/2026, disponível', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});
test('public API uses real accommodation and server price, then reports conflicts', async ({ page }) => {
  const origin = 'http://127.0.0.1:5187';
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5187', '--strictPort'], { env: { ...process.env, VITE_API_URL: origin }, stdio: 'ignore' });
  try {
    await expect.poll(async () => { try { return (await page.request.get(origin)).ok(); } catch { return false; } }, { timeout: 15000 }).toBeTruthy();
    const payloads = []; let conflict = false;
    await page.route('**/api/publico/acomodacoes', route => route.fulfill({ json: [accommodation] }));
    await page.route('**/api/publico/reservas', route => {
      payloads.push(route.request().postDataJSON());
      return route.fulfill(conflict ? { status: 409, json: { erro: 'Estas datas já estão ocupadas.' } } : { status: 201, json: { reserva: { codigo: 'PUBLIC-456', valorTotal: 440 }, preco: { total: 440 } } });
    });
    await page.goto(origin);
    await page.getByTestId('form-input-name').fill('Maria Silva');
    await page.getByTestId('form-input-phone').fill('19999999999');
    await page.getByTestId('form-select-stay').selectOption('a1');
    const start = new Date(); start.setDate(start.getDate() + 10);
    await page.getByTestId('form-input-checkin').fill(start.toISOString().slice(0,10));
    start.setDate(start.getDate() + 2);
    await page.getByTestId('form-input-checkout').fill(start.toISOString().slice(0,10));
    await page.getByTestId('form-submit-button').click();
    await expect(page.getByRole('status').filter({ hasText: 'PUBLIC-456' })).toContainText('440,00');
    expect(payloads[0]).toMatchObject({ acomodacao: 'a1', hospede: { nome: 'Maria Silva', telefone: '19999999999' }, numHospedes: 2 });
    expect(payloads[0]).not.toHaveProperty('valorTotal');
    await expect(page.getByTestId('form-input-name')).toHaveValue('');
    conflict = true;
    await page.getByTestId('form-input-name').fill('Joana Silva');
    await page.getByTestId('form-input-phone').fill('19999999999');
    start.setDate(start.getDate() + 1);
    await page.getByTestId('form-input-checkin').fill(start.toISOString().slice(0,10));
    start.setDate(start.getDate() + 2);
    await page.getByTestId('form-input-checkout').fill(start.toISOString().slice(0,10));
    await page.getByTestId('form-submit-button').click();
    await expect(page.getByText('Estas datas já estão ocupadas.')).toBeVisible();
  } finally { server.kill(); }
});

test('calendar exposes all conflicting events and failed sync is not reported as success', async ({ page }) => {
  await api(page); await login(page);
  await page.route('**/api/reservas/calendario?**', route => route.fulfill({ json: { a1: { nome: 'Suíte Jardim', dias: { '2026-10-08': { canal: 'direto', conflito: true, eventos: [{ canal: 'direto', codigo: 'LOCAL-1' }, { canal: 'booking', codigo: 'BK-2' }] } } } } }));
  await page.getByRole('link', { name: 'Calendário', exact: true }).click();
  await page.getByLabel('Mês', { exact: true }).fill('2026-10');
  await page.getByRole('button', { name: 'Suíte Jardim, 08/10/2026, direto, booking' }).click();
  await expect(page.getByText('BK-2')).toBeVisible();
  await page.getByRole('link', { name: 'Sincronização', exact: true }).click();
  await page.route('**/api/ical/sincronizar', route => route.fulfill({ json: { resultados: [{ sucesso: false, erro: 'Calendário indisponível' }] } }));
  await page.getByRole('button', { name: 'Sincronizar iCal', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Calendário indisponível');
  await expect(page.getByText('Sincronização iCal concluída.')).toHaveCount(0);
});

test('a delayed response from a previous session never populates a new session', async ({ page }) => {
  await api(page);
  let logins = 0, release, started = false;
  await page.route('**/api/auth/login', route => route.fulfill({ json: { token: `token-${++logins}`, usuario: { email: `u${logins}@test.com`, role: 'dono', pousada: { nome: `Pousada ${logins}` } } } }));
  await page.route('**/api/reservas?**', async route => {
    if (route.request().headers().authorization === 'Bearer token-1') {
      started = true; await new Promise(resolve => { release = resolve; });
      await route.fulfill({ json: { reservas: [{ _id:'old',codigo:'PRIVADO-A',hospede:{nome:'Hóspede privado A'},acomodacao:accommodation,checkin:'2027-01-01',checkout:'2027-01-03',canal:'direto',status:'pendente',valorTotal:440 }] } });
    } else await route.fulfill({ json: { reservas: [] } });
  });
  await login(page);
  await page.getByRole('link', { name:'Reservas',exact:true }).click();
  await expect.poll(() => started).toBeTruthy();
  await page.getByRole('button', { name:'Sair',exact:true }).click();
  await page.getByLabel('E-mail').fill('novo@test.com');
  await page.getByLabel('Senha', {exact:true}).fill('password123');
  await page.getByRole('button', {name:'Entrar',exact:true}).click();
  await expect(page.getByText('Pousada 2', {exact:true})).toBeVisible();
  const oldResponse = page.waitForResponse(r => r.url().includes('/api/reservas?'));
  release(); await oldResponse;
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.getByText('Hóspede privado A')).toHaveCount(0);
});
