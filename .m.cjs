const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
async function settle(p){let l=-1,s=0;for(let i=0;i<60;i++){const y=await p.evaluate(()=>Math.round(window.scrollY));s=(y===l)?s+1:0;l=y;if(s>=5)return y;await p.waitForTimeout(100);}return l;}
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ ...devices['iPhone 13'] })).newPage();
  await p.goto('http://localhost:3000/ceiba', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => localStorage.setItem('naturatech-boot-loader-seen','true'));
  await p.goto('http://localhost:3000/ceiba', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });

  console.log(JSON.stringify(await p.evaluate(() => {
    const nav = document.querySelector('.ceiba-scene-nav');
    const r = nav.getBoundingClientRect();
    const items = [...document.querySelectorAll('.ceiba-scene-nav-item')];
    const last = items[items.length-1].getBoundingClientRect();
    const scenes = [...document.querySelectorAll('.ceiba-scene')].map(s => Math.round(s.offsetHeight));
    return {
      viewport: window.innerWidth + 'x' + window.innerHeight,
      navAncho: Math.round(r.width), navIzq: Math.round(r.left), navDer: Math.round(r.right),
      seSaleDerecha: r.right > window.innerWidth,
      ultimoItemDer: Math.round(last.right),
      itemsSeSalen: last.right > r.right - 6,
      hintVisible: getComputedStyle(document.querySelector('.ceiba-scene-nav-hint')).display,
      alturasEscenas: scenes,
      overflowH: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      navScrollAncho: nav.scrollWidth,
    };
  }), null, 2));

  // Full-page strip of the journey
  const jTop = await p.evaluate(() => window.scrollY + document.querySelector('.ceiba-journey').getBoundingClientRect().top);
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(jTop));
  await settle(p); await p.waitForTimeout(600);
  await p.screenshot({ path: OUT + '/mj-1.png' });
  // Bottom of the journey where the nav lives
  const navY = await p.evaluate(() => window.scrollY + document.querySelector('.ceiba-scene-nav').getBoundingClientRect().top - 420);
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(navY));
  await settle(p); await p.waitForTimeout(600);
  await p.screenshot({ path: OUT + '/mj-nav.png' });
  await b.close();
})();
