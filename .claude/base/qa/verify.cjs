const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path=require('path'),fs=require('fs');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost' } });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1440 } });
  await ctx.route(/(cdn\.jsdelivr\.net|unpkg\.com)\//, async route => {
    const u = new URL(route.request().url());
    let rel = u.pathname.replace(/^\/npm\//,'/').replace(/^\//,'').replace(/^((?:@[^/]+\/)?[^/@]+)@[^/]+/, '$1');
    try { await route.fulfill({ body: fs.readFileSync(path.join(__dirname,'../cdn/node_modules',rel)), contentType: rel.endsWith('.css')?'text/css':rel.endsWith('.json')?'application/json':'application/javascript', headers:{'access-control-allow-origin':'*'} }); } catch { await route.abort(); }
  });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  console.log('pending at load', await p.evaluate(()=>document.querySelectorAll('.is-pending').length));
  for (let y=0;y<9000;y+=500){ await p.mouse.wheel(0,500); await p.waitForTimeout(120); }
  await p.waitForTimeout(1500);
  console.log('current link at bottom:', await p.evaluate(()=>[...document.querySelectorAll('#nav-links .is-current')].map(a=>a.textContent)));
  console.log('still hidden:', await p.evaluate(()=>[...document.querySelectorAll('[data-reveal]')].filter(e=>getComputedStyle(e).opacity!=='1').length));
  console.log('map circles r:', await p.evaluate(()=>[...document.querySelectorAll('#gpis-map circle')].map(c=>c.getAttribute('r'))));
  console.log('errors', errs);
  await b.close();
})();
