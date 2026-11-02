import { chromium } from 'playwright';
import sharp from 'sharp';
const B = 'http://127.0.0.1:4536/bei-couture/';
const R = [['Christina W.', 'Wat een topervaring hebben wij gehad bij lieve Bei, een warme vrouw die super mooi onze trouwjurk en pak heeft vermaakt. Het lijkt net alsof je bij een familielid bent zodra je bij Bei binnenkomt. … Dankbaar voor jouw werk Bei, je hebt gouden handen.'], ['Marisela B.', 'Zeer tevreden, heel vriendelijk en neemt de tijd voor je. Mijn bruidsjurk was netjes opmaat gemaakt'], ['Çanci A.', 'Bei kan trouwjurken vermaken als geen ander! … Hij zat echt als gegoten, voelde me net een Disney princes toen hij af was.'], ['Marcel', 'Ik heb mijn ideeen om de jurk nog mooier te maken ter plekke met Bei kunnen bespreken en na 2 weken kon ik hem ophalen. Mijn droom werd werkelijkheid, hij was nog mooier dan ik had durven denken.']];
const pf = "font-family:'Playfair Display',Georgia,serif;font-weight:400;";
const dm = "font-family:'DM Sans',system-ui,sans-serif;";
const ster = (k) => `<span style="color:${k};letter-spacing:.1em;font-size:.8rem">★★★★★</span>`;
const G = '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.4-.2-2.1H12v4h6a5.2 5.2 0 0 1-2.2 3.4v2.8h3.6c2-1.9 3.2-4.7 3.2-8.1Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.6l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.9A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9c.9-2.7 3.3-4.5 6.2-4.5Z"/></svg>';
const pijlen = (k, bg) => `<div style="display:flex;gap:.5rem"><span style="display:grid;place-items:center;width:40px;height:40px;border:1px solid ${k};opacity:.35;color:${k}">‹</span><span style="display:grid;place-items:center;width:40px;height:40px;border:1px solid ${k};color:${k}">›</span></div>`;
const kop = (licht, extra = '') => `<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;flex-wrap:wrap"><div><p style="${dm}font-size:.8rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:${licht ? '#e3bfb6' : '#8f4b4f'};margin:0">Google-reviews</p><h2 style="${pf}font-size:2.4rem;line-height:1.1;margin:.8rem 0 0;color:${licht ? '#fff' : '#1b1716'}">Wat bruiden <span style="color:${licht ? '#e3bfb6' : '#8f4b4f'}">zeggen</span></h2></div><div style="display:flex;align-items:center;gap:1.5rem">${extra}${pijlen(licht ? '#fff' : '#1b1716')}</div></div>`;
const badge = (licht) => `<a style="display:flex;align-items:center;gap:.7rem;${dm}font-size:.95rem;color:${licht ? '#fff' : '#1b1716'};text-decoration:none;border:1px solid ${licht ? '#ffffff26' : '#8f4b4f33'};padding:.55rem .9rem;background:${licht ? '#272121' : '#fff'}">${G}<span><strong>5,0</strong> ${ster('#fbbc05')}<br><span style="font-size:.8rem;color:${licht ? '#c4b9b5' : '#5f5755'}">51 reviews op Google</span></span></a>`;
const V = {
  A: { naam: 'A  Groot aanhalingsteken, naam in kapitalen, Google-badge bij de kop', html: `<section style="background:#fff;padding:4rem 0"><div style="max-width:1200px;margin:0 auto;padding:0 1.25rem">${kop(false, badge(false))}
    <ul style="list-style:none;margin:2rem 0 0;padding:0;display:flex;gap:1.25rem;overflow:hidden">${R.map(([n, t]) => `<li style="flex:none;width:340px;background:#f7ebe7;padding:1.5rem 1.5rem 1.4rem;position:relative;display:flex;flex-direction:column"><span style="${pf}font-size:4rem;line-height:.6;color:#e3bfb6;position:absolute;top:1.2rem;right:1.3rem">”</span>${ster('#8f4b4f')}<p style="${dm}font-size:.95rem;line-height:1.6;color:#272121;margin:1rem 0 0;flex:1">${t}</p><span style="${dm}font-size:.74rem;letter-spacing:.2em;text-transform:uppercase;color:#733a3e;margin-top:1.2rem">${n}</span></li>`).join('')}</ul>
    <p style="${dm}font-size:.9rem;margin:1.5rem 0 0"><a style="color:#1b1716;font-weight:600;text-decoration:underline;text-decoration-color:#8f4b4f;text-decoration-thickness:2px;text-underline-offset:5px">Lees alle 51 reviews op Google</a></p></div></section>` },
  B: { naam: 'B  Donkere band, kaartjes in warm donker, sterren in roze', html: `<section style="background:#1b1716;padding:4rem 0"><div style="max-width:1200px;margin:0 auto;padding:0 1.25rem">${kop(true, badge(true))}
    <ul style="list-style:none;margin:2rem 0 0;padding:0;display:flex;gap:1.25rem;overflow:hidden">${R.map(([n, t]) => `<li style="flex:none;width:340px;background:#272121;padding:1.5rem;display:flex;flex-direction:column">${ster('#e3bfb6')}<p style="${dm}font-size:.95rem;line-height:1.6;color:#ffffffe6;margin:1rem 0 0;flex:1">${t}</p><span style="${dm}font-size:.85rem;color:#c4b9b5;margin-top:1.2rem">${n} · via Google</span></li>`).join('')}</ul>
    <p style="${dm}font-size:.9rem;margin:1.5rem 0 0"><a style="color:#fff;font-weight:600;text-decoration:underline;text-decoration-color:#e3bfb6;text-decoration-thickness:2px;text-underline-offset:5px">Lees alle 51 reviews op Google</a></p></div></section>` },
  C: { naam: 'C  Witte kaartjes met rozenhouten rand op roze, citaat in het koplettertype', html: `<section style="background:#f7ebe7;padding:4rem 0"><div style="max-width:1200px;margin:0 auto;padding:0 1.25rem">${kop(false, badge(false))}
    <ul style="list-style:none;margin:2rem 0 0;padding:0;display:flex;gap:1.25rem;overflow:hidden">${R.map(([n, t]) => `<li style="flex:none;width:340px;background:#fff;border:1px solid #8f4b4f33;padding:1.5rem;display:flex;flex-direction:column"><div style="display:flex;justify-content:space-between;align-items:center">${ster('#8f4b4f')}${G}</div><p style="${pf}font-size:1.12rem;line-height:1.45;color:#1b1716;margin:1rem 0 0;flex:1">${t}</p><span style="${dm}font-size:.85rem;color:#5f5755;margin-top:1.2rem;border-top:1px solid #8f4b4f22;padding-top:.9rem">${n} · via Google</span></li>`).join('')}</ul>
    <p style="${dm}font-size:.9rem;margin:1.5rem 0 0"><a style="color:#1b1716;font-weight:600;text-decoration:underline;text-decoration-color:#8f4b4f;text-decoration-thickness:2px;text-underline-offset:5px">Lees alle 51 reviews op Google</a></p></div></section>` },
};
const b = await chromium.launch(); const out = [];
for (const [id, v] of Object.entries(V)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.evaluate((html) => { document.querySelector('#reviews').outerHTML = html; }, v.html);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const box = await p.evaluate(() => { const s = document.querySelector('section[style*="padding:4rem"]').getBoundingClientRect(); return { x: 0, y: s.top + scrollY, width: innerWidth, height: s.height }; });
  await p.screenshot({ path: `shots/rev-${id}.png`, fullPage: true, clip: box });
  const strip = await sharp(Buffer.from(`<svg width="1440" height="56"><rect width="100%" height="100%" fill="#3a3030"/><text x="24" y="38" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">${v.naam}</text></svg>`)).png().toBuffer();
  const m = await sharp(`shots/rev-${id}.png`).metadata();
  out.push(await sharp({ create: { width: 1440, height: m.height + 56, channels: 3, background: '#fff' } }).composite([{ input: strip, top: 0, left: 0 }, { input: await sharp(`shots/rev-${id}.png`).toBuffer(), top: 56, left: 0 }]).jpeg({ quality: 82 }).toBuffer());
  await ctx.close();
}
await b.close();
const hs = await Promise.all(out.map((x) => sharp(x).metadata().then((m) => m.height)));
let y = 0; const comp = out.map((input, i) => { const o = { input, top: y, left: 0 }; y += hs[i] + 20; return o; });
await sharp({ create: { width: 1440, height: y, channels: 3, background: '#fff' } }).composite(comp).jpeg({ quality: 82 }).toFile('shots/rev-ABC.jpg');
console.log('klaar');
