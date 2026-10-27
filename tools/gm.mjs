import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = 'bron/google/';
const b = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
const p = await (await b.newContext({ locale: 'nl-NL', viewport: { width: 1400, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' })).newPage();
await p.goto('https://www.google.com/maps/search/' + encodeURIComponent("Bei Couture Hoogstraat 89A Rotterdam") + '?hl=nl', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(2000);
const k = p.locator('button:visible:has-text("Alles afwijzen")').first();
if (await k.count()) { await k.click(); await p.waitForTimeout(4000); }
await p.waitForTimeout(3000);
if (await p.locator('a.hfpxzc').count()) { await p.locator('a.hfpxzc').first().click(); await p.waitForTimeout(3000); }
await p.waitForSelector('h1', { timeout: 15000 });
await p.waitForTimeout(2000);
const PLACE = p.url();
const hrs = await p.evaluate(() => [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).filter(a => /maandag|dinsdag|zondag/i.test(a)));
fs.writeFileSync(OUT + 'uren.txt', JSON.stringify(hrs, null, 1) + '\n' + await p.evaluate(() => [...document.querySelectorAll('table')].map(t => t.innerText).join('\n')));
const info = await p.evaluate(() => ({ h1: document.querySelector('h1')?.innerText, txt: document.querySelector('[role=main]')?.innerText }));
fs.writeFileSync(OUT + 'place.json', JSON.stringify({ PLACE, ...info }, null, 1));
await p.screenshot({ path: OUT + 'place.png' });
console.log(PLACE, info.h1);
const rt = p.locator('button[role=tab]:has-text("Reviews")').first();
if (await rt.count()) {
  await rt.click(); await p.waitForTimeout(2500);
  const sort = p.locator('button[aria-label*="Sorteren"], button:has-text("Sorteren")').first();
  if (await sort.count()) { await sort.click(); await p.waitForTimeout(1000); await p.locator('[role=menuitemradio]:has-text("Nieuwste")').first().click().catch(()=>{}); await p.waitForTimeout(2500); }
  for (let i = 0; i < 25; i++) { await p.evaluate(() => { const d = [...document.querySelectorAll('div')].find(d => d.scrollHeight > d.clientHeight + 100 && /auto|scroll/.test(getComputedStyle(d).overflowY) && d.querySelector('[data-review-id]')); if (d) d.scrollTop = d.scrollHeight; }); await p.waitForTimeout(900); }
  for (const m of await p.locator('button:has-text("Meer")').all()) await m.click().catch(() => {});
  await p.waitForTimeout(800);
  const reviews = await p.evaluate(() => [...document.querySelectorAll('div[data-review-id][aria-label]')].map(r => ({
    naam: r.getAttribute('aria-label'), sterren: (r.querySelector('[role=img][aria-label*="ster"]') || {}).getAttribute?.('aria-label'),
    wanneer: (r.querySelector('.rsqaWe') || {}).innerText, tekst: (r.querySelector('.wiI7pd') || {}).innerText || '',
    antwoord: (r.querySelector('.CDe7pd') || {}).innerText || '', fotos: r.querySelectorAll('button[data-photo-index]').length })));
  fs.writeFileSync(OUT + 'reviews.json', JSON.stringify(reviews, null, 1));
  console.log('reviews', reviews.length);
  await p.screenshot({ path: OUT + 'reviews.png' });
}
await p.goto(PLACE, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('h1'); await p.waitForTimeout(2500);
await p.locator('button[aria-label^="Foto"]').first().click().catch(async () => { await p.locator('button:has-text("Foto\'s bekijken")').first().click().catch(()=>{}); });
await p.waitForTimeout(3500);
const out = {};
const tabs = await p.locator('button[role=tab]').allInnerTexts(); console.log('tabs', tabs);
for (const tab of ['Alle', 'Van eigenaar', 'Nieuwste', 'Video\'s']) {
  const t = p.locator(`button[role=tab]:has-text("${tab}")`).first();
  if (!(await t.count())) continue;
  await t.click(); await p.waitForTimeout(2500);
  const s = new Set();
  for (let i = 0; i < 40; i++) {
    const r = await p.evaluate(() => { const d = [...document.querySelectorAll('div')].filter(d => d.scrollHeight > d.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(d).overflowY) && d.getBoundingClientRect().left < 500).pop(); const u = [...document.querySelectorAll('[style*="googleusercontent"]')].map(e => ((e.getAttribute('style') || '').match(/url\("?([^")]+)/) || [])[1]).filter(Boolean); if (d) d.scrollTop += 600; return { u, end: d ? d.scrollTop + d.clientHeight >= d.scrollHeight - 5 : true }; });
    r.u.forEach(x => s.add(x.split('=')[0])); await p.waitForTimeout(500); if (r.end && i > 3) break;
  }
  out[tab] = [...s].filter(x => /gps-cs-s|grass-cs|\/p\//.test(x));
  console.log(tab, out[tab].length);
}
fs.writeFileSync(OUT + 'fotos.json', JSON.stringify(out, null, 1));
await p.screenshot({ path: OUT + 'fotos.png' });
await b.close();
