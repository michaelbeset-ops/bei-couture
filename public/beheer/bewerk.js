// Bewerkmodus van Bei Couture. Wordt alleen geladen na inloggen (zie de lader in src/layouts/Base.astro).
// Bei ziet haar eigen site met een balk bovenin en kan klantervaringen en klantfoto's toevoegen op de pagina
// Klantervaringen zelf; wat ze typt verschijnt direct in de pagina. Opslaan gaat via de brug (beheer/worker.js),
// die alles in één commit op GitHub zet; daarna bouwt de site zichzelf opnieuw (ongeveer drie minuten).
//
// Bestanden die hieruit ontstaan: src/content/klantverhalen/<id>.json, src/assets/upload/<naam>.jpg en
// src/content/galerij/fotos.json. Precies dezelfde vorm als de site verwacht (src/lib/beheer.ts).

const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.content ?? '';
const API = meta('beheer-api').replace(/\/$/, '');
const BASIS = meta('beheer-basis') || '/';
const OPSLAG = 'bei-beheer';
const UPLOAD = 'src/assets/upload';
const VERHALEN = 'src/content/klantverhalen';
const BRONNEN = ['Google', 'WhatsApp', 'Instagram', 'Facebook', 'In het atelier'];
const MAX_FOTOS = 4;
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
const maandJaar = (iso) => {
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d) ? '' : d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
};
const vandaag = () => new Date().toISOString().slice(0, 10);
const slug = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'ervaring';
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
const kiesBestanden = () =>
  new Promise((ok) => {
    const i = el('input', { type: 'file', accept: 'image/*', multiple: '' });
    i.addEventListener('change', () => ok([...i.files]));
    i.click();
  });
const nieuweNaam = (voorvoegsel) => `${voorvoegsel}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}.jpg`;

// ---------- de bewerkmodus ----------
let balk, statusVak, paneel;
const pagina = {
  verhalen: document.querySelector('[data-b-nieuw-hier]'),
  galerij: document.querySelector('[data-b-galerij]'),
};

