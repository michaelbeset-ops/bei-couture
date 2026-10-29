// Vier compleet verschillende opzetten voor de dienstensectie op de homepage.
// Alle zes diensten benoemd, elk klikbaar naar een eigen pagina. Warme tokens, lichte Bodoni, Cormorant.
import { chromium } from 'playwright';
import fs from 'node:fs';
import sharp from 'sharp';

const b64 = (p, t) => `data:${t};base64,${fs.readFileSync(p).toString('base64')}`;
const font = (n) => b64(`node_modules/@fontsource/${n}`, 'font/woff2');
const foto = (n) => b64(`src/assets/${n}.jpg`, 'image/jpeg');

const diensten = [
  ['Bruidsjurk op maat', 'Voor de bruid die een jurk wil die nog niet bestaat.', 's-maken', '50% 40%'],
  ['Trouwjurk vermaken', 'Voor een gekochte jurk, of de jurk van je moeder.', 's-vermaken', '50% 35%'],
  ['Jurk voor de bruidsmoeder', 'Voor de moeder van de bruid of de bruidegom.', 's-gala', '50% 30%'],
  ['Bruidsmeisjes en bruidsjonkers', 'Voor de meisjes en jongens naast de bruid.', 's-bruidsmeisjes', '50% 45%'],
  ['Gala- en avondkleding', 'Voor een gala, feest of jubileum.', 'satijn', '50% 50%'],
  ['Kleding op maat', 'Voor alles buiten de bruidsmode.', 's-meer', '40% 50%'],
];

const basis = `
@font-face{font-family:B;src:url(${font('bodoni-moda/files/bodoni-moda-latin-500-normal.woff2')});font-weight:500}
@font-face{font-family:B;src:url(${font('bodoni-moda/files/bodoni-moda-latin-500-italic.woff2')});font-weight:500;font-style:italic}
@font-face{font-family:C;src:url(${font('cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')});font-weight:500}
@font-face{font-family:C;src:url(${font('cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2')});font-weight:600}
*{box-sizing:border-box;margin:0}
body{font-family:C;color:#3b2a28;background:#f8f1ec;-webkit-font-smoothing:antialiased;font-size:19px;line-height:1.5}
.wrap{max-width:1280px;margin:0 auto;padding:96px 40px}
h2{font-family:B;font-weight:500;font-size:64px;line-height:1.05;letter-spacing:-.01em}
h2 em{font-style:italic;color:#8f4b4f}
h3{font-family:B;font-weight:500;line-height:1.1}
.eyebrow{font-weight:600;font-size:16px;letter-spacing:.22em;text-transform:uppercase;color:#8f4b4f}
.kop{display:grid;grid-template-columns:7fr 5fr;gap:32px;align-items:end;margin-bottom:56px}
.kop p.intro{font-size:22px;color:#6e5955}
a{color:inherit;text-decoration:none}
.link{text-decoration:underline;text-underline-offset:.3em;text-decoration-thickness:1px;color:#8f4b4f;font-weight:600}
`;
const kop = (intro = 'Zes dingen waarvoor je in het atelier terechtkunt. Klik door voor alles over die dienst.') =>
  `<div class="kop"><div><p class="eyebrow">Het atelier</p><h2 style="margin-top:18px">Dit maakt en vermaakt <em>Bei.</em></h2></div><p class="intro">${intro}</p></div>`;

