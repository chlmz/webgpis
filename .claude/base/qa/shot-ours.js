const { chromium } = require('playwright');
const fs = require('fs');
const S = process.argv[2], url = process.argv[3], name = process.argv[4], B = S + '/bs';
(async () => {
  const browser = await chromium.launch();
  for (const [tag, w, h] of [['desk', 1440, 900], ['mob', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.route('**/d3@7.9.0/**', r => r.fulfill({ body: fs.readFileSync(B + '/d3-7.9.0/package/dist/d3.min.js'), contentType: 'application/javascript' }));
    await page.route('**/topojson-client@3.1.0/**', r => r.fulfill({ body: fs.readFileSync(B + '/topojson-client-3.1.0/package/dist/topojson-client.min.js'), contentType: 'application/javascript' }));
    await page.route('**/world-atlas@2.0.2/**', r => r.fulfill({ body: fs.readFileSync(B + '/world-atlas-2.0.2/package/countries-110m.json'), contentType: 'application/json' }));
    await page.route('**/bootstrap@5.3.3/**/*.css', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.min.css'), contentType: 'text/css' }));
    await page.route('**/bootstrap@5.3.3/**/*.js', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.bundle.min.js'), contentType: 'application/javascript' }));
    await page.route('**fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(url, { waitUntil: 'load' });
    const H = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 250) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(60); }
    await page.waitForTimeout(2500);
    if (tag === 'desk' && await page.$('.gpis-band')) {
      await page.evaluate(() => document.querySelector('.gpis-band').scrollIntoView({ block: 'start' })); await page.waitForTimeout(400);
      const b = await page.$('.gpis-band'); await b.screenshot({ path: `${S}/${name}-band.png` });
      const m = await page.$('#network'); await m.screenshot({ path: `${S}/${name}-map.png` });
    }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
    await page.screenshot({ path: `${S}/${name}-${tag}.png`, fullPage: true });
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(tag, 'errors:', errs.length ? errs : 'none', 'horizontal overflow px:', ov);
    await page.close();
  }
  await browser.close();
})();
