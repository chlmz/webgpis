const { chromium } = require('playwright'); const fs=require('fs'); const S=process.argv[2], B=S+'/bs';
const pages=[['dados','dados'],['linkage','projetos/linkage-dados-populacionais'],['visao','projetos/visao-primeira-pessoa-ia'],['metodos','pesquisa/metodos-e-inovacao'],['publicacoes','publicacoes'],['trajetoria','pesquisa/saude-mental-curso-de-vida'],['geracoes','pesquisa/saude-entre-geracoes'],['crises','pesquisa/crises-e-desigualdades'],['enchentes','projetos/enchentes-saude-mental'],['cuidado','projetos/visoes-do-cuidado']];
const times={dados:[1400],linkage:[900],visao:[1700],metodos:[900],publicacoes:[1000],trajetoria:[1900],geracoes:[1200],crises:[900],enchentes:[1300],cuidado:[1500]};
(async()=>{ const b=await chromium.launch(); const errs=[];
  for (const [k,u] of pages) {
    const p=await b.newPage({viewport:{width:1440,height:700}});
    await p.route('**/bootstrap@5.3.3/**/*.css', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.min.css'), contentType: 'text/css' }));
    await p.route('**/bootstrap@5.3.3/**/*.js', r => r.fulfill({ body: fs.readFileSync(B + '/bootstrap.bundle.min.js'), contentType: 'application/javascript' }));
    await p.route('**fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
    p.on('pageerror',e=>errs.push(k+': '+e.message));
    await p.goto(`http://localhost:8765/${u}/`,{waitUntil:'load'});
    const box = await p.$eval('.gpis-mark', e => { const r=e.getBoundingClientRect(); return {x:Math.max(0,r.x-30), y:Math.max(0,r.y-30), w:r.width+60, h:r.height+60}; });
    const clip={x:box.x,y:box.y,width:Math.min(1440-box.x,box.w),height:box.h};
    // temporarily raise opacity for legibility in the sheet
    await p.addStyleTag({content:'.gpis-mark__grp{opacity:.45 !important}'});
    await p.waitForTimeout(times[k][0]); await p.screenshot({path:`${S}/g-${k}-mid.png`, clip});
    await p.waitForTimeout(4500); await p.screenshot({path:`${S}/g-${k}-end.png`, clip});
    await p.close();
  }
  console.log('errors',errs); await b.close(); })();
