// Drie varianten van het roze lint, zonder gemengde letters.
import { chromium } from 'playwright';
import sharp from 'sharp';
const B = 'http://127.0.0.1:4536/bei-couture/';
const F = ['Eigen atelier sinds 1997', 'Bruidsmode sinds 2009', 'Ook op zondag open', 'Alles door Bei zelf gemaakt'];
const dm = "font-family:'DM Sans',system-ui,sans-serif;";
const pf = "font-family:'Playfair Display',Georgia,serif;font-weight:400;";
const V = {
  A: { naam: 'A  Rustige regel in gewone tekst, puntjes ertussen', html: `<section style="background:#f7ebe7;color:#272121"><ul style="max-width:1200px;margin:0 auto;padding:1.1rem 1.25rem;display:flex;justify-content:center;gap:0;list-style:none;${dm}font-size:.95rem">${F.map((t, i) => `<li style="display:flex;align-items:center">${i ? '<span style="margin:0 1.6rem;color:#8f4b4f;opacity:.6">·</span>' : ''}${t}</li>`).join('')}</ul></section>` },
  B: { naam: 'B  Kleine kapitalen in rozenhout, gespreid over de breedte', html: `<section style="background:#f7ebe7;color:#733a3e"><ul style="max-width:1200px;margin:0 auto;padding:1.15rem 1.25rem;display:flex;justify-content:space-between;list-style:none;${dm}font-size:.76rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase">${F.map((t) => `<li>${t}</li>`).join('')}</ul></section>` },
  C: { naam: 'C  Het koplettertype, klein en rustig, met dunne lijntjes', html: `<section style="background:#f7ebe7;color:#1b1716"><ul style="max-width:1200px;margin:0 auto;padding:1.05rem 1.25rem;display:flex;justify-content:space-between;align-items:center;list-style:none;${pf}font-size:1.2rem">${F.map((t, i) => `<li style="flex:1;text-align:center;${i ? 'border-left:1px solid #8f4b4f33' : ''}">${t}</li>`).join('')}</ul></section>` },
};
const b = await chromium.launch();
for (const [id, v] of Object.entries(V)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.evaluate((html) => { document.querySelector('section[aria-label="Bei Couture in het kort"]').outerHTML = html; document.querySelectorAll('.rijs').forEach((e) => e.classList.add('in')); }, v.html);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const box = await p.evaluate(() => { const h = document.querySelector('main > section').getBoundingClientRect(); return { x: 0, y: h.bottom - 140 + scrollY, width: innerWidth, height: 420 }; });
  await p.screenshot({ path: `shots/feiten-${id}.png`, fullPage: true, clip: box });
  const strip = await sharp(Buffer.from(`<svg width="1440" height="56"><rect width="100%" height="100%" fill="#1b1716"/><text x="24" y="38" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">${v.naam}</text></svg>`)).png().toBuffer();
  await sharp({ create: { width: 1440, height: 476, channels: 3, background: '#fff' } }).composite([{ input: strip, top: 0, left: 0 }, { input: await sharp(`shots/feiten-${id}.png`).toBuffer(), top: 56, left: 0 }]).jpeg({ quality: 82 }).toFile(`shots/feiten-${id}.jpg`);
  await ctx.close();
}
await b.close();
const imgs = await Promise.all(['A', 'B', 'C'].map((id) => sharp(`shots/feiten-${id}.jpg`).toBuffer()));
await sharp({ create: { width: 1440, height: 476 * 3 + 40, channels: 3, background: '#fff' } }).composite(imgs.map((input, i) => ({ input, top: i * (476 + 20), left: 0 }))).jpeg({ quality: 82 }).toFile('shots/feiten-ABC.jpg');
console.log('klaar');
