// Drie lettertype-varianten over de live preview heen, zonder de site te veranderen.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
const B = 'http://127.0.0.1:4536/bei-couture/';
const V = [
  { id: 'A', naam: 'A  Cormorant Garamond + Mulish', kop: ['cormorant-garamond', 'Cormorant Garamond', 500], tekst: ['mulish', 'Mulish'], kopExtra: 'letter-spacing:0; line-height:1.05;', schaal: 1.12 },
  { id: 'B', naam: 'B  Playfair Display + DM Sans', kop: ['playfair-display', 'Playfair Display', 400], tekst: ['dm-sans', 'DM Sans'], kopExtra: 'letter-spacing:-.005em; line-height:1.1;', schaal: 1 },
  { id: 'C', naam: 'C  Tenor Sans + Karla', kop: ['tenor-sans', 'Tenor Sans', 400], tekst: ['karla', 'Karla'], kopExtra: 'letter-spacing:.02em; line-height:1.12;', schaal: .96 },
];
const face = (pk, fam, w, it = false) => `@font-face{font-family:"${fam}";font-weight:${w};font-style:${it ? 'italic' : 'normal'};font-display:block;src:url(/fontproef/${pk}-latin-${w}-${it ? 'italic' : 'normal'}.woff2) format("woff2")}`;
const b = await chromium.launch();
for (const v of V) {
  const css = [
    ...[400, 500, 600].flatMap((w) => [face(v.kop[0], v.kop[1], w), face(v.tekst[0], v.tekst[1], w)]),
    `:root{--font-kop:"${v.kop[1]}",Georgia,serif;--font-tekst:"${v.tekst[1]}",system-ui,sans-serif}`,
    `h2,h3,.uitspraak{font-family:"${v.kop[1]}" !important;font-weight:${v.kop[2]} !important;${v.kopExtra}}`,
    `#atelier h2,#bei h2{font-size:calc(2.8rem * ${v.schaal}) !important}`,
    `body,.eyebrow,.knop,#atelier li a span:last-child{font-family:"${v.tekst[1]}" !important}`,
  ].join('\n');
  for (const [w, h, doel] of [[1440, 900, 'desktop'], [390, 844, 'mobiel']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500, deviceScaleFactor: 1, bypassCSP: true });
    await ctx.route('**/fontproef/**', (r) => {
      const f = r.request().url().split('/fontproef/')[1];
      const pk = f.replace(/-latin-.*/, '');
      try { r.fulfill({ body: readFileSync(`node_modules/@fontsource/${pk}/files/${f}`), contentType: 'font/woff2' }); } catch { r.fulfill({ status: 404 }); }
    });
    const p = await ctx.newPage();
    await p.goto(B, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
    await p.addStyleTag({ content: css });
    await p.evaluate(() => document.querySelectorAll('.rijs').forEach((e) => e.classList.add('in')));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(600);
    const box = await p.evaluate(() => {
      const a = document.querySelector('#atelier').getBoundingClientRect();
      const z = document.querySelector('#bei').getBoundingClientRect();
      return { x: 0, y: a.top + scrollY, width: innerWidth, height: z.bottom - a.top };
    });
    const uit = `shots/letters-${v.id}-${doel}.png`;
    await p.screenshot({ path: uit, fullPage: true, clip: box });
    const label = Buffer.from(`<svg width="${w}" height="64"><rect width="100%" height="100%" fill="#1b1716"/><text x="24" y="42" font-family="sans-serif" font-size="${w < 500 ? 20 : 30}" font-weight="700" fill="#ffffff">${v.naam}</text></svg>`);
    const strip = await sharp(label).png().toBuffer();
    const img = sharp(uit);
    const m = await img.metadata();
    await sharp({ create: { width: m.width, height: m.height + 64, channels: 3, background: '#fff' } })
      .composite([{ input: strip, top: 0, left: 0 }, { input: await img.toBuffer(), top: 64, left: 0 }])
      .jpeg({ quality: 82 }).toFile(`shots/letters-${v.id}-${doel}.jpg`);
    console.log(v.id, doel, m.width, m.height);
    await ctx.close();
  }
}
await b.close();
