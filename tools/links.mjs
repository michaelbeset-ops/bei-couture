import { chromium } from 'playwright';
const B=process.env.BASIS || 'http://127.0.0.1:4536/bei-couture/';
const paden=['','atelier/','werkwijze/','klantervaringen/','over-bei/','contact/','privacy/','bruidsjurk-op-maat/','trouwjurk-vermaken/','bruidsmoeder-jurk/','bruidsmeisjes-en-bruidsjonkers/','gala-en-avondkleding/','kleding-op-maat/'];
const b=await chromium.launch(); const p=await (await b.newContext()).newPage();
const kapot=new Set();
for(const pad of paden){
  const r=await p.goto(B+pad,{waitUntil:'domcontentloaded'});
  if(!r.ok()) console.log('STATUS',pad,r.status());
  (await p.evaluate(()=>[...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href')))).forEach(l=>kapot.add(l));
}
const uniek=[...kapot];
for(const l of uniek){ const r=await p.goto('http://127.0.0.1:4536'+l,{waitUntil:'domcontentloaded'}); if(!r.ok()) console.log('KAPOT',l,r.status()); }
console.log('interne links gecontroleerd:',uniek.length);
await b.close();
