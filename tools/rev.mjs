import { chromium } from 'playwright'; import fs from 'node:fs';
const OUT = 'bron/google/';
const PLACE = JSON.parse(fs.readFileSync(OUT + 'place.json')).PLACE;
const b = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
const p = await (await b.newContext({ locale: 'nl-NL', viewport: { width: 1400, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' })).newPage();
const all = new Map(); let first = true;
for (const sortk of ['Meest relevant', 'Nieuwste', 'Hoogste beoordeling', 'Laagste beoordeling']) {
  await p.goto(PLACE, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2000);
  if (first) { const k = p.locator('button:visible:has-text("Alles afwijzen")').first(); if (await k.count()) { await k.click(); await p.waitForTimeout(4000); } first = false; }
  await p.waitForSelector('h1'); await p.waitForTimeout(3000);
  await p.locator('button[role=tab][aria-label^="Reviews"]').first().click().catch(()=>{}); await p.waitForTimeout(3000);
  const s = p.locator('button[aria-label*="orteren"]').first();
  if (await s.count()) { await s.click(); await p.waitForTimeout(1500); await p.locator(`[role=menuitemradio]:has-text("${sortk}")`).first().click().catch(()=>{}); await p.waitForTimeout(3000); }
  for (let i = 0; i < 15; i++) { await p.evaluate(() => { const d = [...document.querySelectorAll('div')].find(d => d.scrollHeight > d.clientHeight + 100 && /auto|scroll/.test(getComputedStyle(d).overflowY) && d.querySelector('[data-review-id]')); if (d) d.scrollTop = d.scrollHeight; }); await p.waitForTimeout(700); }
  await p.evaluate(() => document.querySelectorAll('button.w8nwRe').forEach(b => b.click())); await p.waitForTimeout(1200);
  const rs = await p.evaluate(() => [...document.querySelectorAll('div[data-review-id][aria-label]')].map(r => ({ id: r.dataset.reviewId, naam: r.getAttribute('aria-label'), sterren: (r.querySelector('[role=img][aria-label*="ster"]') || {}).getAttribute?.('aria-label'), wanneer: (r.querySelector('.rsqaWe') || {}).innerText, tekst: (r.querySelector('.wiI7pd') || {}).innerText || '', antwoord: (r.querySelector('.CDe7pd') || {}).innerText || '' })));
  console.log(sortk, rs.length); rs.forEach(r => all.set(r.id, r));
}
fs.writeFileSync(OUT + 'reviews-unie.json', JSON.stringify([...all.values()], null, 1));
console.log('totaal', all.size);
await p.goto(PLACE, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('h1'); await p.waitForTimeout(3000);
const ot = p.locator('button[role=tab][aria-label^="Over"]').first();
if (await ot.count()) { await ot.click(); await p.waitForTimeout(2500); fs.writeFileSync(OUT + 'over.txt', await p.evaluate(() => document.querySelector('[role=main]')?.innerText || '')); }
await b.close();
