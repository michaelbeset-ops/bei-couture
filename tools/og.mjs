// Maakt public/og.jpg: de deelafbeelding voor WhatsApp, Facebook en zoekresultaten.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const b64 = (p, t) => `data:${t};base64,${fs.readFileSync(p).toString('base64')}`;
const f = (n) => b64(path.resolve(n), 'font/woff2');
const kop = f('node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-800-normal.woff2');
const kopIt = f('node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-800-italic.woff2');
const sans = f('node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-400-normal.woff2');
const sansB = f('node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff2');

const logo = b64('src/assets/logo-licht.png', 'image/png');

// Eén deelafbeelding per pagina. Kop en foto volgen de pagina zelf (src/data/diensten.ts).
const paginas = [
  { naam: 'og', foto: 'hero.jpg', pos: '64% 38%', eyebrow: 'Bruidsatelier in Rotterdam', kop: 'Uw droom wordt werkelijkheid in ons <em>atelier.</em>' },
  { naam: 'og-bruidsjurk-op-maat', foto: 'bruidsjurk.jpg', pos: '50% 35%', eyebrow: 'Bruidsjurk op maat', kop: 'Bruidsjurk op maat in <em>Rotterdam.</em>' },
  { naam: 'og-trouwjurk-vermaken', foto: 'vermaken.jpg', pos: '50% 45%', eyebrow: 'Trouwjurk vermaken', kop: 'Trouwjurk vermaken in <em>Rotterdam.</em>' },
  { naam: 'og-bruidsmoeder-jurk', foto: 'bruidsmoeder-zwart.jpg', pos: '50% 30%', eyebrow: 'Moeder van de bruid', kop: 'Een jurk voor de <em>bruidsmoeder.</em>' },
  { naam: 'og-bruidsmeisjes-en-bruidsjonkers', foto: 'bruidsmeisje.jpg', pos: '50% 42%', eyebrow: 'Het hele gezelschap', kop: 'Bruidsmeisjes en <em>bruidsjonkers.</em>' },
  { naam: 'og-gala-en-avondkleding', foto: 'gala.jpg', pos: '50% 50%', eyebrow: 'Gala en avond', kop: 'Gala- en <em>avondkleding.</em>' },
  { naam: 'og-kleding-op-maat', foto: 'kant-patroon.jpg', pos: '50% 50%', eyebrow: 'Kleermaker', kop: 'Kleding op maat en <em>vermaken.</em>' },
  { naam: 'og-werkwijze', foto: 'kant.jpg', pos: '55% 45%', eyebrow: 'Zo gaat het', kop: 'Van jouw foto tot <em>jouw jurk.</em>' },
  { naam: 'og-klantervaringen', foto: 'vermaken-tule.jpg', pos: '50% 40%', eyebrow: 'Klantervaringen', kop: 'De verhalen achter de <em>jurken.</em>' },
  { naam: 'og-contact', foto: 'bei-bloemen.jpg', pos: '66% 30%', eyebrow: 'Contact', kop: 'Kom langs in het <em>atelier.</em>' },
];

const maakHtml = ({ foto, pos, eyebrow, kop }) => `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(${kop}) format('woff2');font-weight:800;font-style:normal}
@font-face{font-family:B;src:url(${kopIt}) format('woff2');font-weight:800;font-style:italic}
@font-face{font-family:S;src:url(${sans}) format('woff2');font-weight:400}
@font-face{font-family:S;src:url(${sansB}) format('woff2');font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;overflow:hidden;background:#1b1716;font-family:S;color:#fff}
.foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos}}
.laag{position:absolute;inset:0;background:linear-gradient(90deg,#1b1716f7 0%,#1b1716e8 44%,#1b171655 78%,#1b171633 100%)}
.in{position:absolute;inset:0;padding:62px 72px;display:flex;flex-direction:column;justify-content:space-between}
.merk{display:flex;align-items:center;gap:22px}
.merk img{width:104px;height:104px;object-fit:contain}
.eyebrow{font-size:19px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#e3bfb6;display:flex;align-items:center;gap:16px}
.eyebrow::before{content:"";width:40px;border-top:2px dashed currentColor}
h1{font-family:B;font-weight:800;font-size:78px;line-height:.98;letter-spacing:-.03em;max-width:15ch;margin-top:20px}
h1 em{font-style:italic;color:#e3bfb6}
.onder{display:flex;align-items:center;gap:26px;font-size:21px;border-top:1.5px dashed #ffffff3d;padding-top:26px}
.onder b{font-weight:600}
.punt{width:5px;height:5px;border-radius:999px;background:#e3bfb6}
.sterren{color:#e3bfb6;letter-spacing:2px}
</style></head><body>
<img class="foto" src="${b64(`src/assets/${foto}`, 'image/jpeg')}"><div class="laag"></div>
<div class="in">
  <div class="merk"><img src="${logo}" alt=""></div>
  <div>
    <p class="eyebrow">${eyebrow}</p>
    <h1>${kop}</h1>
  </div>
  <div class="onder">
    <span class="sterren">&#9733;&#9733;&#9733;&#9733;&#9733;</span><b>5,0</b> op Google
    <span class="punt"></span> Hoogstraat 89A, Rotterdam
    <span class="punt"></span> <b>06 53 61 25 43</b>
  </div>
</div></body></html>`;

const br = await chromium.launch();
const p = await (await br.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })).newPage();
for (const pagina of paginas) {
  await p.setContent(maakHtml(pagina), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const buf = await p.screenshot({ type: 'png' });
  await sharp(buf).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile(`public/${pagina.naam}.jpg`);
  console.log('geschreven: public/' + pagina.naam + '.jpg');
}
await br.close();
