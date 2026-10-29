// Dienstensectie in de wereld van de hero: donker, witte letters, roze accent. Jost als nieuwe letter.
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
@font-face{font-family:J;src:url(${font('jost/files/jost-latin-300-normal.woff2')});font-weight:300}
@font-face{font-family:J;src:url(${font('jost/files/jost-latin-400-normal.woff2')});font-weight:400}
@font-face{font-family:J;src:url(${font('jost/files/jost-latin-500-normal.woff2')});font-weight:500}
*{box-sizing:border-box;margin:0}
body{font-family:J;font-weight:300;color:#f4ece8;background:#161111;-webkit-font-smoothing:antialiased;font-size:18px;line-height:1.6}
.wrap{max-width:1280px;margin:0 auto;padding:110px 40px}
h2{font-weight:300;font-size:54px;line-height:1.08;letter-spacing:.02em;text-transform:uppercase}
h2 em{font-style:normal;color:#e3bfb6}
h3{font-weight:400;line-height:1.15;letter-spacing:.06em;text-transform:uppercase}
.eyebrow{font-weight:500;font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:#e3bfb6}
.kop{display:grid;grid-template-columns:7fr 5fr;gap:32px;align-items:end;margin-bottom:64px}
.kop p.intro{font-size:19px;color:#b9a9a4}
a{color:inherit;text-decoration:none}
.lijn{border-top:1px solid #ffffff22}
.link{font-size:13px;letter-spacing:.25em;text-transform:uppercase;font-weight:500;color:#e3bfb6;border-bottom:1px solid #e3bfb680;padding-bottom:4px}
`;
const kop = `<div class="kop"><div><p class="eyebrow">Het atelier</p><h2 style="margin-top:22px">Dit maakt en<br>vermaakt <em>Bei</em></h2></div><p class="intro">Zes dingen waarvoor je in het atelier terechtkunt. Elke dienst heeft een eigen pagina.</p></div>`;

// A. Drie foto's hoog, naam en regel eronder, strakke naden, geen kaders
const A = `<div class="wrap">${kop}
<ul style="list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:40px 24px">
${diensten.map(([t, s, f, p]) => `<li><a>
<span style="display:block;aspect-ratio:3/4;overflow:hidden"><img src="${foto(f)}" style="width:100%;height:100%;object-fit:cover;object-position:${p};filter:saturate(.9)"></span>
<h3 style="font-size:19px;margin-top:22px">${t}</h3><p style="margin-top:8px;color:#b9a9a4;font-size:16px">${s}</p>
<span class="link" style="display:inline-block;margin-top:14px">Bekijk</span></a></li>`).join('')}
</ul></div>`;

// B. Index: namen groot links in kapitalen, grote foto rechts
const B = `<div class="wrap">${kop}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:72px">
<ol style="list-style:none;display:flex;flex-direction:column;justify-content:center">
${diensten.map(([t, s], i) => `<li class="lijn" style="padding:24px 0;${i === 5 ? 'border-bottom:1px solid #ffffff22' : ''}"><a style="display:flex;justify-content:space-between;align-items:baseline;gap:20px">
<span><h3 style="font-size:${i === 0 ? 26 : 22}px;color:${i === 0 ? '#e3bfb6' : '#f4ece8'}">${t}</h3>${i === 0 ? `<span style="display:block;margin-top:8px;color:#b9a9a4;text-transform:none;letter-spacing:0">${s}</span>` : ''}</span>
<span style="color:#e3bfb6;opacity:${i === 0 ? 1 : .3}">&rarr;</span></a></li>`).join('')}
</ol>
<div style="position:relative;overflow:hidden;min-height:640px"><img src="${foto('s-maken')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%"></div>
</div></div>`;

// C. Twee kolommen tekst, één brede foto erboven, namen in kapitalen met regel eronder
const C = `<div class="wrap">${kop}
<div style="height:380px;overflow:hidden"><img src="${foto('kant')}" style="width:100%;height:100%;object-fit:cover;object-position:50% 45%"></div>
<ul style="list-style:none;margin-top:8px;display:grid;grid-template-columns:1fr 1fr;column-gap:72px">
${diensten.map(([t, s]) => `<li class="lijn" style="padding:28px 0"><a style="display:flex;justify-content:space-between;align-items:center;gap:24px">
<span><h3 style="font-size:22px">${t}</h3><span style="display:block;margin-top:6px;color:#b9a9a4;font-size:16px">${s}</span></span><span class="link">Bekijk</span></a></li>`).join('')}
</ul></div>`;

const br = await chromium.launch();
for (const [naam, html] of [['donker-A-drie-fotos', A], ['donker-B-index', B], ['donker-C-tekst', C]]) {
  const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.setContent(`<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>${basis}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await sharp(await p.screenshot({ fullPage: true })).jpeg({ quality: 84 }).toFile(`.seo/out/ontwerpen/${naam}.jpg`);
  console.log(naam, 'ok'); await p.close();
}
await br.close();
