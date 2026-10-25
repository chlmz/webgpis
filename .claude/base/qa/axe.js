const { chromium } = require('playwright'); const fs=require('fs'); const S=process.argv[2], B=S+'/bs';
const axe = fs.readFileSync(S+'/axe/package/axe.min.js','utf8');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.route('**/bootstrap@5.3.3/**/*.css', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.min.css'), contentType: 'text/css' }));
  await p.route('**/bootstrap@5.3.3/**/*.js', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.bundle.min.js'), contentType: 'application/javascript' }));
  await p.route('**fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  for (const pg of ['', 'familias/', 'en/', 'en/familias/']) {
    await p.goto('http://localhost:8765/' + pg, { waitUntil: 'load' }); await p.waitForTimeout(300);
    await p.addScriptTag({ content: axe });
    const r = await p.evaluate(async () => { const res = await axe.run(document, { runOnly: ['wcag2a','wcag2aa'] }); return res.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0,3).map(x => x.target.join(' ') + ' :: ' + (x.failureSummary||'').split('\n').slice(1,2).join('')) })); });
    console.log('== /' + pg, r.length ? '' : 'OK');
    r.forEach(v => { console.log(`  ${v.id} (${v.impact}) x${v.n}`); v.ex.forEach(e => console.log('     ' + e.slice(0, 220))); });
  }
  await b.close();
})();
