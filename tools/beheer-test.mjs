// Test van de bewerkmodus van begin tot eind, tegen de preview (4536) en de nepbrug (4537).
// Vooraf: PUBLIC_BEHEER_API=http://127.0.0.1:4537 npm run build; npm run preview; node tools/beheer-mock.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const B = 'http://127.0.0.1:4536/bei-couture/';
const WORTEL = path.resolve(new URL('..', import.meta.url).pathname);
const FOTO = path.join(WORTEL, 'src/assets/e-kant-mouwen.jpg');
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

  // Nieuw artikel met foto, live in de pagina
  await p.click('text=Artikel schrijven');
  await p.waitForSelector('.b-paneel');
  await p.fill('#b-titel', 'Testartikel uit de bewerkmodus');
  await p.fill('#b-intro', 'Een korte inleiding om te testen.');
  await p.fill('#b-tekst', 'Eerste alinea van de test.\n\n## Een tussenkop\n\n- punt een\n- punt twee\n\n> Een citaat');
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('.b-foto-veld button')]);
  await fc.setFiles(FOTO);
  await p.fill('#b-fotoalt', 'Kanten mouwen op een paspop');
  await p.waitForSelector('[data-b="foto"] img');
  const h1 = await p.textContent('[data-b="titel"]');
  const kop = await p.textContent('[data-b="tekst"] h2');
  const lijst = await p.$$eval('[data-b="tekst"] li', (ls) => ls.length);
  console.log(naam, 'voorbeeld:', JSON.stringify(h1), JSON.stringify(kop), 'lijstpunten', lijst);
  if (h1 !== 'Testartikel uit de bewerkmodus' || kop !== 'Een tussenkop' || lijst !== 2) fouten.push(`${naam}: voorbeeld klopt niet`);
  await p.screenshot({ path: `shots/bewerk-artikel-${w}.png`, fullPage: false });
  await p.click('text=Op de site zetten');
  await p.waitForSelector('.b-status:has-text("Opgeslagen")', { timeout: 10000 });
  await p.waitForSelector('.b-status:has-text("Staat live")', { timeout: 30000 });
  const md = path.join(WORTEL, 'src/content/artikelen/testartikel-uit-de-bewerkmodus.md');
  if (!fs.existsSync(md)) fouten.push(`${naam}: markdown niet geschreven`);
  else {
    const inhoud = fs.readFileSync(md, 'utf8');
    const foto = /foto: (\S+)/.exec(inhoud)?.[1];
    const jpg = foto && path.join(WORTEL, 'src/content/artikelen', foto);
    if (!jpg || !fs.existsSync(jpg)) fouten.push(`${naam}: foto niet geschreven (${foto})`);
    else console.log(naam, 'opgeslagen:', path.basename(md), path.basename(jpg), Math.round(fs.statSync(jpg).size / 1024), 'kB');
    if (naam === 'desktop') console.log(inhoud.split('\n').slice(0, 8).join('\n'));
  }

  // Klantfoto toevoegen op Klantervaringen
  await p.goto(`${B}klantervaringen/`);
  await p.waitForSelector('.b-balk');
  p.once('dialog', (d) => d.accept('Testfoto: kanten mouwen'));
  const [fc2] = await Promise.all([p.waitForEvent('filechooser'), p.click('.b-balk >> text=Foto toevoegen')]);
  await fc2.setFiles(FOTO);
  await p.waitForSelector('[data-b-galerij] li.b-nieuw img');
  await p.waitForSelector('.b-balk >> text=Foto\'s opslaan (1)');
  await p.screenshot({ path: `shots/bewerk-galerij-${w}.png`, fullPage: false });
  await p.click('.b-balk >> text=Foto\'s opslaan');
  await p.waitForSelector('.b-status:has-text("Staat live")', { timeout: 30000 });
  const galerij = JSON.parse(fs.readFileSync(path.join(WORTEL, 'src/content/galerij/fotos.json'), 'utf8'));
  console.log(naam, "galerij:", galerij.fotos.length, 'foto(s)');
  if (!galerij.fotos.length) fouten.push(`${naam}: galerij niet geschreven`);

  // Uitloggen
  await p.click('.b-balk >> text=Uitloggen');
  await p.waitForURL(`${B}admin/`);
  await ctx.close();
}
await b.close();
console.log('fouten:', fouten.length ? fouten : 'geen');
process.exit(fouten.length ? 1 : 0);
