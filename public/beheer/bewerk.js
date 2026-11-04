// Bewerkmodus van Bei Couture. Wordt alleen geladen na inloggen (zie de lader in src/layouts/Base.astro).
// Bei ziet haar eigen site met een balk bovenin en kan artikelen schrijven en klantfoto's toevoegen op de
// pagina's zelf; wat ze typt verschijnt direct in de pagina. Opslaan gaat via de brug (beheer/worker.js),
// die alles in één commit op GitHub zet; daarna bouwt de site zichzelf opnieuw (ongeveer drie minuten).
//
// Bestanden die hieruit ontstaan: src/content/artikelen/<slug>.md, src/assets/upload/<naam>.jpg en
// src/content/galerij/fotos.json. Precies dezelfde vorm als de site verwacht (src/content.config.ts, src/lib/beheer.ts).

const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.content ?? '';
const API = meta('beheer-api').replace(/\/$/, '');
const BASIS = meta('beheer-basis') || '/';
const OPSLAG = 'bei-beheer';
const UPLOAD = 'src/assets/upload';
const ARTIKELEN = 'src/content/artikelen';
const GALERIJ = 'src/content/galerij/fotos.json';
const RELATIEF = '../../assets/upload';

let token = null;
try { token = localStorage.getItem(OPSLAG); } catch {}

const el = (tag, attrs = {}, kinderen = []) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v != null) e.setAttribute(k, v);
  }
  for (const kind of [].concat(kinderen)) if (kind != null) e.append(kind);
  return e;
};
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const datumNl = (iso) => {
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d) ? '' : d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
};
const vandaag = () => new Date().toISOString().slice(0, 10);
const slug = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'artikel';
const basisnaam = (pad) => (pad || '').split('/').pop().split('.')[0];

// ---------- brug ----------
async function brug(route, opties = {}) {
  if (!API) throw new Error('De brug naar de site is nog niet gekoppeld. App Michael van Sitefront.');
  const r = await fetch(`${API}${route}`, {
    ...opties,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...(opties.headers || {}) },
  });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401 && token) { uitloggen(); throw new Error('Je sessie is verlopen. Log opnieuw in.'); }
  if (!r.ok) throw new Error(data.fout || `Er ging iets mis (${r.status}).`);
  return data;
}
function uitloggen() {
  try { localStorage.removeItem(OPSLAG); } catch {}
  location.href = `${BASIS}admin/`;
}

// ---------- foto's: verkleinen in de browser, zodat de repo klein blijft ----------
function leesFoto(bestand, maxZijde = 2000) {
  return new Promise((ok, nee) => {
    const img = new Image();
    const url = URL.createObjectURL(bestand);
    img.onload = () => {
      const schaal = Math.min(1, maxZijde / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * schaal);
      c.height = Math.round(img.height * schaal);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      const dataUrl = c.toDataURL('image/jpeg', 0.86);
      ok({ dataUrl, base64: dataUrl.split(',')[1] });
    };
    img.onerror = () => { URL.revokeObjectURL(url); nee(new Error('Dit bestand is geen foto die de browser kan lezen.')); };
    img.src = url;
  });
}
const kiesBestand = () =>
  new Promise((ok) => {
    const i = el('input', { type: 'file', accept: 'image/*' });
    i.addEventListener('change', () => ok(i.files[0] || null));
    i.click();
  });
const nieuweNaam = (voorvoegsel) => `${voorvoegsel}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}.jpg`;

