const { chromium } = require('@playwright/test');
const { mkdir } = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.ROOMSPROUT_BROWSER_CHANNEL || undefined,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const base = process.env.ROOMSPROUT_URL || 'http://localhost:8081';
  const output = path.join(__dirname, '../docs/screenshots');
  await mkdir(output, { recursive: true });
  const screenshot = async (name) => {
    await page.screenshot({
      path: path.join(output, `${name}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  };
  try {
    await page.goto(base, { waitUntil: 'networkidle', timeout: 120000 });
    await page.getByRole('heading', { name: 'Your room. More you.' }).waitFor();
    await screenshot('landing-desktop');
    assert.equal(
      await page
        .locator('img')
        .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
      true,
      'Landing images must load',
    );
    await page.getByRole('heading', { name: /A softer light/ }).scrollIntoViewIfNeeded();
    await screenshot('landing-middle-desktop');
    await page.getByRole('link', { name: 'RoomSprout home', exact: true }).scrollIntoViewIfNeeded();
    await page.setViewportSize({ width: 390, height: 844 });
    await screenshot('landing-mobile');
    await page.getByRole('link', { name: 'Explore the prototype' }).click();
    await page.getByRole('button', { name: 'Explore the earthy room concept' }).waitFor();
    await screenshot('discover-mobile');
    await page.getByRole('button', { name: 'Style my room' }).click();
    await page.getByRole('heading', { name: 'The whole room.' }).waitFor();
    await screenshot('capture-mobile');
    const chooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Choose photos' }).click();
    await (
      await chooserPromise
    ).setFiles([
      path.join(__dirname, '../assets/room-editorial.jpg'),
      path.join(__dirname, '../assets/reading-corner.jpg'),
    ]);
    await page.getByText('2/3 photos', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Remove Other side photo' }).click();
    await page.getByText('1/3 photos', { exact: true }).waitFor();
    await screenshot('capture-with-photo-mobile');
    assert.equal(await page.getByRole('button', { name: 'Choose a style' }).isDisabled(), false);
    await page.getByRole('button', { name: 'Use a sample room' }).click();
    await page.getByRole('radio', { name: 'Cozy corner' }).click();
    const budget = page.getByRole('textbox', { name: 'Decoration budget in rupiah' });
    await budget.fill('0');
    assert.equal(await page.getByRole('button', { name: 'See my concept' }).isDisabled(), true);
    await budget.fill('250000');
    await page.getByRole('heading', { name: 'Your kind of room.' }).scrollIntoViewIfNeeded();
    await screenshot('preferences-mobile');
    await page.getByRole('button', { name: 'See my concept' }).click();
    await page.getByText('Sample concept', { exact: true }).waitFor();
    await screenshot('result-mobile');
    await page.getByRole('button', { name: 'Save room' }).click();
    await page.getByRole('button', { name: 'View saved room' }).click();
    await page.getByRole('button', { name: 'Open Cozy corner concept' }).waitFor();
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open Cozy corner concept' }).waitFor();
    await screenshot('saved-mobile');
    await page.getByRole('button', { name: 'Finds', exact: true }).click();
    await screenshot('finds-mobile');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search decor finds' }).fill('lamp');
    await page.getByRole('button', { name: 'Save Pleated bedside lamp', exact: true }).click();
    await page.getByRole('button', { name: 'View Pleated bedside lamp' }).click();
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Search similar on Shopee' }).click();
    const popup = await popupPromise;
    assert.ok(popup.url().startsWith('https://shopee.co.id/search?keyword='));
    await popup.close();
    await screenshot('product-mobile');
    await page.getByRole('button', { name: 'Go back' }).click();
    await page.getByRole('textbox', { name: 'Search decor finds' }).fill('nothing-matches');
    await page.getByText('Nothing here just yet.').waitFor();
    await page.getByRole('button', { name: 'Clear search' }).click();
    await page.getByRole('button', { name: 'Saved (1)' }).click();
    await page.getByRole('button', { name: 'View Pleated bedside lamp' }).waitFor();
    await screenshot('finds-saved-mobile');
    await page.getByRole('button', { name: 'All finds', exact: true }).click();
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await screenshot(`finds-${width}`);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `No horizontal overflow at ${width}`,
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      'PASS: landing, photo library selection/removal, sample capture flow, budget validation, saved-room persistence, product bookmarks, marketplace destination, empty search, responsive layouts, no page errors.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
