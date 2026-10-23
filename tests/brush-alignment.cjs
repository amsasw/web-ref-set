// Run with Playwright available on NODE_PATH: node tests/brush-alignment.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const failures = [];
  try {
    const page = await browser.newPage();
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(pathToFileURL(path.resolve(__dirname, '../toothpaste_theme_demo.html')).href);
      await page.locator('#toothScene').scrollIntoViewIfNeeded();
      for (const progress of [25, 40, 55, 70]) {
        await page.locator('#replay').click();
        const bounds = await page.locator('#toothScene').boundingBox();
        await page.mouse.move(bounds.x + bounds.width * (progress % 2 ? .1 : .9), bounds.y + bounds.height * .25);
        await page.waitForTimeout(550);
        await page.locator('#whitening').fill(String(progress));
        await page.locator('#whitening').dispatchEvent('input');
        const distance = await page.evaluate(() => {
          const tooth = document.querySelector('#tooth');
          const computed = getComputedStyle(tooth);
          // Overlay the actual image box, including its rotation and ancestor transforms.
          const proxy = document.createElement('div');
          Object.assign(proxy.style, {
            position: 'absolute', left: `${tooth.offsetLeft}px`, top: `${tooth.offsetTop}px`,
            width: `${tooth.clientWidth}px`, height: `${tooth.clientHeight}px`,
            transform: computed.transform, transformOrigin: computed.transformOrigin,
            pointerEvents: 'none'
          });
          tooth.parentElement.append(proxy);
          function point(parent, x, y) {
            const marker = document.createElement('i');
            Object.assign(marker.style, { position: 'absolute', left: `${x}%`, top: `${y}%`, width: '0', height: '0' });
            parent.append(marker);
            const rect = marker.getBoundingClientRect();
            marker.remove();
            return { x: rect.x, y: rect.y };
          }
          // Crown contact region in the original image; bristle tips in the brush PNG.
          const crown = point(proxy, 50, 30);
          const brush = point(document.querySelector('#toothbrush'), 14, 43);
          const tip = point(document.querySelector('#toothbrush'), 97, 60);
          const foam = point(document.querySelector('#brushFoam'), 50, 50);
          const scene = document.querySelector('#toothScene').getBoundingClientRect();
          proxy.remove();
          return {
            brushX: Math.abs(brush.x - crown.x) / tooth.clientWidth,
            brushY: Math.abs(brush.y - crown.y) / tooth.clientWidth,
            foamGap: Math.hypot(foam.x - brush.x, foam.y - brush.y) / tooth.clientWidth,
            handleVisible: tip.x >= scene.left && tip.x <= scene.right
          };
        });
        if (distance.brushX > .12 || distance.brushY > .06 || distance.foamGap > .07 || !distance.handleVisible) {
          failures.push({ width, progress, ...distance });
        }
      }
    }
    console.log(JSON.stringify(failures.length ? failures : { result: 'PASS', samples: 12 }, null, 2));
    assert.equal(failures.length, 0, 'Brush tips must stay on the crown, with foam at the contact point');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
