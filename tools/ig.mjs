import { chromium } from 'playwright'; import fs from 'node:fs';
const OUT = 'bron/social/';
const b = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
const c = await b.newContext({ locale: 'nl-NL', viewport: { width: 1280, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
const p = await c.newPage();
const api = [];
p.on('response', async r => { if (/web_profile_info|graphql|api\/v1/.test(r.url())) { try { api.push({ u: r.url(), t: await r.text() }); } catch {} } });
await p.goto('https://www.instagram.com/beicouture/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(5000);
for (const t of ['Optionele cookies afwijzen', 'Optionele cookies weigeren', 'Decline optional cookies', 'Alleen essentiële cookies toestaan']) { const k = p.locator(`button:visible:has-text("${t}")`).first(); if (await k.count()) { await k.click().catch(()=>{}); await p.waitForTimeout(3000); } }
await p.waitForTimeout(3000); for (let i=0;i<6;i++){ await p.mouse.wheel(0,1500); await p.waitForTimeout(1500);} await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(1000); await p.screenshot({ path: OUT + 'profiel.png', fullPage: true });
const txt = await p.evaluate(() => document.body.innerText);
const meta = await p.evaluate(() => [...document.querySelectorAll('meta')].map(m => (m.getAttribute('property')||m.getAttribute('name')) + '=' + m.content).join('\n'));
const imgs = await p.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt, w: i.naturalWidth })));
fs.writeFileSync(OUT + 'profiel.txt', txt + '\n\n---META---\n' + meta);
fs.writeFileSync(OUT + 'imgs.json', JSON.stringify(imgs, null, 1));
fs.writeFileSync(OUT + 'api.json', JSON.stringify(api, null, 1));
console.log(txt.slice(0, 1500)); console.log(meta); console.log('imgs', imgs.length, 'api', api.length);
await b.close();
