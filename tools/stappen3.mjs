// Drie compacte varianten van "Zo gaat het": links naar rechts, figuurtje per stap, titel en één regel.
import { chromium } from 'playwright';
import sharp from 'sharp';
const B = 'http://127.0.0.1:4536/bei-couture/';
const S = [
  ['Je wens doorgeven', 'Stuur een foto van de jurk die je in gedachten hebt', 'foto'],
  ['In gesprek in het atelier', 'Samen je wensen helder krijgen', 'praat'],
  ['Passen en meten', 'Opmeten, proefjurk aan, stoffen kiezen', 'meet'],
  ['Proefmodel in de juiste stof', 'De pasvorm controleren in het echte materiaal', 'naald'],
  ['De complete jurk', 'Laatste aanpassingen, dan is hij van jou', 'jurk'],
];
const I = {
  foto: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  praat: '<path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  meet: '<path d="M3 15 15 3l6 6L9 21z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
  naald: '<path d="M20 4 6 18"/><path d="M6 18a2 2 0 1 0 0 .01"/><path d="M4 21c3-1 5-2 7-4"/>',
  jurk: '<path d="M9 3c0 3 .5 5-2 8-2 2.5-2 6-2 10h14c0-4 0-7.5-2-10-2.5-3-2-5-2-8"/><path d="M9 3h6"/>',
};
const ic = (n, kleur, maat = 30) => `<svg viewBox="0 0 24 24" width="${maat}" height="${maat}" fill="none" stroke="${kleur}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;
const pf = "font-family:'Playfair Display',Georgia,serif;font-weight:400;";
const dm = "font-family:'DM Sans',system-ui,sans-serif;";
const kop = (licht) => `<div style="max-width:1200px;margin:0 auto;padding:0 1.25rem 2.2rem;display:flex;align-items:flex-end;justify-content:space-between;gap:2rem"><div><p style="${dm}font-size:.8rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:${licht ? '#e3bfb6' : '#8f4b4f'}">Zo gaat het</p><h2 style="${pf}font-size:2.6rem;line-height:1.1;margin:.9rem 0 0;color:${licht ? '#fff' : '#1b1716'}">Van jouw foto tot <span style="color:${licht ? '#e3bfb6' : '#8f4b4f'}">jouw jurk</span></h2></div><p style="${dm}max-width:26rem;color:${licht ? '#c4b9b5' : '#5f5755'};margin:0">Vijf stappen, elk met een eigen afspraak. Je weet steeds waar je staat.</p></div>`;
const V = {
  A: { naam: 'A  Wit, één doorlopende lijn, figuurtje op de lijn', html: `<section style="background:#fff;padding:4.5rem 0">${kop(false)}
    <div style="max-width:1200px;margin:0 auto;padding:0 1.25rem"><ol style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);position:relative">
      <div style="position:absolute;left:0;right:0;top:27px;border-top:1px solid #8f4b4f55"></div>
      ${S.map(([t, k, i]) => `<li style="padding-right:1.5rem"><div style="display:inline-block;background:#fff;padding:0 .6rem 0 0;position:relative">${ic(i, '#8f4b4f', 54)}</div><h3 style="${pf}font-size:1.35rem;line-height:1.2;margin:1.1rem 0 0;color:#1b1716">${t}</h3><p style="${dm}font-size:.92rem;line-height:1.5;color:#5f5755;margin:.5rem 0 0">${k}</p></li>`).join('')}
    </ol></div></section>` },
  B: { naam: 'B  Zacht roze, vijf vakken met pijltjes ertussen', html: `<section style="background:#f7ebe7;padding:4.5rem 0">${kop(false)}
    <div style="max-width:1200px;margin:0 auto;padding:0 1.25rem"><ol style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:.75rem">
      ${S.map(([t, k, i], n) => `<li style="position:relative;background:#fff;padding:1.5rem 1.4rem 1.6rem;border:1px solid #8f4b4f22">${ic(i, '#8f4b4f', 34)}<h3 style="${pf}font-size:1.3rem;line-height:1.2;margin:1rem 0 0;color:#1b1716">${t}</h3><p style="${dm}font-size:.9rem;line-height:1.5;color:#5f5755;margin:.5rem 0 0">${k}</p>${n < 4 ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8f4b4f" stroke-width="1.6" stroke-linecap="round" style="position:absolute;right:-14px;top:50%;transform:translateY(-50%);background:#f7ebe7"><path d="m9 6 6 6-6 6"/></svg>' : ''}</li>`).join('')}
    </ol></div></section>` },
  C: { naam: 'C  Donkere band, figuurtjes in roze, gestippelde naad', html: `<section style="background:#1b1716;padding:4.5rem 0">${kop(true)}
    <div style="max-width:1200px;margin:0 auto;padding:0 1.25rem"><ol style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);position:relative">
      <div style="position:absolute;left:0;right:0;top:24px;border-top:2px dotted #e3bfb6aa"></div>
      ${S.map(([t, k, i]) => `<li style="padding-right:1.5rem"><div style="display:inline-block;background:#1b1716;padding:0 .7rem 0 0;position:relative">${ic(i, '#e3bfb6', 48)}</div><h3 style="${pf}font-size:1.35rem;line-height:1.2;margin:1.1rem 0 0;color:#fff">${t}</h3><p style="${dm}font-size:.92rem;line-height:1.5;color:#c4b9b5;margin:.5rem 0 0">${k}</p></li>`).join('')}
    </ol></div></section>` },
};
const b = await chromium.launch();
const out = [];
for (const [id, v] of Object.entries(V)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.evaluate((html) => { document.querySelector('#werkwijze').outerHTML = html; document.querySelectorAll('.rijs').forEach((e) => e.classList.add('in')); }, v.html);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const box = await p.evaluate(() => { const s = document.querySelector('section[style*="padding:4.5rem"]').getBoundingClientRect(); return { x: 0, y: s.top + scrollY, width: innerWidth, height: s.height }; });
  await p.screenshot({ path: `shots/stappen-${id}.png`, fullPage: true, clip: box });
  const strip = await sharp(Buffer.from(`<svg width="1440" height="56"><rect width="100%" height="100%" fill="#3a3030"/><text x="24" y="38" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">${v.naam}</text></svg>`)).png().toBuffer();
  const m = await sharp(`shots/stappen-${id}.png`).metadata();
  const buf = await sharp({ create: { width: 1440, height: m.height + 56, channels: 3, background: '#fff' } }).composite([{ input: strip, top: 0, left: 0 }, { input: await sharp(`shots/stappen-${id}.png`).toBuffer(), top: 56, left: 0 }]).jpeg({ quality: 82 }).toBuffer();
  out.push(buf); console.log(id, m.height);
  await ctx.close();
}
await b.close();
const hs = await Promise.all(out.map((x) => sharp(x).metadata().then((m) => m.height)));
const tot = hs.reduce((a, c) => a + c + 20, 0);
let y = 0; const comp = out.map((input, i) => { const o = { input, top: y, left: 0 }; y += hs[i] + 20; return o; });
await sharp({ create: { width: 1440, height: tot, channels: 3, background: '#fff' } }).composite(comp).jpeg({ quality: 82 }).toFile('shots/stappen-ABC.jpg');
console.log('klaar');
