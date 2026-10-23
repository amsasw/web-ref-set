// Requires Playwright and Microsoft Edge. Uses local files; no server required.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(__dirname, '../milk_formula_theme.html')).href);
    await page.locator('.hero-can').evaluate(image => image.decode());
    assert.equal(await page.locator('.hero-can').evaluate(image => image.naturalWidth > 0), true);
    await page.locator('[data-seek="48"]').click();
    assert.equal(await page.locator('#mixProgress').inputValue(), '48');
    assert.equal(await page.locator('.powder-stream').evaluate(el => Number(getComputedStyle(el).opacity)), 1);
    await page.locator('#mixProgress').fill('74');
    await page.locator('#mixProgress').dispatchEvent('input');
    assert.equal(await page.locator('.powder-stream').evaluate(el => Number(getComputedStyle(el).opacity)), 0);
    assert.equal(await page.locator('.scoop').evaluate(el => Number(getComputedStyle(el).opacity)), 0);
    await page.locator('#mixReplay').click();
    await page.waitForFunction(() => Number(document.querySelector('#mixProgress').value) > 3);
    await page.locator('#mixPlay').click();
    const frozen = await page.locator('#mixProgress').inputValue();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('#mixProgress').inputValue(), frozen);
    await page.locator('[data-size="400"]').click();
    await page.locator('#plus').click();
    await page.locator('#add').click();
    assert.match(await page.locator('#toast').textContent(), /400 g × 2/);
    for (let i = 0; i < 7; i++) await page.locator('#plus').click();
    assert.equal(await page.locator('#plus').isDisabled(), true);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    assert.equal(await page.locator('#mixProgress').inputValue(), '100');
    assert.equal(await page.locator('.can-float').evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.goto(pathToFileURL(path.resolve(__dirname, '../stylekit_website_gallery.html')).href);
    await page.locator('.milk-theme').click();
    assert.match(page.url(), /milk_formula_theme.html$/);
    assert.deepEqual(errors, []);
    console.log('PASS: product image, phase controls, powder and scoop timing, replay/pause, sizes, quantity limit, wishlist, responsive widths, reduced motion, gallery entry');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