// ---------- markdown (klein, alleen wat het paneel maakt) ----------
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}
function markdownNaarHtml(md, beeldSrc) {
  const regels = String(md || '').replace(/\r/g, '').split('\n');
  const uit = [];
  let para = [];
  let lijst = null;
  const sluitPara = () => { if (para.length) { uit.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const sluitLijst = () => { if (lijst) { uit.push(`<${lijst.t}>${lijst.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${lijst.t}>`); lijst = null; } };
  for (const r of regels) {
    const t = r.trim();
    let m;
    if (!t) { sluitPara(); sluitLijst(); continue; }
    if ((m = /^(#{1,4})\s+(.*)$/.exec(t))) { sluitPara(); sluitLijst(); const n = Math.min(4, Math.max(2, m[1].length)); uit.push(`<h${n}>${inline(m[2])}</h${n}>`); continue; }
    if ((m = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(t))) { sluitPara(); sluitLijst(); const src = beeldSrc(m[2]); uit.push(src ? `<img src="${esc(src)}" alt="${esc(m[1])}">` : `<div class="b-beeld-plek">Foto: ${esc(basisnaam(m[2]))}</div>`); continue; }
    if ((m = /^[-*]\s+(.*)$/.exec(t))) { sluitPara(); if (!lijst || lijst.t !== 'ul') { sluitLijst(); lijst = { t: 'ul', items: [] }; } lijst.items.push(m[1]); continue; }
    if ((m = /^\d+[.)]\s+(.*)$/.exec(t))) { sluitPara(); if (!lijst || lijst.t !== 'ol') { sluitLijst(); lijst = { t: 'ol', items: [] }; } lijst.items.push(m[1]); continue; }
    if ((m = /^>\s?(.*)$/.exec(t))) { sluitPara(); sluitLijst(); uit.push(`<blockquote><p>${inline(m[1])}</p></blockquote>`); continue; }
    if (/^(-{3,}|\*{3,})$/.test(t)) { sluitPara(); sluitLijst(); uit.push('<hr>'); continue; }
    sluitLijst();
    para.push(t);
  }
  sluitPara(); sluitLijst();
  return uit.join('\n');
}

// Frontmatter lezen en schrijven in de vorm die Astro (src/content.config.ts) verwacht.
function leesArtikel(bron) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(bron);
  const data = {};
  if (m) {
    let sleutel = null;
    for (const r of m[1].split(/\r?\n/)) {
      const k = /^([A-Za-z_][\w-]*):\s?(.*)$/.exec(r);
      if (k) { sleutel = k[1]; data[sleutel] = k[2]; }
      else if (sleutel && /^\s+\S/.test(r)) data[sleutel] = `${data[sleutel]} ${r.trim()}`.trim();
    }
    for (const k of Object.keys(data)) {
      const v = data[k].trim();
      if (/^".*"$/.test(v)) { try { data[k] = JSON.parse(v); continue; } catch {} }
      if (/^'.*'$/.test(v)) { data[k] = v.slice(1, -1).replace(/''/g, "'"); continue; }
      data[k] = v;
    }
  }
  return { ...data, online: String(data.online ?? 'true') !== 'false', tekst: (m ? m[2] : bron).replace(/^\n+/, '') };
}
function schrijfArtikel(a) {
  const q = (s) => JSON.stringify(String(s ?? ''));
  return [
    '---',
    `titel: ${q(a.titel)}`,
    `datum: ${a.datum}`,
    `intro: ${q(a.intro)}`,
    ...(a.foto ? [`foto: ${a.foto}`, `fotoAlt: ${q(a.fotoAlt)}`] : []),
    `online: ${a.online ? 'true' : 'false'}`,
    '---',
    String(a.tekst || '').replace(/\r/g, '').trim(),
    '',
  ].join('\n');
}

// ---------- de bewerkmodus ----------
let balk, statusVak, paneel;
const pagina = {
  artikel: document.querySelector('[data-b-artikel]:not(li)'),
  galerij: document.querySelector('[data-b-galerij]'),
};

function start() {
  document.head.append(el('link', { rel: 'stylesheet', href: `${BASIS}beheer/bewerk.css` }));
  document.body.classList.add('b-aan');
  statusVak = el('span', { class: 'b-status' });
  balk = el('div', { class: 'b-balk', role: 'region', 'aria-label': 'Bewerkmodus' }, [
    el('span', { class: 'b-naam' }, 'Bewerkmodus'),
    el('button', { class: 'b-knop b-vol', type: 'button', onclick: () => nieuwArtikel() }, 'Artikel schrijven'),
    pagina.artikel?.dataset.bArtikel ? el('button', { class: 'b-knop', type: 'button', onclick: () => bewerkArtikel(pagina.artikel.dataset.bArtikel) }, 'Dit artikel bewerken') : null,
    pagina.galerij
      ? el('button', { class: 'b-knop', type: 'button', onclick: () => galerij.toevoegen() }, 'Foto toevoegen')
      : el('button', { class: 'b-knop', type: 'button', onclick: () => { location.href = `${BASIS}klantervaringen/#fotos`; } }, "Klantfoto's"),
    statusVak,
    el('button', { class: 'b-knop b-rood', type: 'button', onclick: uitloggen }, 'Uitloggen'),
  ]);
  document.body.prepend(balk);
  zetStatus(API ? 'Klik op een knop om iets toe te voegen of te wijzigen.' : 'De brug is nog niet gekoppeld; opslaan werkt nog niet.');
  if (pagina.galerij) galerij.start();
  if (location.hash === '#fotos' && pagina.galerij) setTimeout(() => galerij.toevoegen(), 300);
  const laatste = sessionStorage.getItem('bei-beheer-commit');
  if (laatste) volgDeploy(laatste);
}

function zetStatus(tekst, html = false) {
  if (html) statusVak.innerHTML = tekst; else statusVak.textContent = tekst;
}

async function volgDeploy(commit) {
  sessionStorage.setItem('bei-beheer-commit', commit);
  zetStatus('Opgeslagen. De site wordt nu opnieuw gebouwd, dat duurt ongeveer drie minuten.');
  const begin = Date.now();
  while (Date.now() - begin < 15 * 60 * 1000) {
    await new Promise((r) => setTimeout(r, 15000));
    let s;
    try { s = await brug(`/status?commit=${commit}`); } catch { continue; }
    if (s.status === 'klaar') {
      sessionStorage.removeItem('bei-beheer-commit');
      zetStatus(`Staat live. <a href="${esc(location.pathname)}">Vernieuw de pagina</a> om het resultaat te zien.`, true);
      return;
    }
    if (s.status === 'mislukt') {
      sessionStorage.removeItem('bei-beheer-commit');
      zetStatus('Het bouwen van de site is mislukt. Probeer het nog eens opslaan, of app Michael.');
      return;
    }
    zetStatus(`Bezig met bouwen (${Math.round((Date.now() - begin) / 60000)} min)...`);
  }
  sessionStorage.removeItem('bei-beheer-commit');
  zetStatus('Het bouwen duurt langer dan normaal. Kijk straks nog eens, of app Michael.');
}

// ---------- artikel: paneel met live voorbeeld in de pagina ----------
function veld(label, invoer, hint) {
  return [el('label', { for: invoer.id }, label), invoer, hint ? el('p', { class: 'b-hint' }, hint) : null];
}

async function nieuwArtikel() {
  // Het sjabloon laden in de pagina, zodat Bei haar artikel ziet ontstaan zoals het straks wordt.
  const r = await fetch(`${BASIS}admin/sjabloon/`);
  const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
  const main = doc.querySelector('main');
  let hier = document.querySelector('main');
  if (!hier) { hier = el('main', { id: 'inhoud' }); document.body.querySelector('.bg-ivoor')?.append(hier); }
  hier.innerHTML = main.innerHTML;
  window.scrollTo({ top: 0 });
  pagina.artikel = hier.querySelector('[data-b-artikel]');
  openPaneel({ id: '', titel: '', datum: vandaag(), intro: '', foto: '', fotoAlt: '', online: true, tekst: '' }, 'nieuw');
}

async function bewerkArtikel(id) {
  zetStatus('Artikel ophalen...');
  try {
    const { inhoud } = await brug(`/bestand?pad=${encodeURIComponent(`${ARTIKELEN}/${id}.md`)}`);
    const a = leesArtikel(inhoud);
    openPaneel({ id, titel: a.titel ?? '', datum: a.datum ?? vandaag(), intro: a.intro ?? '', foto: a.foto ?? '', fotoAlt: a.fotoAlt ?? '', online: a.online, tekst: a.tekst }, 'bewerk');
    zetStatus('Pas het artikel aan; je ziet het meteen in de pagina.');
  } catch (e) { zetStatus(e.message); }
}

function openPaneel(a, modus) {
  paneel?.remove();
  const art = pagina.artikel;
  const d = (n) => art?.querySelector(`[data-b="${n}"]`);
  const beelden = new Map(); // bestandsnaam -> { dataUrl, base64 } van nieuwe foto's
  // Bestaande foto's in de tekst: de gebouwde bestandsnaam begint met de oorspronkelijke naam.
  const bestaand = new Map();
  art?.querySelectorAll('[data-b="tekst"] img, [data-b="foto"] img').forEach((img) => bestaand.set(basisnaam(img.currentSrc || img.src), img.currentSrc || img.src));
  const beeldSrc = (pad) => beelden.get(basisnaam(pad) + '.jpg')?.dataUrl || beelden.get(pad.split('/').pop())?.dataUrl || bestaand.get(basisnaam(pad)) || '';

  const titel = el('input', { type: 'text', id: 'b-titel', value: a.titel, placeholder: 'Bijvoorbeeld: Trouwjurk vermaken, zo gaat dat bij Bei' });
  const datum = el('input', { type: 'date', id: 'b-datum', value: a.datum });
  const intro = el('textarea', { id: 'b-intro', placeholder: 'Een of twee zinnen. Staan onder de titel en in Google.' }, a.intro);
  const fotoBeeld = el('img', { alt: '' });
  const fotoKnop = el('button', { type: 'button', class: 'b-p-knop', onclick: async () => {
    const f = await kiesBestand(); if (!f) return;
    const b = await leesFoto(f, 2200);
    a.foto = `${RELATIEF}/${nieuweNaam(slug(titel.value || 'artikel'))}`;
    beelden.set(a.foto.split('/').pop(), b);
    toon();
  } }, a.foto ? 'Andere foto' : 'Foto kiezen');
  const fotoAlt = el('input', { type: 'text', id: 'b-fotoalt', value: a.fotoAlt, placeholder: 'Bijvoorbeeld: kanten lijfje met knoopjes op de rug' });
  const tekst = el('textarea', { id: 'b-tekst', class: 'b-tekst', placeholder: 'Schrijf zoals je praat met een bruid in het atelier.' }, a.tekst);
  const online = el('input', { type: 'checkbox', id: 'b-online' });
  online.checked = a.online !== false;
  const fout = el('p', { class: 'b-fout', hidden: '' });

  const wrap = (voor, na = '') => {
    const s = tekst.selectionStart, e = tekst.selectionEnd;
    const sel = tekst.value.slice(s, e) || 'tekst';
    tekst.setRangeText(`${voor}${sel}${na}`, s, e, 'select');
    tekst.dispatchEvent(new Event('input'));
    tekst.focus();
  };
  const regelPrefix = (p) => {
    const s = tekst.value.lastIndexOf('\n', tekst.selectionStart - 1) + 1;
    tekst.setRangeText(p, s, s, 'end');
    tekst.dispatchEvent(new Event('input'));
    tekst.focus();
  };
  const werkbalk = el('div', { class: 'b-werkbalk' }, [
    el('button', { type: 'button', onclick: () => regelPrefix('## ') }, 'Tussenkop'),
    el('button', { type: 'button', onclick: () => wrap('**', '**') }, 'Vet'),
    el('button', { type: 'button', onclick: () => regelPrefix('- ') }, 'Opsomming'),
    el('button', { type: 'button', onclick: () => regelPrefix('> ') }, 'Citaat'),
    el('button', { type: 'button', onclick: async () => {
      const f = await kiesBestand(); if (!f) return;
      const b = await leesFoto(f, 1800);
      const naam = nieuweNaam(`${slug(titel.value || 'artikel')}-tekst`);
      beelden.set(naam, b);
      const s = tekst.selectionStart;
      tekst.setRangeText(`\n\n![Foto](${RELATIEF}/${naam})\n\n`, s, s, 'end');
      tekst.dispatchEvent(new Event('input'));
    } }, 'Foto in de tekst'),
  ]);

  function toon() {
    if (!art) return;
    d('titel').textContent = titel.value || 'Titel van het artikel';
    d('titel').classList.toggle('b-leeg', !titel.value);
    d('datum').textContent = datumNl(datum.value) || 'Datum';
    d('intro').textContent = intro.value || 'Hier komt de korte inleiding.';
    d('intro').classList.toggle('b-leeg', !intro.value);
    const fv = d('foto');
    const src = beeldSrc(a.foto);
    if (a.foto && src) {
      fv.classList.remove('hidden');
      if (beelden.has(a.foto.split('/').pop())) fv.innerHTML = `<img src="${src}" alt="${esc(fotoAlt.value)}" class="foto aspect-[16/10] w-full object-cover">`;
      fotoBeeld.src = src;
      fotoKnop.textContent = 'Andere foto';
    } else if (!a.foto) { fv.classList.add('hidden'); fv.innerHTML = ''; fotoBeeld.removeAttribute('src'); }
    d('tekst').innerHTML = markdownNaarHtml(tekst.value, beeldSrc) || '<p class="b-leeg">Hier komt de tekst van het artikel.</p>';
    document.title = `${titel.value || 'Nieuw artikel'} | bewerken`;
  }
  [titel, datum, intro, fotoAlt, tekst].forEach((i) => i.addEventListener('input', toon));

  const opslaan = el('button', { type: 'button', class: 'b-p-knop b-vol', onclick: async () => {
    fout.hidden = true;
    if (!titel.value.trim()) return toonFout('Geef het artikel een titel.');
    if (!intro.value.trim()) return toonFout('Schrijf een korte inleiding.');
    if (a.foto && !fotoAlt.value.trim()) return toonFout('Schrijf kort wat er op de foto staat.');
    const id = modus === 'bewerk' ? a.id : slug(titel.value);
    const bestanden = [{ pad: `${ARTIKELEN}/${id}.md`, tekst: schrijfArtikel({ ...a, titel: titel.value.trim(), datum: datum.value || vandaag(), intro: intro.value.trim(), fotoAlt: fotoAlt.value.trim(), online: online.checked, tekst: tekst.value }) }];
    const genoemd = new Set([a.foto, ...[...tekst.value.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1])].filter(Boolean).map((p) => p.split('/').pop()));
    for (const [naam, b] of beelden) if (genoemd.has(naam)) bestanden.push({ pad: `${UPLOAD}/${naam}`, base64: b.base64 });
    await verstuur(bestanden, modus === 'bewerk' ? `Artikel bijgewerkt: ${titel.value.trim()}` : `Nieuw artikel: ${titel.value.trim()}`);
  } }, modus === 'bewerk' ? 'Wijzigingen opslaan' : 'Op de site zetten');

  const verwijder = modus === 'bewerk' ? el('button', { type: 'button', class: 'b-p-knop b-rood', onclick: async () => {
    if (!confirm('Dit artikel van de site halen? Dit kan niet ongedaan worden gemaakt.')) return;
    await verstuur([{ pad: `${ARTIKELEN}/${a.id}.md`, verwijder: true }], `Artikel verwijderd: ${a.titel}`);
  } }, 'Verwijderen') : null;

  async function verstuur(bestanden, bericht) {
    opslaan.disabled = true; opslaan.textContent = 'Bezig met opslaan...';
    try {
      const { commit } = await brug('/opslaan', { method: 'POST', body: JSON.stringify({ bericht, bestanden }) });
      paneel.remove(); paneel = null;
      volgDeploy(commit);
    } catch (e) {
      toonFout(e.message);
      opslaan.disabled = false; opslaan.textContent = modus === 'bewerk' ? 'Wijzigingen opslaan' : 'Op de site zetten';
    }
  }
  function toonFout(t) { fout.textContent = t; fout.hidden = false; fout.scrollIntoView({ block: 'nearest' }); }

  paneel = el('aside', { class: 'b-paneel', 'aria-label': 'Artikel bewerken' }, [
    el('header', {}, [el('h2', {}, modus === 'bewerk' ? 'Artikel bewerken' : 'Nieuw artikel'), el('button', { type: 'button', class: 'b-sluit', 'aria-label': 'Sluiten', onclick: () => { paneel.remove(); paneel = null; if (modus === 'nieuw') location.reload(); } }, '×')]),
    el('div', { class: 'b-velden' }, [
      ...veld('Titel', titel),
      ...veld('Datum', datum),
      ...veld('Korte inleiding', intro, 'Een of twee zinnen. Google gebruikt dit als samenvatting.'),
      el('label', {}, 'Foto bij het artikel'),
      el('div', { class: 'b-foto-veld' }, [fotoBeeld, fotoKnop]),
      el('p', { class: 'b-hint' }, 'Liggend werkt het mooist. Grote telefoonfoto\'s zijn prima, ze worden vanzelf verkleind.'),
      ...veld('Wat staat er op de foto?', fotoAlt),
      el('label', { for: 'b-tekst' }, 'Tekst'),
      werkbalk,
      tekst,
      el('p', { class: 'b-hint' }, 'Een lege regel begint een nieuwe alinea. Met de knoppen maak je tussenkoppen, opsommingen en zet je foto\'s in de tekst.'),
      el('label', { class: 'b-schakel' }, [online, 'Online (uitzetten haalt het artikel tijdelijk van de site)']),
      fout,
    ]),
    el('footer', {}, [opslaan, el('button', { type: 'button', class: 'b-p-knop', onclick: () => { paneel.remove(); paneel = null; if (modus === 'nieuw') location.reload(); else location.reload(); } }, 'Annuleren'), verwijder]),
  ]);
  document.body.append(paneel);
  art?.classList.add('b-bewerkbaar');
  toon();
  titel.focus();
}

// ---------- klantfoto's op de pagina Klantervaringen ----------
const galerij = {
  nieuw: [], // { naam, alt, base64 }
  weg: new Set(),
  knop: null,
  start() {
    const rij = pagina.galerij;
    rij.querySelectorAll('[data-b-foto]').forEach((li) => {
      li.append(el('button', { type: 'button', class: 'b-weg', 'aria-label': 'Deze foto verwijderen', title: 'Verwijderen', onclick: () => {
        const naam = li.dataset.bFoto;
        if (this.weg.has(naam)) this.weg.delete(naam); else this.weg.add(naam);
        li.classList.toggle('b-verwijderd', this.weg.has(naam));
        this.toonKnop();
      } }, '×'));
    });
    this.knop = el('button', { class: 'b-knop b-vol', type: 'button', hidden: '', onclick: () => this.opslaan() }, "Foto's opslaan");
    balk.insertBefore(this.knop, statusVak);
  },
  toonKnop() {
    const n = this.nieuw.length + this.weg.size;
    this.knop.hidden = n === 0;
    this.knop.textContent = `Foto's opslaan (${n})`;
  },
  async toevoegen() {
    const f = await kiesBestand(); if (!f) return;
    const b = await leesFoto(f, 1800);
    const alt = prompt('Wat staat er op de foto? (korte beschrijving, verplicht)', '') ?? '';
    if (!alt.trim()) { zetStatus('Zonder beschrijving kan de foto er niet op; probeer het nog eens.'); return; }
    const naam = nieuweNaam('klant');
    this.nieuw.push({ naam, alt: alt.trim(), base64: b.base64 });
    const li = el('li', { class: 'w-[62vw] flex-none snap-start sm:w-[36vw] lg:w-[15rem] b-nieuw', 'data-b-foto': naam }, [
      el('img', { src: b.dataUrl, alt: alt.trim(), class: 'foto aspect-[3/4] w-full object-cover' }),
      el('button', { type: 'button', class: 'b-weg', 'aria-label': 'Deze foto weghalen', onclick: () => { this.nieuw = this.nieuw.filter((x) => x.naam !== naam); li.remove(); this.toonKnop(); } }, '×'),
    ]);
    pagina.galerij.prepend(li);
    pagina.galerij.scrollTo({ left: 0, behavior: 'smooth' });
    pagina.galerij.scrollIntoView({ block: 'center', behavior: 'smooth' });
    this.toonKnop();
    zetStatus('Foto staat klaar. Klik op "Foto\'s opslaan" als je klaar bent.');
  },
  async opslaan() {
    this.knop.disabled = true;
    zetStatus('Bezig met opslaan...');
    try {
      let lijst = [];
      try { lijst = JSON.parse((await brug(`/bestand?pad=${encodeURIComponent(GALERIJ)}`)).inhoud).fotos ?? []; } catch { lijst = []; }
      lijst = lijst.filter((f) => !this.weg.has((f.foto || '').split('/').pop()));
      for (const n of this.nieuw) lijst.push({ foto: `${RELATIEF}/${n.naam}`, alt: n.alt });
      const bestanden = [{ pad: GALERIJ, tekst: `${JSON.stringify({ fotos: lijst }, null, 2)}\n` }];
      for (const n of this.nieuw) bestanden.push({ pad: `${UPLOAD}/${n.naam}`, base64: n.base64 });
      for (const naam of this.weg) bestanden.push({ pad: `${UPLOAD}/${naam}`, verwijder: true });
      const { commit } = await brug('/opslaan', { method: 'POST', body: JSON.stringify({ bericht: `Klantfoto's bijgewerkt (${this.nieuw.length} nieuw, ${this.weg.size} weg)`, bestanden }) });
      this.nieuw = []; this.weg.clear(); this.toonKnop();
      volgDeploy(commit);
    } catch (e) { zetStatus(e.message); }
    this.knop.disabled = false;
  },
};

// ---------- inlogpagina ----------
const loginForm = document.querySelector('[data-b-login]');
if (loginForm) {
  if (token) location.replace(BASIS);
  const fout = loginForm.querySelector('[data-b-fout]');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    fout.classList.add('hidden');
    const knop = loginForm.querySelector('button');
    knop.disabled = true;
    try {
      const { token: t } = await brug('/login', { method: 'POST', body: JSON.stringify({ wachtwoord: loginForm.wachtwoord.value }) });
      localStorage.setItem(OPSLAG, t);
      location.href = BASIS;
    } catch (err) {
      fout.textContent = err.message;
      fout.classList.remove('hidden');
      knop.disabled = false;
    }
  });
} else if (token) {
  start();
}

