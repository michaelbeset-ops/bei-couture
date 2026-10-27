import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' })).newPage();
  const r = await p.goto('https://www.beicouture.nl/', { waitUntil: 'networkidle' });
  console.log(w, r.status(), p.url(), (await p.innerText('body')).slice(0, 200));
  await p.screenshot({ path: `bron/web/beicouture-${w}.png`, fullPage: true });
}
await b.close();
