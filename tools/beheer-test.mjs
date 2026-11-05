// Test van de bewerkmodus van begin tot eind, tegen de preview (4536) en de nepbrug (4537).
// Vooraf: PUBLIC_BEHEER_API=http://127.0.0.1:4537 npm run build; npm run preview; node tools/beheer-mock.mjs
// Let op: de nepbrug schrijft echt in src/content en src/assets/upload. Ruim de testbestanden daarna op.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const B = 'http://127.0.0.1:4536/bei-couture/';
const WORTEL = path.resolve(new URL('..', import.meta.url).pathname);
const FOTOS = ['e-kant-mouwen', 'e-roosje', 'e-sluier'].map((f) => path.join(WORTEL, `src/assets/${f}.jpg`));
const SHOTS = process.env.SHOTS || path.join(WORTEL, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
const fouten = [];
const b = await chromium.launch();

for (const [w, h, naam] of [[1440, 900, 'desktop'], [390, 844, 'mobiel']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => fouten.push(`${naam}: ${e}`));
  p.on('console', (m) => m.type() === 'error' && fouten.push(`${naam} console: ${m.text()}`));

  // Inloggen
  await p.goto(`${B}admin/`);
  await p.fill('#wachtwoord', 'fout');
  await p.click('button[type=submit]');
  await p.waitForSelector('[data-b-fout]:not(.hidden)');
  await p.fill('#wachtwoord', 'test');
  await p.click('button[type=submit]');
  await p.waitForURL(B);
  await p.waitForSelector('.b-balk');
  console.log(naam, 'ingelogd, balk zichtbaar');

  // Vanaf de homepage: "Klantervaring toevoegen" gaat naar Klantervaringen en opent het paneel
  await p.click('.b-balk button.b-vol >> nth=0'); // tekst verschilt per scherm ("Klantervaring toevoegen" of "+ Ervaring")
  await p.waitForURL(`${B}klantervaringen/`);
  await p.waitForSelector('.b-paneel');
  const titel = `Testervaring ${naam}`;
  await p.fill('#b-kop', titel);
  await p.fill('#b-label', 'Trouwjurk vermaakt');
  await p.fill('#b-citaat', '"Bei heeft mijn jurk prachtig gemaakt."');
  await p.fill('#b-tekst', 'Eerste alinea.\n\nTweede alinea.');
  await p.fill('#b-naam', 'Test K.');
  await p.selectOption('#b-sterren', '4');
  await p.selectOption('#b-bron', 'Google');
  await p.selectOption('#b-dienst', 'trouwjurk-vermaken');
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('.b-paneel >> text=Foto\'s kiezen')]);
  await fc.setFiles(FOTOS);
  await p.waitForSelector('.b-fotoitem >> nth=2');
  await p.waitForFunction(() => document.querySelectorAll('section.b-bewerkbaar [data-b-plek] img[src^="data:"]').length === 3);
  const vb = await p.evaluate(() => {
    const s = document.querySelector('section.b-bewerkbaar');
    const t = (n) => s.querySelector(`[data-b="${n}"]`);
    return {
      kop: t('kop').textContent, citaat: t('citaat').textContent, alineas: t('tekst').querySelectorAll('p').length,
      sterren: [...s.querySelectorAll('[data-b-ster]')].filter((x) => !x.hidden).length,
      bron: t('bron').textContent, knop: t('knop').textContent, google: !t('google').hidden, fotos: s.dataset.bN,
    };
  });
  console.log(naam, 'voorbeeld:', JSON.stringify(vb));
  if (vb.kop !== titel || vb.citaat !== '“Bei heeft mijn jurk prachtig gemaakt.”' || vb.alineas !== 2 || vb.sterren !== 4 || !vb.bron.startsWith('· Google, ') || vb.knop !== 'Trouwjurk vermaken' || !vb.google || vb.fotos !== '3')
    fouten.push(`${naam}: voorbeeld klopt niet`);
  // Volgorde wisselen: foto 2 groot maken
  await p.click('.b-fotoitem >> nth=1 >> text=Maak groot');
  await p.screenshot({ path: `${SHOTS}/bewerk-ervaring-${w}.png` });
  await p.click('.b-paneel >> text=Op de site zetten');
  await p.waitForSelector('.b-status:has-text("Staat live")', { timeout: 40000 });
  const bestanden = fs.readdirSync(path.join(WORTEL, 'src/content/klantverhalen')).filter((f) => f.includes(`testervaring-${naam}`));
  if (bestanden.length !== 1) fouten.push(`${naam}: json niet geschreven (${bestanden})`);
  else {
    const v = JSON.parse(fs.readFileSync(path.join(WORTEL, 'src/content/klantverhalen', bestanden[0]), 'utf8'));
    const ontbreekt = v.fotos.filter((f) => !fs.existsSync(path.join(WORTEL, 'src/content/klantverhalen', f.foto)));
    if (v.fotos.length !== 3 || ontbreekt.length) fouten.push(`${naam}: foto's niet goed geschreven`);
    if (v.citaat !== 'Bei heeft mijn jurk prachtig gemaakt.' || v.sterren !== 4 || v.bron !== 'Google' || v.dienst !== 'trouwjurk-vermaken') fouten.push(`${naam}: velden kloppen niet ${JSON.stringify(v)}`);
    console.log(naam, 'opgeslagen:', bestanden[0], v.fotos.map((f) => path.basename(f.foto)).join(' '));
  }

  // Bestaande (testdata) ervaring bewerken: foto weghalen
  await p.reload();
  await p.waitForSelector('.b-verhaal-knop');
  const offline = await p.$$eval('section.b-offline', (s) => s.length);
  console.log(naam, 'offline zichtbaar in bewerkmodus:', offline);
  const knop = p.locator('section[data-b-verhaal="2026-10-20-drie-fotos"] .b-verhaal-knop');
  if (await knop.count()) {
    await knop.click();
    await p.waitForSelector('.b-paneel .b-fotoitem');
    await p.click('.b-fotoitem >> nth=2 >> text=Weghalen');
    await p.waitForFunction(() => document.querySelector('section.b-bewerkbaar')?.dataset.bN === '2');
    const n = await p.$$eval('section.b-bewerkbaar [data-b-plek] img', (i) => i.filter((x) => x.getAttribute('src')).length);
    if (n !== 2) fouten.push(`${naam}: na weghalen ${n} foto's in voorbeeld`);
    await p.screenshot({ path: `${SHOTS}/bewerk-bestaand-${w}.png` });
    await p.click('.b-paneel >> text=Annuleren');
    await p.waitForLoadState('load');
  } else fouten.push(`${naam}: geen bewerkknop bij testdata`);

  // Uitloggen
  await p.click('.b-balk >> text=Uitloggen');
  await p.waitForURL(`${B}admin/`);
  await ctx.close();
}
await b.close();
console.log('fouten:', fouten.length ? fouten : 'geen');
process.exit(fouten.length ? 1 : 0);
