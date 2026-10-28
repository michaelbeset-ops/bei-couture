import { chromium } from 'playwright';
const B = 'http://127.0.0.1:4536/bei-couture/';
const paden = process.argv.slice(2);
const b = await chromium.launch();
for (const pad of paden) {
  const naam = pad.replace(/\//g, '_') || 'home';
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const fouten = [];
    p.on('console', (m) => m.type() === 'error' && fouten.push(m.text()));
    p.on('pageerror', (e) => fouten.push(String(e)));
    await p.goto(B + pad, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } scrollTo(0, 0); });
    await p.evaluate(() => document.querySelectorAll('.rijs').forEach(e => e.classList.add('in')));
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `shots/${naam}-${w}.png`, fullPage: true });
    const ovf = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth : 0);
    console.log(naam, w, 'overflow:', ovf, 'fouten:', fouten.length ? fouten : 'geen');
    await ctx.close();
  }
}
await b.close();
