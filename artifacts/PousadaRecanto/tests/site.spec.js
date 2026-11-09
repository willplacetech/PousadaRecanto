import { test, expect } from '@playwright/test';

test('carrega fotos e fontes locais e mantém a galeria interativa', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByTestId('hero-title')).toHaveText('Recantoda Paz');
  await expect(page.getByTestId('hero-photo')).toHaveJSProperty('complete', true);
  expect(await page.getByTestId('hero-photo').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px "Plus Jakarta Sans"'))).toBeTruthy();
  await page.getByTestId('gallery-item-0').click();
  await expect(page.getByTestId('gallery-lightbox')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('lightbox-figure').locator('img')).toHaveAttribute('src', '/photos/gmap_2.jpg');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('gallery-lightbox')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('valida datas e prepara a solicitação de reserva sem depender da Emergent', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.__openedUrls = [];
    window.open = (url) => { window.__openedUrls.push(url); return null; };
  });
  await page.getByTestId('form-submit-button').click();
  await expect(page.getByTestId('form-error-name')).toBeVisible();
  await expect(page.getByTestId('form-error-phone')).toBeVisible();
  await page.getByTestId('form-input-name').fill('Maria Silva');
  await page.getByTestId('form-input-phone').fill('(19) 99999-9999');
  const date = new Date();
  date.setDate(date.getDate() + 10);
  const checkin = date.toISOString().slice(0, 10);
  date.setDate(date.getDate() + 2);
  const checkout = date.toISOString().slice(0, 10);
  await page.getByTestId('form-input-checkin').fill(checkin);
  await page.getByTestId('form-input-checkout').fill(checkin);
  await page.getByTestId('form-submit-button').click();
  await expect(page.getByTestId('form-error-checkout')).toContainText('após');
  await page.getByTestId('form-input-checkout').fill(checkout);
  await page.getByTestId('form-submit-button').click();
  await expect.poll(() => page.evaluate(() => window.__openedUrls.length)).toBe(1);
  const url = await page.evaluate(() => window.__openedUrls[0]);
  expect(url).toContain('https://wa.me/');
  expect(new URL(url).searchParams.get('text')).toContain('Maria Silva');
  expect(new URL(url).searchParams.get('text')).toContain('Hóspedes: 2');
  await expect(page.getByTestId('form-input-name')).toHaveValue('');
});

test('abre e fecha o menu no celular sem transbordar a tela', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByTestId('nav-toggle').click();
  await expect(page.getByTestId('nav-drawer')).toBeVisible();
  await expect(page.getByTestId('nav-drawer')).toHaveCSS('background-color', 'rgba(24, 34, 27, 0.97)');
  await page.getByTestId('drawer-link-galeria').click();
  await expect(page.getByTestId('nav-drawer')).toHaveCount(0);
  await expect(page.getByTestId('gallery-title')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});
