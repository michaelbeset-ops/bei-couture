import { chromium } from 'playwright';
const B='http://127.0.0.1:4536/sitefront/bei-couture/';
const b=await chromium.launch(); const p=await (await b.newContext()).newPage();
const err=[]; p.on('console',m=>m.type()==='error'&&err.push(m.text())); p.on('pageerror',e=>err.push(String(e)));

await p.goto(B+'contact/?voor=Trouwjurk%20laten%20vermaken',{waitUntil:'networkidle'});
console.log('voorselectie:', await p.inputValue('input[name="wat"]:checked').catch(()=>'-'), '|', await p.$eval('input[name="wat"]:checked','e=>e.value'));
await p.fill('#naam','Test');
await p.selectOption('select[name="dag"]','Buiten de openingstijden');
await p.waitForTimeout(200);
console.log('bericht:', (await p.textContent('#bericht')).replace(/\n/g,' / '));
console.log('wa-link ok:', (await p.getAttribute('#stuur','href')).startsWith('https://wa.me/31653612543?text='));
console.log('status:', await p.textContent('[data-status]'));

await p.goto(B,{waitUntil:'networkidle'});
const voor = await p.$eval('[data-rij]', e=>e.scrollLeft);
await p.click('[data-rij-volgende]'); await p.waitForTimeout(900);
const na = await p.$eval('[data-rij]', e=>e.scrollLeft);
console.log('reviews scrollen:', voor, '->', na, na>voor?'ok':'FOUT');
console.log('live-tijden:', await p.textContent('[data-nu]'));

await p.setViewportSize({width:390,height:844});
await p.click('[data-menu-knop]'); await p.waitForTimeout(300);
console.log('mobiel menu open:', await p.isVisible('#menu-nav'));

await p.goto(B+'werkwijze/',{waitUntil:'networkidle'});
await p.click('.vraag summary'); await p.waitForTimeout(300);
console.log('faq open:', await p.$eval('.vraag details','e=>e.open'));
console.log('fouten:', err.length?err:'geen');
await b.close();