// 1. Index met grote foto: links de zes namen groot onder elkaar, rechts de foto van de aangewezen dienst
const A = `<div class="wrap">${kop()}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:stretch">
<ol style="list-style:none;display:flex;flex-direction:column;justify-content:center">
${diensten.map(([t, s], i) => `<li style="border-top:1px solid #e5d2ca;padding:22px 0;${i === 5 ? 'border-bottom:1px solid #e5d2ca' : ''}">
<a style="display:flex;align-items:baseline;justify-content:space-between;gap:24px">
<span><h3 style="font-size:${i === 0 ? 40 : 34}px;color:${i === 0 ? '#8f4b4f' : '#3b2a28'}">${t}</h3>${i === 0 ? `<span style="display:block;margin-top:6px;color:#6e5955">${s}</span>` : ''}</span>
<span style="font-size:22px;color:#8f4b4f;opacity:${i === 0 ? 1 : .35}">&rarr;</span></a></li>`).join('')}
</ol>
<div style="position:relative;border-radius:14px;overflow:hidden;min-height:640px"><img src="${foto('s-maken')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%">
<span style="position:absolute;left:24px;bottom:24px;background:#f8f1ec;padding:10px 16px;border-radius:999px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;font-size:14px">Bruidsjurk op maat</span></div>
</div>
<p style="margin-top:28px;color:#6e5955">Beweeg over een dienst en de foto wisselt mee. Op de telefoon staat de foto boven elke naam.</p></div>`;

// 2. Banen: zes brede rijen, foto en tekst om en om, elke rij is één link
const B = `<div class="wrap" style="padding-bottom:40px">${kop()}</div>
${diensten.map(([t, s, f, p], i) => `<a style="display:grid;grid-template-columns:1fr 1fr;height:340px;background:${i % 2 ? '#f1dfd9' : '#f8f1ec'}">
${i % 2 ? '' : `<img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}">`}
<div style="padding:48px;display:flex;flex-direction:column;justify-content:center;${i % 2 ? 'align-items:flex-end;text-align:right' : ''}">
<h3 style="font-size:44px">${t}</h3><p style="margin-top:10px;color:#6e5955;max-width:34ch">${s}</p><span class="link" style="margin-top:18px">Lees meer</span></div>
${i % 2 ? `<img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}">` : ''}
</a>`).join('')}<div style="height:60px"></div>`;

// 3. Medaillons: zes ronde foto's op een rij op blush, naam eronder. Op de telefoon swipebaar.
const C = `<div style="background:#f1dfd9"><div class="wrap">${kop('Zes dingen waarvoor je in het atelier terechtkunt. Tik op een rondje voor alles over die dienst.')}
<ul style="list-style:none;display:grid;grid-template-columns:repeat(6,1fr);gap:28px">
${diensten.map(([t, s, f, p]) => `<li><a style="display:block;text-align:center">
<span style="display:block;aspect-ratio:1;border-radius:999px;overflow:hidden;border:6px solid #f8f1ec;box-shadow:0 10px 30px -22px rgb(59 42 40/.4)"><img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p}"></span>
<h3 style="font-size:24px;margin-top:22px">${t}</h3><span style="display:block;margin-top:6px;font-size:16px;color:#6e5955">${s}</span></a></li>`).join('')}
</ul></div></div>`;

// 4. Alleen typografie: één brede atelierfoto, daaronder de zes namen als groot lopend menu, zonder foto's
const D = `<div class="wrap">${kop()}
<div style="border-radius:14px;overflow:hidden;height:360px"><img src="${foto('kant')}" style="width:100%;height:100%;object-fit:cover;object-position:50% 45%"></div>
<ul style="list-style:none;margin-top:56px;columns:2;column-gap:80px">
${diensten.map(([t, s]) => `<li style="break-inside:avoid;border-bottom:1px solid #e5d2ca;padding:26px 0"><a>
<h3 style="font-size:46px">${t}</h3><p style="margin-top:8px;color:#6e5955;display:flex;justify-content:space-between;gap:16px"><span>${s}</span><span class="link" style="white-space:nowrap">Lees meer</span></p></a></li>`).join('')}
</ul></div>`;

const br = await chromium.launch();
for (const [naam, html] of [['1-index-met-foto', A], ['2-banen', B], ['3-medaillons', C], ['4-typografisch', D]]) {
  const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.setContent(`<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>${basis}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await sharp(await p.screenshot({ fullPage: true })).jpeg({ quality: 84 }).toFile(`.seo/out/ontwerpen/diensten-${naam}.jpg`);
  console.log(naam, 'ok'); await p.close();
}
await br.close();
