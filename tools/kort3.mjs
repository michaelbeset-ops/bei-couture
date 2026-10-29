import { chromium } from 'playwright';
import sharp from 'sharp';
const B = 'http://127.0.0.1:4536/bei-couture/';
const F = [['Stoffen in het atelier', 'Taft, bruidssatijn, tule en kant. Applicaties, kraaltjes of borduursel kunnen erbij.'], ['Meestal drie pasbeurten', 'Een proefjurk, een proefmodel in de gekozen stof en de complete jurk.'], ['Alles door Bei zelf', 'Dezelfde persoon voert het gesprek, meet je op, knipt en naait.'], ['Nederlands, Engels, Chinees', 'Je kunt in drie talen terecht. Bruiden komen uit Rotterdam en de hele regio.']];
const pf = "font-family:'Playfair Display',Georgia,serif;font-weight:400;";
const dm = "font-family:'DM Sans',system-ui,sans-serif;";
const kop = (licht, k) => `<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem"><div><p style="${dm}font-size:.8rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:${licht ? '#e3bfb6' : '#8f4b4f'};margin:0">In het kort</p><h2 style="${pf}font-size:2.2rem;line-height:1.1;margin:.8rem 0 0;color:${licht ? '#fff' : '#1b1716'}">Goed om te <span style="color:${licht ? '#e3bfb6' : '#8f4b4f'}">weten</span></h2></div></div>`;
const V = {
  A: { naam: 'A  Donkere band tussen de reviews en het roze bezoekblok', html: `<section style="background:#1b1716;padding:3.5rem 0"><div style="max-width:1200px;margin:0 auto;padding:0 1.25rem">${kop(true)}<ul style="list-style:none;margin:2rem 0 0;padding:1.8rem 0 0;border-top:1px solid #ffffff26;display:grid;grid-template-columns:repeat(4,1fr);gap:2.5rem">${F.map(([k, t]) => `<li><h3 style="${pf}font-size:1.3rem;margin:0;color:#fff">${k}</h3><p style="${dm}font-size:.92rem;line-height:1.55;color:#c4b9b5;margin:.6rem 0 0">${t}</p></li>`).join('')}</ul></div></section>` },
  B: { naam: 'B  Als lage witte strook met haarlijnen, op het roze (bovenin het bezoekblok)', html: `<section style="background:#f7ebe7;padding:3rem 0 0"><div style="max-width:1200px;margin:0 auto;padding:0 1.25rem"><ul style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border:1px solid #8f4b4f22">${F.map(([k, t], i) => `<li style="padding:1.4rem 1.5rem;${i ? 'border-left:1px solid #8f4b4f22' : ''}"><h3 style="${pf}font-size:1.2rem;margin:0;color:#1b1716">${k}</h3><p style="${dm}font-size:.88rem;line-height:1.5;color:#5f5755;margin:.5rem 0 0">${t}</p></li>`).join('')}</ul></div></section>` },
  C: { naam: 'C  Rozenhouten band, tekst in wit, heel compact', html: `<section style="background:#8f4b4f;padding:2.6rem 0"><div style="max-width:1200px;margin:0 auto;padding:0 1.25rem"><ul style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:2.5rem">${F.map(([k, t]) => `<li><h3 style="${pf}font-size:1.25rem;margin:0;color:#fff">${k}</h3><p style="${dm}font-size:.9rem;line-height:1.5;color:#ffffffcc;margin:.5rem 0 0">${t}</p></li>`).join('')}</ul></div></section>` },
};
const b = await chromium.launch(); const out = [];
for (const [id, v] of Object.entries(V)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.evaluate((html) => { document.querySelector('section[aria-labelledby="feiten-kop"]').outerHTML = html; document.querySelectorAll('.rijs').forEach((e) => e.classList.add('in')); }, v.html);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const box = await p.evaluate(() => { const r = document.querySelector('#reviews').getBoundingClientRect(); const z = document.querySelector('#bezoek').getBoundingClientRect(); return { x: 0, y: r.bottom - 120 + scrollY, width: innerWidth, height: z.top + 420 - (r.bottom - 120) }; });
  await p.screenshot({ path: `shots/kort-${id}.png`, fullPage: true, clip: box });
  const strip = await sharp(Buffer.from(`<svg width="1440" height="56"><rect width="100%" height="100%" fill="#3a3030"/><text x="24" y="38" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">${v.naam}</text></svg>`)).png().toBuffer();
  const m = await sharp(`shots/kort-${id}.png`).metadata();
  out.push(await sharp({ create: { width: 1440, height: m.height + 56, channels: 3, background: '#fff' } }).composite([{ input: strip, top: 0, left: 0 }, { input: await sharp(`shots/kort-${id}.png`).toBuffer(), top: 56, left: 0 }]).jpeg({ quality: 82 }).toBuffer());
  await ctx.close();
}
await b.close();
const hs = await Promise.all(out.map((x) => sharp(x).metadata().then((m) => m.height)));
let y = 0; const comp = out.map((input, i) => { const o = { input, top: y, left: 0 }; y += hs[i] + 20; return o; });
await sharp({ create: { width: 1440, height: y, channels: 3, background: '#fff' } }).composite(comp).jpeg({ quality: 82 }).toFile('shots/kort-ABC.jpg');
console.log('klaar');
