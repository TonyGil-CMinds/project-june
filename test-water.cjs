const { chromium } = require('playwright');
const path = require('path');
const { existsSync, mkdirSync } = require('fs');

const OUT = 'C:\\Temp\\water-shots2';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  await page.goto('http://localhost:3000/ceiba', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Activate water (4 clicks on logo)
  await page.evaluate(() => document.querySelector('.ceiba-info')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(600);
  const logo = page.locator('.ceiba-info-logo');
  for (let i = 0; i < 4; i++) { await logo.click(); await page.waitForTimeout(400); }
  await page.waitForTimeout(1500);

  // Helper: sweep mouse across viewport to generate visible ripples
  const sweep = async () => {
    for (const [x, y] of [[100,200],[400,150],[700,300],[1000,200],[1100,400],[800,500],[400,600],[200,400],[600,300],[900,350]]) {
      await page.mouse.move(x, y);
      await page.waitForTimeout(60);
    }
    await page.mouse.click(640, 400);
    await page.waitForTimeout(300);
  };

  // ── Info section
  await page.evaluate(() => document.querySelector('.ceiba-info')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(400);
  await sweep();
  await page.screenshot({ path: path.join(OUT, '1-info.png') });
  console.log('1: info section');

  // ── Gallery / marquees section
  await page.evaluate(() => document.querySelector('.ceiba-gallery')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(600);
  await sweep();
  await page.screenshot({ path: path.join(OUT, '2-gallery.png') });
  console.log('2: gallery section');

  // ── Hero (top of page)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await sweep();
  await page.screenshot({ path: path.join(OUT, '3-hero.png') });
  console.log('3: hero section');

  // ── Podcast section
  await page.evaluate(() => document.querySelector('.ceiba-podcast')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(600);
  await sweep();
  await page.screenshot({ path: path.join(OUT, '4-podcast.png') });
  console.log('4: podcast section');

  // ── Shapes section
  await page.evaluate(() => document.querySelector('.ceiba-shapes')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(600);
  await sweep();
  await page.screenshot({ path: path.join(OUT, '5-shapes.png') });
  console.log('5: shapes section');

  await browser.close();
  console.log('Done:', OUT);
})();
