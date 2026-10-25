const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { mkdir } = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.ROOMSPROUT_BROWSER_CHANNEL || undefined,
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const errors = [];
  const base = process.env.ROOMSPROUT_URL || 'http://127.0.0.1:4173';
  await context.addInitScript(() =>
    localStorage.setItem(
      'roomsprout.prototype.v1',
      JSON.stringify({
        favorites: ['lamp'],
        rooms: [{ id: 'cozy-250000', mood: 'cozy', budget: 250000, name: 'Cozy corner' }],
      }),
    ),
  );
  // Seed once, then allow the application to manage its own storage.
  const seed = await context.newPage();
  await seed.goto(base + '/studio');
  await seed.close();
  // Future pages must not re-seed after reload.
  // A fresh context avoids changing any real user's collection.
  const state = await context.storageState();
  await context.close();
  const run = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: state,
  });
  const app = await run.newPage();
  app.setDefaultTimeout(30000);
  app.on('pageerror', (e) => errors.push(e.message));
  const shots = path.join(__dirname, '../docs/screenshots');
  await mkdir(shots, { recursive: true });
  const shot = (name) =>
    app.screenshot({ path: path.join(shots, 'ux-' + name + '.png'), fullPage: true });
  const button = (name) => app.getByRole('button', { name, exact: true });
  try {
    await app.goto(base + '/studio/rooms');
    await button('Open Cozy corner').waitFor();
    await button('New room').click();
    await app.getByRole('radio', { name: 'Sample room', exact: true }).click();
    await button('Continue').click();
    await app.getByRole('textbox', { name: 'Room name', exact: true }).fill('Studio bedroom');
    const budget = () =>
      app.getByRole('textbox', { name: 'Decoration budget in rupiah', exact: true });
    await budget().fill('0');
    assert.equal(await button('Preview my plan').isDisabled(), true);
    await button('Close workspace').click();
    await app.reload();
    await button('Open Studio bedroom').click();
    assert.equal(await budget().inputValue(), '0');
    await budget().fill('250000');
    await shot('setup');
    await button('Preview my plan').click();
    await app.getByRole('heading', { name: 'Studio bedroom', exact: true }).waitFor();
    const include = (name) => app.getByRole('checkbox', { name: 'Include ' + name, exact: true });
    assert.equal(await include('Textured ceramic vase').isDisabled(), true);
    await include('Sage cotton throw').click();
    await button('Undo').click();
    assert.equal(await include('Sage cotton throw').isChecked(), true);
    await include('Sage cotton throw').click();
    await include('Textured ceramic vase').click();
    await app.getByText('Rp188,000', { exact: true }).waitFor();
    await shot('plan');
    await button('Done').click();
    await app.reload();
    await button('Open Studio bedroom').click();
    await app.getByText('Rp188,000', { exact: true }).waitFor();
    await button('Close workspace').click();
    await button('Remove Studio bedroom').click();
    await button('Undo').click();
    await button('Open Studio bedroom').waitFor();
    await button('New room').click();
    const photoChooser = app.waitForEvent('filechooser');
    await button('Choose photos').click();
    await (
      await photoChooser
    ).setFiles([
      path.join(__dirname, '../assets/room-editorial.jpg'),
      path.join(__dirname, '../assets/reading-corner.jpg'),
    ]);
    await app.getByText('2/3 views · one is enough', { exact: true }).waitFor();
    await button('Remove selected photo').click();
    await button('Undo').click();
    await app.getByText('2/3 views · one is enough', { exact: true }).waitFor();
    await button('Continue').click();
    await app.getByRole('textbox', { name: 'Room name', exact: true }).fill('Photo room');
    await button('Preview my plan').click();
    await app.getByRole('tab', { name: 'Your room', exact: true }).click();
    await shot('reference');
    await button('Done').click();
    await app.reload();
    await button('Open Photo room').click();
    await app.getByRole('tab', { name: 'Your room', exact: true }).click();
    await app
      .getByText('Your reference photos. No AI analysis has run.', { exact: true })
      .waitFor();
    await button('Change room reference').click();
    await button('Use references').click();
    await app.getByRole('heading', { name: 'Photo room', exact: true }).waitFor();
    await button('Done').click();
    await app.getByRole('tab', { name: 'Finds', exact: true }).click();
    const search = app.getByRole('textbox', { name: 'Search decor finds', exact: true });
    await search.fill('nothing-matches');
    await button('Reset search and filters').click();
    await search.fill('lamp');
    await button('View Pleated bedside lamp').click();
    const popup = app.waitForEvent('popup');
    await app.getByRole('link', { name: 'Search similar on Shopee', exact: true }).click();
    const shop = await popup;
    assert.ok(shop.url().startsWith('https://shopee.co.id/search?keyword='));
    await shop.close();
    await button('Close workspace').click();
    assert.equal(await search.inputValue(), 'lamp');
    await button('Clear search').click();
    await button('Saved (1)').click();
    await app.getByRole('radio', { name: 'Objects', exact: true }).click();
    await app.getByRole('heading', { name: 'No matching finds.', exact: true }).waitFor();
    await button('Reset search and filters').click();
    await app.getByRole('tab', { name: 'My rooms', exact: true }).click();
    await button('New room').click();
    await app.getByRole('radio', { name: 'Room clip', exact: true }).click();
    const clip = app.waitForEvent('filechooser');
    await button('Choose clip').click();
    await (await clip).setFiles(path.join(__dirname, '../tests/fixtures/clip.mp4'));
    await app.locator('video').waitFor();
    await button('Continue').click();
    await app.getByRole('textbox', { name: 'Room name', exact: true }).fill('Clip room');
    await button('Preview my plan').click();
    await app.getByRole('tab', { name: 'Your room', exact: true }).click();
    await app.locator('video').waitFor();
    assert.equal(await app.locator('video').evaluate((v) => v.muted), true);
    await app.reload();
    await app.getByRole('tab', { name: 'Your room', exact: true }).click();
    await app.getByText('Your clip was kept in its original session.', { exact: true }).waitFor();
    await app.goto(base + '/product?id=missing');
    await app.getByRole('heading', { name: 'That find isn’t available.', exact: true }).waitFor();
    await app.goto(base + '/not-a-page');
    await button('Open my studio').click();
    await app.goto(base + '/studio/finds');
    await app.getByRole('heading', { name: /Little finds/ }).waitFor();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await app.setViewportSize({ width, height: 844 });
      await shot('finds-' + width);
      assert.equal(
        await app.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      'PASS: migration, resumable setup, photos, clips, budget controls, item editing, undo, persistence, catalog context, recovery and responsive layout.',
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
