import { chromium } from 'playwright'; import fs from 'node:fs';
const b = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 }, locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' })).newPage();
const out = [];
for (const t of process.argv.slice(2)) {
  await p.goto(`https://unsplash.com/s/photos/${encodeURIComponent(t.replace(/ /g,'-'))}?license=free&orientation=landscape`, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 20; i++) { await p.waitForTimeout(1500); if (await p.locator('figure img[src*="images.unsplash.com/photo-"]').count()) break; }
  const r = await p.evaluate(() => [...document.querySelectorAll('figure a[href*="/photos/"]')].map(a => { const i = a.querySelector('img[src*="images.unsplash.com/photo-"]'); return i ? [a.getAttribute('href'), i.src.match(/photo-[\w-]+/)[0], i.alt] : null; }).filter(Boolean).filter((x,i,a)=>a.findIndex(y=>y[1]===x[1])===i).slice(0, 24));
  console.log('##', t, r.length, p.url().slice(0,80)); for (const x of r) out.push([t, ...x].join('|'));
}
fs.writeFileSync('bron/unsplash/us.txt', out.join('\n')); await b.close();
