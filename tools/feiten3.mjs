// Drie varianten van de feitenregel onder de hero, over de live preview heen.
import { chromium } from 'playwright';
import sharp from 'sharp';
const B = 'http://127.0.0.1:4536/bei-couture/';
const F = [['1997', 'Eigen atelier sinds'], ['2009', 'Bruidsmode sinds'], ['Zo', 'Ook op zondag open'], ['Zelf', 'Alles door Bei zelf gemaakt']];
const kop = "font-family:'Playfair Display',Georgia,serif;font-weight:400;";
const lab = "font-family:'DM Sans',system-ui,sans-serif;font-size:.78rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;";
const V = {
  A: { naam: 'A  Donkere band, vervolg van de hero', html: `
    <section style="background:#1b1716;color:#fff;border-top:1px solid #ffffff1f">
      <div style="max-width:1200px;margin:0 auto;padding:2.6rem 1.25rem;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem">
        ${F.map(([n, t], i) => `<div style="${i ? 'border-left:1px solid #ffffff26;padding-left:2rem' : ''}"><p style="${kop}font-size:3rem;line-height:1;color:#e3bfb6">${n}</p><p style="${lab}margin-top:.9rem;color:#ffffffb8">${t}</p></div>`).join('')}
      </div>
    </section>` },
  B: { naam: 'B  Zacht roze lint, één regel over de hele breedte', html: `
    <section style="background:#f7ebe7;color:#1b1716">
      <ul style="max-width:1200px;margin:0 auto;padding:1.35rem 1.25rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;list-style:none;${lab}font-size:.8rem;color:#733a3e">
        ${F.map(([n, t]) => `<li style="display:flex;align-items:center;gap:.8rem"><span style="${kop}font-size:1.7rem;letter-spacing:0;text-transform:none;color:#8f4b4f">${n}</span>${t}</li>`).join('')}
      </ul>
    </section>` },
  C: { naam: 'C  Witte strook met grote cijfers en haarlijnen van rand tot rand', html: `
    <section style="background:#fff;color:#1b1716;border-top:1px solid #e7e3e0;border-bottom:1px solid #e7e3e0">
      <div style="display:grid;grid-template-columns:repeat(4,1fr)">
        ${F.map(([n, t], i) => `<div style="padding:2.2rem 2rem;text-align:center;${i ? 'border-left:1px solid #e7e3e0' : ''}"><p style="${kop}font-size:2.6rem;line-height:1;color:#1b1716">${n}</p><p style="${lab}margin-top:.8rem;color:#8f4b4f">${t}</p></div>`).join('')}
      </div>
    </section>` },
};
const b = await chromium.launch();
for (const [id, v] of Object.entries(V)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.evaluate((html) => {
    const s = document.querySelector('section[aria-label="Bei Couture in het kort"]');
    s.outerHTML = html;
    document.querySelector('#atelier').style.paddingTop = '4rem';
    document.querySelectorAll('.rijs').forEach((e) => e.classList.add('in'));
  }, v.html);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const box = await p.evaluate(() => { const h = document.querySelector('main > section').getBoundingClientRect(); const a = document.querySelector('#atelier').getBoundingClientRect(); return { x: 0, y: h.bottom - 260 + scrollY, width: innerWidth, height: a.top + 560 - (h.bottom - 260) }; });
  await p.screenshot({ path: `shots/feiten-${id}.png`, fullPage: true, clip: box });
  const strip = await sharp(Buffer.from(`<svg width="1440" height="64"><rect width="100%" height="100%" fill="#1b1716"/><text x="24" y="42" font-family="sans-serif" font-size="30" font-weight="700" fill="#fff">${v.naam}</text></svg>`)).png().toBuffer();
  const m = await sharp(`shots/feiten-${id}.png`).metadata();
  await sharp({ create: { width: 1440, height: m.height + 64, channels: 3, background: '#fff' } }).composite([{ input: strip, top: 0, left: 0 }, { input: await sharp(`shots/feiten-${id}.png`).toBuffer(), top: 64, left: 0 }]).jpeg({ quality: 82 }).toFile(`shots/feiten-${id}.jpg`);
  await ctx.close();
}
await b.close();
console.log('klaar');
