// Vier variaties op ontwerp A (foto met roze onderschrift), waarvan één als swipebare rij.
import { chromium } from 'playwright';
import fs from 'node:fs';
import sharp from 'sharp';

const b64 = (p, t) => `data:${t};base64,${fs.readFileSync(p).toString('base64')}`;
const font = (n) => b64(`node_modules/@fontsource/${n}`, 'font/woff2');
const foto = (n) => b64(`src/assets/${n}.jpg`, 'image/jpeg');

const diensten = [
  ['Bruidsjurk op maat', 'Naar jouw ontwerp, kleur en maat. Ook gekleurd of in een grote maat.', 's-maken', '50% 40%'],
  ['Trouwjurk vermaken', 'Korter, passender of helemaal anders.', 's-vermaken', '50% 35%'],
  ['Jurk voor de bruidsmoeder', 'Afgestemd op de bruidsjurk, prettig de hele dag.', 's-gala', '50% 30%'],
  ['Bruidsmeisjes en bruidsjonkers', 'In één lijn met jouw jurk.', 's-bruidsmeisjes', '50% 45%'],
  ['Gala- en avondkleding', 'Een jurk die alleen jij hebt.', 'satijn', '50% 50%'],
  ['Kleding op maat', 'Ook buiten de bruidsmode.', 's-meer', '40% 50%'],
];

const basis = `
@font-face{font-family:B;src:url(${font('bodoni-moda/files/bodoni-moda-latin-800-normal.woff2')});font-weight:800}
@font-face{font-family:B;src:url(${font('bodoni-moda/files/bodoni-moda-latin-800-italic.woff2')});font-weight:800;font-style:italic}
@font-face{font-family:S;src:url(${font('instrument-sans/files/instrument-sans-latin-400-normal.woff2')});font-weight:400}
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
.nr{font-family:B;font-style:italic;font-weight:800;color:#8f4b4f}
.pijl{width:44px;height:44px;border:1px solid #1b1716;display:inline-grid;place-items:center;font-size:18px}
`;
const kop = (extra = '') => `<div class="kop"><div><p class="eyebrow">Het atelier</p><h2 style="margin-top:18px">Gemaakt en vermaakt, <em>op maat.</em></h2></div>
<div><p class="intro">Van een bruidsjurk die vanaf nul wordt opgebouwd tot een gekochte jurk die eindelijk goed zit.</p>${extra}</div></div>`;

// D. Zoals A, maar het roze label ligt half over de onderkant van de foto, smalle naden, nummer erbij
const D = `<div class="wrap">${kop()}
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
${diensten.map(([t, s, f, p], i) => `<a style="display:block;text-decoration:none;color:inherit;padding-bottom:8px">
<div style="aspect-ratio:4/5;overflow:hidden"><img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}"></div>
<div style="background:#e3bfb6;margin:-56px 16px 0;position:relative;padding:20px 22px 22px">
<span class="nr" style="font-size:15px">0${i + 1}</span><h3 style="font-size:23px;margin-top:4px">${t}</h3><p style="margin-top:6px;font-size:14.5px;color:#4a3f3d">${s}</p></div></a>`).join('')}
</div></div>`;

// E. Swipebare rij: hoge staande foto's, roze onderschrift, vierde half in beeld, pijlen rechtsboven
const E = `<div class="wrap" style="padding-right:0;max-width:none;padding-left:calc((100vw - 1200px)/2)">
<div style="max-width:1200px">${kop(`<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:22px"><span class="pijl" style="opacity:.3">&#8592;</span><span class="pijl">&#8594;</span></div>`)}</div>
<div style="display:flex;gap:16px;overflow:hidden">
${diensten.map(([t, s, f, p], i) => `<a style="flex:0 0 400px;display:block;text-decoration:none;color:inherit">
<div style="aspect-ratio:3/4;overflow:hidden"><img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}"></div>
<div style="background:${i % 2 ? '#f6ebe8' : '#e3bfb6'};padding:22px 24px 26px;display:flex;gap:18px;align-items:baseline">
<span class="nr" style="font-size:22px">0${i + 1}</span><span><h3 style="font-size:24px">${t}</h3><p style="margin-top:4px;font-size:14.5px;color:#4a3f3d">${s}</p></span></div></a>`).join('')}
</div>
<p style="margin-top:22px;font-size:14px;color:#5f5553">Swipe of gebruik de pijlen. Op de telefoon werkt het precies zo.</p></div>`;

// F. Bento: twee grote beelden, vier kleine, roze tag met de titel over de foto
const tag = (t, i, groot) => `<span style="position:absolute;left:0;bottom:0;background:#e3bfb6;padding:${groot ? '16px 22px' : '10px 16px'};display:flex;gap:12px;align-items:baseline"><span class="nr" style="font-size:${groot ? 18 : 14}px">0${i + 1}</span><h3 style="font-size:${groot ? 26 : 19}px">${t}</h3></span>`;
const blok = (i, groot, extra = '') => { const [t, , f, p] = diensten[i]; return `<a style="position:relative;display:block;overflow:hidden;${extra}"><img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p};position:absolute;inset:0">${tag(t, i, groot)}</a>`; };
const F = `<div class="wrap">${kop()}
<div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:380px 380px;gap:12px">
${blok(0, true, 'grid-column:span 2;grid-row:span 2')}${blok(1, false)}${blok(2, false)}${blok(3, false)}${blok(4, false)}
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px;height:380px">${blok(5, true, 'grid-column:span 2')}
<div style="grid-column:span 2;background:#f6ebe8;padding:40px;display:flex;flex-direction:column;justify-content:center"><h3 style="font-size:30px">Staat jouw vraag er niet bij?</h3><p style="margin-top:12px;color:#4a3f3d">Het atelier maakt ook carnavalskleding, turnpakjes en kostuums. Bel of app gerust.</p><p style="margin-top:22px;font-weight:600;text-decoration:underline;text-underline-offset:5px">06 53 61 25 43</p></div></div></div>`;

// G. Hanglabel: foto met daaronder alleen een roze lijn en de titel, nummer als labeltje op de foto. Het lichtst.
const G = `<div class="wrap">${kop()}
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px 20px">
${diensten.map(([t, s, f, p], i) => `<a style="display:block;text-decoration:none;color:inherit">
<div style="position:relative;aspect-ratio:4/5;overflow:hidden"><img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}">
<span style="position:absolute;top:0;left:20px;background:#e3bfb6;padding:8px 12px 10px"><span class="nr" style="font-size:16px">0${i + 1}</span></span></div>
<div style="border-top:3px solid #e3bfb6;margin-top:0;padding-top:14px"><h3 style="font-size:23px">${t}</h3><p style="margin-top:4px;font-size:14.5px;color:#5f5553">${s}</p></div></a>`).join('')}
</div></div>`;

const br = await chromium.launch();
for (const [naam, html] of [['D-label-over-foto', D], ['E-swipe-rij', E], ['F-bento-tags', F], ['G-hanglabel', G]]) {
  const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.setContent(`<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>${basis}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await sharp(await p.screenshot({ fullPage: true })).jpeg({ quality: 84 }).toFile(`.seo/out/ontwerpen/${naam}.jpg`);
  console.log(naam, 'ok'); await p.close();
}
await br.close();
