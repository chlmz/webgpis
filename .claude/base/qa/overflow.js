const { chromium } = require('playwright'); const fs=require('fs'); const B=process.argv[2]+'/bs';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.route('**/bootstrap@5.3.3/**/*.css', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.min.css'), contentType: 'text/css' }));
  await p.route('**/bootstrap@5.3.3/**/*.js', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.bundle.min.js'), contentType: 'application/javascript' }));
  await p.route('**fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto(process.argv[3], { waitUntil: 'load' }); await p.waitForTimeout(500);
  const out = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && !e.closest('.gpis-band__scroll'); }).slice(0, 8).map(e => e.tagName + '.' + [...e.classList].join('.') + ' right=' + Math.round(e.getBoundingClientRect().right)));
  console.log(out.join('\n')); await b.close();
})();
