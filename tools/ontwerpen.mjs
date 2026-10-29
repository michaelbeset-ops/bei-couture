// Drie ontwerpen voor de sectie "Het atelier", gerenderd met de echte letters en foto's.
import { chromium } from 'playwright';
import fs from 'node:fs';
import sharp from 'sharp';

const b64 = (p, t) => `data:${t};base64,${fs.readFileSync(p).toString('base64')}`;
const font = (n) => b64(`node_modules/@fontsource/${n}`, 'font/woff2');
const foto = (n) => b64(`src/assets/${n}.jpg`, 'image/jpeg');

const diensten = [
  ['Bruidsjurk op maat', 'Jouw trouwjurk, naar jouw ontwerp, kleur en maat. Ook gekleurd of in een grote maat.', 's-maken', '50% 40%'],
  ['Trouwjurk vermaken', 'Je eigen jurk korter, passender of helemaal anders.', 's-vermaken', '50% 35%'],
  ['Jurk voor de bruidsmoeder', 'Afgestemd op de bruidsjurk, prettig de hele dag.', 's-gala', '50% 30%'],
  ['Bruidsmeisjes en bruidsjonkers', 'In één lijn met jouw jurk.', 's-bruidsmeisjes', '50% 45%'],
  ['Gala- en avondkleding', 'Een jurk die alleen jij hebt.', 'satijn', '50% 50%'],
  ['Kleding op maat', 'Ook buiten de bruidsmode.', 's-meer', '40% 50%'],
];

const basis = `
@font-face{font-family:B;src:url(${font('bodoni-moda/files/bodoni-moda-latin-800-normal.woff2')});font-weight:800}
@font-face{font-family:B;src:url(${font('bodoni-moda/files/bodoni-moda-latin-800-italic.woff2')});font-weight:800;font-style:italic}
@font-face{font-family:S;src:url(${font('instrument-sans/files/instrument-sans-latin-400-normal.woff2')});font-weight:400}
@font-face{font-family:S;src:url(${font('instrument-sans/files/instrument-sans-latin-500-normal.woff2')});font-weight:500}
@font-face{font-family:S;src:url(${font('instrument-sans/files/instrument-sans-latin-600-normal.woff2')});font-weight:600}
*{box-sizing:border-box;margin:0}
body{font-family:S;color:#1b1716;background:#fff;-webkit-font-smoothing:antialiased;font-size:17px;line-height:1.6}
.wrap{max-width:1280px;margin:0 auto;padding:96px 40px}
h2{font-family:B;font-weight:800;font-size:64px;line-height:1;letter-spacing:-.03em}
h2 em{font-style:italic;color:#8f4b4f}
h3{font-family:B;font-weight:800;letter-spacing:-.015em;line-height:1.1}
.eyebrow{font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#8f4b4f}
.kop{display:grid;grid-template-columns:7fr 5fr;gap:32px;align-items:end;margin-bottom:56px}
.kop p.intro{font-size:19px;color:#5f5553}
.label{position:absolute;bottom:24px;left:24px;background:#fff;color:#1b1716;padding:8px 14px;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}
`;

// A. Galerij met roze onderschrift: foto en tekst vormen één blok, geen lucht ertussen
const A = `<div class="wrap">
<div class="kop"><div><p class="eyebrow">Het atelier</p><h2 style="margin-top:18px">Gemaakt en vermaakt, <em>op maat.</em></h2></div>
<p class="intro">Van een bruidsjurk die vanaf nul wordt opgebouwd tot een gekochte jurk die eindelijk goed zit.</p></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
${diensten.map(([t, s, f, p], i) => `<a style="display:block;text-decoration:none;color:inherit">
<div style="aspect-ratio:4/5;overflow:hidden"><img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}"></div>
<div style="background:${i % 2 ? '#f6ebe8' : '#e3bfb6'};padding:22px 24px 24px">
<h3 style="font-size:24px">${t}</h3><p style="margin-top:6px;font-size:15px;color:#4a3f3d">${s}</p></div></a>`).join('')}
</div></div>`;

// B. Redactioneel: één groot beeld links, rechts de zes diensten als genummerde index op roze
const B = `<div class="wrap">
<div class="kop"><div><p class="eyebrow">Het atelier</p><h2 style="margin-top:18px">Gemaakt en vermaakt, <em>op maat.</em></h2></div>
<p class="intro">Van een bruidsjurk die vanaf nul wordt opgebouwd tot een gekochte jurk die eindelijk goed zit.</p></div>
<div style="display:grid;grid-template-columns:5fr 7fr;gap:0;min-height:720px">
<div style="position:relative;overflow:hidden"><img src="${foto('s-maken')}" style="width:100%;height:100%;object-fit:cover;object-position:50% 40%;position:absolute;inset:0"><span class="label">Bruidsjurk op maat</span></div>
<ol style="list-style:none;padding:40px 56px;background:#e3bfb6;display:flex;flex-direction:column;justify-content:center">
${diensten.map(([t, s, f], i) => `<li style="display:grid;grid-template-columns:52px 1fr 88px;gap:24px;align-items:center;padding:20px 0;border-top:1px solid #1b171626${i === 5 ? ';border-bottom:1px solid #1b171626' : ''}">
<span style="font-family:B;font-style:italic;font-weight:800;font-size:26px;color:#8f4b4f">0${i + 1}</span>
<span><h3 style="font-size:26px">${t}</h3><span style="display:block;font-size:14.5px;color:#4a3f3d;margin-top:2px">${s}</span></span>
<img src="${foto(f)}" style="width:88px;height:64px;object-fit:cover"></li>`).join('')}
</ol></div></div>`;

// C. Lookbook: drie rijen van twee, foto met roze tekstpaneel ernaast, om en om
const C = `<div class="wrap">
<div class="kop"><div><p class="eyebrow">Het atelier</p><h2 style="margin-top:18px">Gemaakt en vermaakt, <em>op maat.</em></h2></div>
<p class="intro">Van een bruidsjurk die vanaf nul wordt opgebouwd tot een gekochte jurk die eindelijk goed zit.</p></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
${diensten.map(([t, s, f, p], i) => `<a style="display:grid;grid-template-columns:${i % 2 ? '1fr 1.15fr' : '1.15fr 1fr'};min-height:300px;text-decoration:none;color:inherit;background:${i % 3 === 0 ? '#e3bfb6' : i % 3 === 1 ? '#f6ebe8' : '#1b1716'};${i % 3 === 2 ? 'color:#fff' : ''}">
${i % 2 ? '' : `<img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}">`}
<div style="padding:34px 32px;display:flex;flex-direction:column;justify-content:flex-end">
<span style="font-family:B;font-style:italic;font-weight:800;font-size:22px;color:${i % 3 === 2 ? '#e3bfb6' : '#8f4b4f'}">0${i + 1}</span>
<h3 style="font-size:27px;margin-top:10px">${t}</h3><p style="margin-top:8px;font-size:15px;opacity:.85">${s}</p></div>
${i % 2 ? `<img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}">` : ''}
</a>`).join('')}
</div></div>`;

const br = await chromium.launch();
for (const [naam, html] of [['A-galerij-roze', A], ['B-redactioneel-index', B], ['C-lookbook', C]]) {
  const p = await (await br.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })).newPage();
  await p.setContent(`<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>${basis}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const buf = await p.screenshot({ fullPage: true });
  await sharp(buf).jpeg({ quality: 84 }).toFile(`.seo/out/ontwerpen/${naam}.jpg`);
  console.log(naam, 'ok');
  await p.close();
}
await br.close();
