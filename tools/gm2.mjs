import { chromium } from 'playwright'; import fs from 'node:fs';
const OUT = 'bron/google/';
let PLACE = 'https://www.google.com/maps/search/' + encodeURIComponent('Bei Couture Hoogstraat 89A Rotterdam') + '?hl=nl';
const b = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
const p = await (await b.newContext({ locale: 'nl-NL', viewport: { width: 1400, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' })).newPage();
async function open() {
  await p.goto(PLACE, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2000);
  const k = p.locator('button:visible:has-text("Alles afwijzen")').first();
  if (await k.count()) { await k.click(); await p.waitForTimeout(4000); }
  await p.waitForSelector('h1'); await p.waitForTimeout(2500);
}
await open(); if (await p.locator('a.hfpxzc').count()) { await p.locator('a.hfpxzc').first().click(); await p.waitForTimeout(3000); } PLACE = p.url(); fs.writeFileSync(OUT + 'place.json', JSON.stringify({ PLACE, h1: await p.locator('h1').first().innerText().catch(()=>''), txt: await p.locator('[role=main]').first().innerText().catch(()=>'') }, null, 1)); await p.screenshot({ path: OUT + 'place.png' });
// openingstijden
const hr = p.locator('[aria-label*="openingstijden" i], [data-item-id="oh"], [jsaction*="openhours"]').first();
await p.locator('text=Gaat open').first().click().catch(() => {}); await p.waitForTimeout(1500);
const uren = await p.evaluate(() => [...document.querySelectorAll('table tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
console.log('uren', uren);
fs.writeFileSync(OUT + 'uren.json', JSON.stringify(uren, null, 1));
await p.screenshot({ path: OUT + 'uren.png' });
// reviews
await open(); if (await p.locator('a.hfpxzc').count()) { await p.locator('a.hfpxzc').first().click(); await p.waitForTimeout(3000); } PLACE = p.url(); fs.writeFileSync(OUT + 'place.json', JSON.stringify({ PLACE, h1: await p.locator('h1').first().innerText().catch(()=>''), txt: await p.locator('[role=main]').first().innerText().catch(()=>'') }, null, 1)); await p.screenshot({ path: OUT + 'place.png' });
const m = p.locator('button:has-text("Meer reviews")').first();
if (await m.count()) { await m.scrollIntoViewIfNeeded().catch(()=>{}); await m.click({ timeout: 5000 }).catch(e => console.log('meer', e.message.slice(0, 60))); await p.waitForTimeout(3000); }
else { await p.locator('button[role=tab]:has-text("Reviews")').first().click(); await p.waitForTimeout(3000); }
const sort = p.locator('button[aria-label*="Sorteren"], button:has-text("Sorteren")').first();
if (await sort.count()) { await sort.click({ timeout: 3000 }).catch(()=>{}); await p.waitForTimeout(1000); await p.locator('[role=menuitemradio]:has-text("Nieuwste")').first().click().catch(()=>{}); await p.waitForTimeout(2500); }
for (let i = 0; i < 60; i++) { await p.evaluate(() => { const d = [...document.querySelectorAll('div')].find(d => d.scrollHeight > d.clientHeight + 100 && /auto|scroll/.test(getComputedStyle(d).overflowY) && d.querySelector('[data-review-id]')); if (d) d.scrollTop = d.scrollHeight; }); await p.waitForTimeout(900); }
await p.evaluate(() => document.querySelectorAll('button.w8nwRe, button[aria-label="Meer weergeven"], button[jsaction*="expandReview"]').forEach(b => b.click()));
for (const mm of await p.locator('[data-review-id] button:has-text("Meer")').all()) await mm.click({ timeout: 800 }).catch(() => {});
await p.waitForTimeout(1200);
const reviews = await p.evaluate(() => [...document.querySelectorAll('div[data-review-id][aria-label]')].map(r => ({
  naam: r.getAttribute('aria-label'), info: (r.querySelector('.RfnDt') || {}).innerText || '', sterren: (r.querySelector('[role=img][aria-label*="ster"]') || {}).getAttribute?.('aria-label'),
  wanneer: (r.querySelector('.rsqaWe') || {}).innerText, tekst: (r.querySelector('.wiI7pd') || {}).innerText || '',
  antwoord: (r.querySelector('.CDe7pd') || {}).innerText || '', fotos: [...r.querySelectorAll('button[data-photo-index], [style*="googleusercontent"]')].map(e => ((e.getAttribute('style') || '').match(/url\("?([^")]+)/) || [])[1]).filter(Boolean).map(x => x.split('=')[0]) })));
fs.writeFileSync(OUT + 'reviews-alle.json', JSON.stringify(reviews, null, 1));
console.log('reviews', reviews.length);
await p.screenshot({ path: OUT + 'reviews2.png' });
// foto's
await open(); if (await p.locator('a.hfpxzc').count()) { await p.locator('a.hfpxzc').first().click(); await p.waitForTimeout(3000); } PLACE = p.url(); fs.writeFileSync(OUT + 'place.json', JSON.stringify({ PLACE, h1: await p.locator('h1').first().innerText().catch(()=>''), txt: await p.locator('[role=main]').first().innerText().catch(()=>'') }, null, 1)); await p.screenshot({ path: OUT + 'place.png' });
await p.locator('button[aria-label^="Foto"]').first().click({ timeout: 5000 }).catch(async () => { await p.locator('button:has-text("Foto\'s bekijken")').first().click().catch(()=>{}); });
await p.waitForTimeout(3500);
const tabs = await p.locator('button[role=tab]').allInnerTexts(); console.log('tabs', tabs);
const out = {};
for (const tab of [...tabs.filter(t => t.trim()), '__']) {
  if (tab !== '__') { await p.locator('button[role=tab]').filter({ hasText: tab }).first().click().catch(()=>{}); await p.waitForTimeout(2500); }
  const s = new Map();
  for (let i = 0; i < 40; i++) {
    const r = await p.evaluate(() => [...document.querySelectorAll('[data-photo-index]')].map(a => { const e = a.querySelector('[style*="googleusercontent"]') || a; const m = (e.getAttribute('style') || '').match(/url\("?([^")]+)/); return [+a.dataset.photoIndex, m ? m[1].split('=')[0] : null]; }));
    r.forEach(([i, u]) => u && s.set(i, u));
    await p.mouse.move(180, 600); await p.mouse.wheel(0, 700); await p.waitForTimeout(400);
  }
  out[tab] = [...s.entries()].sort((a, b) => a[0] - b[0]).map(x => x[1]);
  console.log(tab, out[tab].length);
  await p.screenshot({ path: OUT + 'gal-' + tab.replace(/\W/g, '') + '.png' });
  if (tab === '__') break;
}
fs.writeFileSync(OUT + 'fotos.json', JSON.stringify(out, null, 1));
await b.close();