function start() {
  document.head.append(el('link', { rel: 'stylesheet', href: `${BASIS}beheer/bewerk.css` }));
  document.body.classList.add('b-aan');
  statusVak = el('span', { class: 'b-status' });
  balk = el('div', { class: 'b-balk', role: 'region', 'aria-label': 'Bewerkmodus' }, [
    el('span', { class: 'b-naam' }, 'Bewerkmodus'),
    el('button', { class: 'b-knop b-vol', type: 'button', onclick: () => {
      if (pagina.verhalen) nieuwVerhaal(); else location.href = `${BASIS}klantervaringen/#nieuw`;
    } }, [el('span', { class: 'b-lang' }, 'Klantervaring toevoegen'), el('span', { class: 'b-kort' }, '+ Ervaring')]),
    pagina.galerij
      ? el('button', { class: 'b-knop', type: 'button', onclick: () => galerij.toevoegen() }, [el('span', { class: 'b-lang' }, 'Foto toevoegen'), el('span', { class: 'b-kort' }, '+ Foto')])
      : el('button', { class: 'b-knop', type: 'button', onclick: () => { location.href = `${BASIS}klantervaringen/#fotos`; } }, "Klantfoto's"),
    statusVak,
    el('button', { class: 'b-knop b-rood', type: 'button', onclick: uitloggen }, 'Uitloggen'),
  ]);
  document.body.prepend(balk);
  zetStatus(API ? 'Klik op een knop om iets toe te voegen of te wijzigen.' : 'De brug is nog niet gekoppeld; opslaan werkt nog niet.');
  if (pagina.verhalen) markeerVerhalen();
  if (pagina.galerij) galerij.start();
  if (location.hash === '#fotos' && pagina.galerij) setTimeout(() => galerij.toevoegen(), 300);
  if (location.hash === '#nieuw' && pagina.verhalen) { history.replaceState(null, '', location.pathname); nieuwVerhaal(); }
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

// ---------- klantervaringen: paneel met live voorbeeld in de pagina ----------
// Het blok komt uit /admin/sjabloon/ (src/components/Verhaal.astro), in de variant met het juiste aantal foto's
// en de juiste kant. Zo ziet Bei precies wat bezoekers straks zien, zonder dat hier opmaak dubbel staat.
let sjabloonDoc = null;
async function sjabloon() {
  if (!sjabloonDoc) {
    const r = await fetch(`${BASIS}admin/sjabloon/`);
    if (!r.ok) throw new Error('Het sjabloon kon niet geladen worden. Vernieuw de pagina en probeer het opnieuw.');
    sjabloonDoc = new DOMParser().parseFromString(await r.text(), 'text/html');
  }
  return sjabloonDoc;
}
const dienstenLijst = (doc) => {
  try { return JSON.parse(doc.querySelector('[data-b-diensten]')?.dataset.bDiensten || '[]'); } catch { return []; }
};

// Knoppen bij de ervaringen die Bei zelf heeft toegevoegd; offline gezette worden zichtbaar (gemarkeerd).
function markeerVerhalen() {
  document.querySelectorAll('section[data-b-verhaal]').forEach((sectie) => {
    if (sectie.hidden) {
      sectie.hidden = false;
      sectie.classList.add('b-offline');
      sectie.prepend(el('p', { class: 'b-offline-label' }, 'Staat offline: bezoekers zien deze ervaring niet'));
    }
    sectie.prepend(el('button', { type: 'button', class: 'b-verhaal-knop', onclick: () => bewerkVerhaal(sectie) }, 'Deze ervaring bewerken'));
  });
}

const leegVerhaal = () => ({ id: '', label: '', kop: '', citaat: '', tekst: '', naam: '', sterren: 5, bron: '', datum: vandaag(), dienst: '', fotos: [], online: true });

async function nieuwVerhaal() {
  if (paneel) return;
  zetStatus('Sjabloon laden...');
  try { await openVerhaal(leegVerhaal(), 'nieuw', null); zetStatus('Vul de velden in; je ziet de ervaring meteen in de pagina.'); }
  catch (e) { zetStatus(e.message); }
}

async function bewerkVerhaal(sectie) {
  if (paneel) return;
  const id = sectie.dataset.bVerhaal;
  zetStatus('Ervaring ophalen...');
  try {
    const { inhoud } = await brug(`/bestand?pad=${encodeURIComponent(`${VERHALEN}/${id}.json`)}`);
    const v = { ...leegVerhaal(), ...JSON.parse(inhoud), id };
    // Bestaande foto's: de gebouwde bestandsnaam begint met de oorspronkelijke naam.
    // Astro kan een naam veranderen (dezelfde foto twee keer wordt één bestand), dus anders op volgorde.
    const opVolgorde = [...sectie.querySelectorAll('[data-b-plek]')]
      .map((pl, k) => [Number(pl.dataset.bVolgorde ?? k), pl.querySelector('img')])
      .sort((x, y) => x[0] - y[0])
      .map(([, img]) => img?.currentSrc || img?.src || '');
    const bestaand = new Map(opVolgorde.map((src) => [basisnaam(src), src]));
    v.fotos = (v.fotos || []).map((f, k) => ({ foto: f.foto, alt: f.alt || '', src: bestaand.get(basisnaam(f.foto)) || opVolgorde[k] || '' }));
    v.sterren = Number(v.sterren ?? 0);
    await openVerhaal(v, 'bewerk', sectie);
    zetStatus('Pas de ervaring aan; je ziet het meteen in de pagina.');
  } catch (e) { zetStatus(e.message); }
}

function veld(label, invoer, hint) {
  return [el('label', { for: invoer.id }, label), invoer, hint ? el('p', { class: 'b-hint' }, hint) : null];
}
function keuze(id, opties, waarde) {
  const s = el('select', { id }, opties.map(([w, t]) => el('option', { value: w }, t)));
  s.value = String(waarde ?? '');
  return s;
}

async function openVerhaal(v, modus, sectie) {
  const doc = await sjabloon();
  const diensten = dienstenLijst(doc);
  const p = sectie ? Number(sectie.dataset.bP) || 0 : Number(pagina.verhalen.dataset.bP) || 0;
  const oorspronkelijk = new Set(v.fotos.map((f) => (f.foto || '').split('/').pop())); // om weggehaalde foto's op te ruimen
  let voorbeeld = sectie;
  let huidigN = -1;

  // ----- velden -----
  const label = el('input', { type: 'text', id: 'b-label', value: v.label, placeholder: 'Bijvoorbeeld: Trouwjurk vermaakt' });
  const kop = el('input', { type: 'text', id: 'b-kop', value: v.kop, placeholder: 'Bijvoorbeeld: Nog mooier dan gedacht' });
  const citaat = el('textarea', { id: 'b-citaat', placeholder: 'Plak of typ hier wat de klant schreef of zei.' });
  citaat.value = v.citaat;
  const tekst = el('textarea', { id: 'b-tekst', placeholder: 'Wat heb je gedaan? Bijvoorbeeld: de jurk is ingenomen en de sleep ingekort.' });
  tekst.value = v.tekst;
  const naam = el('input', { type: 'text', id: 'b-naam', value: v.naam, placeholder: 'Bijvoorbeeld: Marcel of Christina W.' });
  const sterren = keuze('b-sterren', [['5', '★★★★★  5 sterren'], ['4', '★★★★  4 sterren'], ['3', '★★★  3 sterren'], ['2', '★★  2 sterren'], ['1', '★  1 ster'], ['0', 'Geen sterren tonen']], v.sterren);
  const bron = keuze('b-bron', [['', 'Niet vermelden'], ...BRONNEN.map((b) => [b, b])], BRONNEN.includes(v.bron) ? v.bron : '');
  const datum = el('input', { type: 'date', id: 'b-datum', value: v.datum || vandaag() });
  const dienst = keuze('b-dienst', [['', 'Geen knop'], ...diensten.map((d) => [d.slug, d.titel])], v.dienst);
  const online = el('input', { type: 'checkbox', id: 'b-online' });
  online.checked = v.online !== false;
  const fout = el('p', { class: 'b-fout', hidden: '' });

  // ----- foto's -----
  const fotoLijst = el('div', { class: 'b-fotolijst' });
  const fotoKnop = el('button', { type: 'button', class: 'b-p-knop', onclick: async () => {
    const vrij = MAX_FOTOS - v.fotos.length;
    const gekozen = (await kiesBestanden()).slice(0, vrij);
    if (!gekozen.length) return;
    fotoKnop.disabled = true; fotoKnop.textContent = "Foto's verkleinen...";
    for (const f of gekozen) {
      try {
        const b = await leesFoto(f, 1800);
        v.fotos.push({ foto: `${RELATIEF}/${nieuweNaam('ervaring')}`, alt: '', src: b.dataUrl, base64: b.base64 });
      } catch (e) { toonFout(e.message); }
    }
    fotoKnop.disabled = false;
    toonFotos(); toon();
  } }, "Foto's kiezen");

  function toonFotos() {
    fotoLijst.replaceChildren(...v.fotos.map((f, k) => {
      const alt = el('input', { type: 'text', value: f.alt, placeholder: 'Wat staat erop? (mag leeg blijven)', 'aria-label': `Beschrijving foto ${k + 1}` });
      alt.addEventListener('input', () => { f.alt = alt.value; toon(); });
      const schuif = (r) => { const [x] = v.fotos.splice(k, 1); v.fotos.splice(k + r, 0, x); toonFotos(); toon(); };
      return el('div', { class: 'b-fotoitem' }, [
        el('img', { src: f.src, alt: '' }),
        el('div', { class: 'b-fotoinfo' }, [
          el('span', { class: 'b-fotonr' }, k === 0 ? 'Grote foto' : `Foto ${k + 1}`),
          alt,
          el('div', { class: 'b-fotoknoppen' }, [
            el('button', { type: 'button', disabled: k === 0 ? '' : null, title: 'Naar voren', onclick: () => schuif(-1) }, k === 1 ? 'Maak groot' : '← Naar voren'),
            el('button', { type: 'button', disabled: k === v.fotos.length - 1 ? '' : null, title: 'Naar achteren', onclick: () => schuif(1) }, 'Naar achteren →'),
            el('button', { type: 'button', class: 'b-weg-tekst', onclick: () => { v.fotos.splice(k, 1); toonFotos(); toon(); } }, 'Weghalen'),
          ]),
        ]),
      ]);
    }));
    fotoKnop.hidden = v.fotos.length >= MAX_FOTOS;
    fotoKnop.textContent = v.fotos.length ? 'Nog een foto toevoegen' : "Foto's kiezen";
  }

  // ----- live voorbeeld -----
  const leesVelden = () => {
    Object.assign(v, {
      label: label.value.trim(), kop: kop.value.trim(), citaat: citaat.value.trim().replace(/^["“”]+|["“”]+$/g, ''), tekst: tekst.value.trim(),
      naam: naam.value.trim(), sterren: Number(sterren.value), bron: bron.value, datum: datum.value || vandaag(), dienst: dienst.value, online: online.checked,
    });
  };
  function toon() {
    leesVelden();
    const n = v.fotos.length;
    if (n !== huidigN) {
      const blok = doc.querySelector(`[data-b-variant="${n}-${p}"]`);
      if (!blok) return;
      const kloon = document.importNode(blok, true);
      kloon.removeAttribute('data-b-variant');
      kloon.hidden = false;
      kloon.classList.add('b-bewerkbaar');
      if (voorbeeld) voorbeeld.replaceWith(kloon); else pagina.verhalen.after(kloon);
      const eerste = !voorbeeld;
      voorbeeld = kloon;
      huidigN = n;
      if (eerste) kloon.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    vul(voorbeeld);
  }
  function vul(s) {
    const d = (n) => s.querySelector(`[data-b="${n}"]`);
    const zet = (e, aan) => { if (e) e.hidden = !aan; };
    d('label').textContent = v.label; zet(d('label'), v.label);
    d('kop').textContent = v.kop || 'Kop van de ervaring';
    d('kop').classList.toggle('b-leeg', !v.kop);
    d('kop').classList.toggle('mt-4', !!v.label);
    d('citaat').textContent = `“${v.citaat}”`; zet(d('citaat-blok'), v.citaat);
    d('tekst').replaceChildren(...v.tekst.split(/\n\s*\n/).map((t) => t.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean).map((t) => el('p', {}, t)));
    zet(d('tekst'), v.tekst);
    s.querySelectorAll('[data-b-ster]').forEach((st, k) => zet(st, k < v.sterren));
    d('sterren').setAttribute('aria-label', `${v.sterren} van 5 sterren`);
    zet(d('sterren'), v.sterren > 0);
    d('naam').textContent = v.naam; zet(d('naam'), v.naam);
    const bronTekst = [v.bron, maandJaar(v.datum)].filter(Boolean).join(', ');
    d('bron').textContent = v.sterren > 0 || v.naam ? `· ${bronTekst}` : bronTekst; zet(d('bron'), bronTekst);
    zet(d('meta'), v.sterren > 0 || v.naam || bronTekst);
    const dt = diensten.find((x) => x.slug === v.dienst);
    if (dt) { d('knop').href = `${BASIS}${dt.slug}/`; d('knop').textContent = dt.titel; }
    zet(d('knop'), dt);
    zet(d('google'), v.bron === 'Google');
    zet(d('knoppen'), dt || v.bron === 'Google');
    const plekken = [...s.querySelectorAll('[data-b-plek]')].map((pl, k) => [Number(pl.dataset.bVolgorde ?? k), pl]).sort((a, b) => a[0] - b[0]).map(([, pl]) => pl);
    plekken.forEach((pl, k) => {
      const f = v.fotos[k];
      if (!f) return;
      const img = pl.querySelector('img');
      if (pl.dataset.bSrc !== f.src) {
        const nieuw = el('img', { src: f.src, alt: f.alt, class: img?.className || 'foto w-full object-cover', style: img?.getAttribute('style') || '' });
        pl.replaceChildren(nieuw);
        pl.dataset.bSrc = f.src;
      } else if (img) img.alt = f.alt;
    });
    s.classList.toggle('b-offline', !v.online);
  }
  [label, kop, citaat, tekst, naam, datum].forEach((i) => i.addEventListener('input', toon));
  [sterren, bron, dienst, online].forEach((i) => i.addEventListener('change', toon));

  // ----- opslaan en verwijderen -----
  const opslaanTekst = modus === 'bewerk' ? 'Wijzigingen opslaan' : 'Op de site zetten';
  const opslaan = el('button', { type: 'button', class: 'b-p-knop b-vol', onclick: async () => {
    fout.hidden = true;
    leesVelden();
    if (!v.kop) return toonFout('Geef de ervaring een kop, bijvoorbeeld een paar woorden uit wat de klant zei.');
    if (!v.citaat && !v.tekst) return toonFout('Vul wat de klant zei in, of schrijf een toelichting.');
    let id = v.id;
    if (modus !== 'bewerk') {
      id = `${v.datum}-${slug(v.kop)}`;
      if (document.querySelector(`[data-b-verhaal="${id}"]`)) id += `-${Date.now().toString(36).slice(-4)}`;
    }
    const data = {
      label: v.label, kop: v.kop, citaat: v.citaat, tekst: v.tekst, naam: v.naam, sterren: v.sterren, bron: v.bron,
      datum: v.datum, dienst: v.dienst, fotos: v.fotos.map((f) => ({ foto: f.foto, alt: f.alt.trim() })), online: v.online,
    };
    const bestanden = [{ pad: `${VERHALEN}/${id}.json`, tekst: `${JSON.stringify(data, null, 2)}\n` }];
    for (const f of v.fotos) if (f.base64) bestanden.push({ pad: `${UPLOAD}/${f.foto.split('/').pop()}`, base64: f.base64 });
    const nu = new Set(v.fotos.map((f) => f.foto.split('/').pop()));
    for (const naamOud of oorspronkelijk) if (naamOud && !nu.has(naamOud)) bestanden.push({ pad: `${UPLOAD}/${naamOud}`, verwijder: true });
    await verstuur(bestanden, modus === 'bewerk' ? `Klantervaring bijgewerkt: ${v.kop}` : `Nieuwe klantervaring: ${v.kop}`);
  } }, opslaanTekst);

  const verwijder = modus === 'bewerk' ? el('button', { type: 'button', class: 'b-p-knop b-rood', onclick: async () => {
    if (!confirm('Deze ervaring en de foto\'s erbij van de site halen? Dit kan niet ongedaan worden gemaakt. (Tijdelijk weghalen kan ook: zet dan "Online" uit.)')) return;
    const bestanden = [{ pad: `${VERHALEN}/${v.id}.json`, verwijder: true }];
    for (const naamOud of oorspronkelijk) if (naamOud) bestanden.push({ pad: `${UPLOAD}/${naamOud}`, verwijder: true });
    await verstuur(bestanden, `Klantervaring verwijderd: ${v.kop}`);
  } }, 'Verwijderen') : null;

  async function verstuur(bestanden, bericht) {
    opslaan.disabled = true; opslaan.textContent = 'Bezig met opslaan...';
    try {
      const { commit } = await brug('/opslaan', { method: 'POST', body: JSON.stringify({ bericht, bestanden }) });
      paneel.remove(); paneel = null;
      document.body.classList.remove('b-paneel-open');
      volgDeploy(commit);
    } catch (e) {
      toonFout(e.message);
      opslaan.disabled = false; opslaan.textContent = opslaanTekst;
    }
  }
  function toonFout(t) { fout.textContent = t; fout.hidden = false; fout.scrollIntoView({ block: 'nearest' }); }
  const sluit = () => { paneel.remove(); paneel = null; location.reload(); };

  paneel = el('aside', { class: 'b-paneel', 'aria-label': 'Klantervaring bewerken' }, [
    el('header', {}, [el('h2', {}, modus === 'bewerk' ? 'Ervaring bewerken' : 'Nieuwe klantervaring'), el('button', { type: 'button', class: 'b-sluit', 'aria-label': 'Sluiten', onclick: sluit }, '×')]),
    el('div', { class: 'b-velden' }, [
      el('p', { class: 'b-groep' }, 'De tekst'),
      ...veld('Kop', kop, 'De grote titel. Een paar woorden uit wat de klant zei werkt goed.'),
      ...veld('Klein label boven de kop', label, 'Wat er gedaan is. Mag leeg blijven.'),
      ...veld('Wat zei de klant?', citaat, 'Komt tussen aanhalingstekens. Die zet de site er zelf omheen.'),
      ...veld('Jouw toelichting', tekst, 'Mag leeg blijven. Een lege regel begint een nieuwe alinea.'),
      el('p', { class: 'b-groep' }, "Foto's"),
      el('p', { class: 'b-hint b-hint-boven' }, "1 tot 4 foto's. De eerste is de grote foto. Grote telefoonfoto's zijn prima, ze worden vanzelf verkleind."),
      fotoLijst,
      fotoKnop,
      el('p', { class: 'b-groep' }, 'Van wie en wanneer'),
      ...veld('Naam van de klant', naam, 'Alleen met toestemming. Voornaam, eventueel met een letter. Mag leeg blijven.'),
      ...veld('Sterren', sterren),
      ...veld('Waar staat deze review?', bron, 'Kies Google alleen als de review echt op Google staat; dan komt er ook een link "Lees op Google" bij.'),
      ...veld('Datum', datum, 'Er staat alleen maand en jaar. De nieuwste ervaring komt bovenaan (onder de vaste reviews).'),
      el('p', { class: 'b-groep' }, 'Knop'),
      ...veld('Knop naar', dienst, 'Een knop naar de pagina die bij deze ervaring past.'),
      el('label', { class: 'b-schakel' }, [online, 'Online (uitzetten haalt de ervaring tijdelijk van de site)']),
      fout,
    ]),
    el('footer', {}, [opslaan, el('button', { type: 'button', class: 'b-p-knop', onclick: sluit }, 'Annuleren'), verwijder]),
  ]);
  document.body.append(paneel);
  document.body.classList.add('b-paneel-open');
  toonFotos();
  toon();
  kop.focus({ preventScroll: true });
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

