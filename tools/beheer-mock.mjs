// Nepbrug voor het testen van de bewerkmodus zonder GitHub: dezelfde routes als beheer/worker.js,
// maar schrijft rechtstreeks in de projectmap. Start: node tools/beheer-mock.mjs (poort 4537).
// Bouw de site dan met PUBLIC_BEHEER_API=http://127.0.0.1:4537 en log in met wachtwoord "test".
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const WORTEL = path.resolve(new URL('..', import.meta.url).pathname);
const WACHTWOORD = 'test';
const TOKEN = 'mock.token';
const log = [];

const antwoord = (res, data, status = 200) => {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
  });
  res.end(JSON.stringify(data));
};
const veilig = (p) => /^src\/(content|assets\/upload)\/[\w./-]+$/.test(p) && !p.includes('..');

http
  .createServer(async (req, res) => {
    if (req.method === 'OPTIONS') return antwoord(res, {}, 204);
    const url = new URL(req.url, 'http://x');
    let body = '';
    for await (const c of req) body += c;
    const json = body ? JSON.parse(body) : {};
    if (url.pathname === '/ping') return antwoord(res, { ok: true });
    if (url.pathname === '/login') {
      if (json.wachtwoord !== WACHTWOORD) return antwoord(res, { fout: 'Wachtwoord klopt niet.' }, 401);
      return antwoord(res, { token: TOKEN, tot: Date.now() + 86400000 });
    }
    if (req.headers.authorization !== `Bearer ${TOKEN}`) return antwoord(res, { fout: 'Niet ingelogd.' }, 401);
    if (url.pathname === '/bestand') {
      const pad = url.searchParams.get('pad');
      if (!veilig(pad)) return antwoord(res, { fout: 'Ongeldig pad.' }, 400);
      try { return antwoord(res, { pad, inhoud: fs.readFileSync(path.join(WORTEL, pad), 'utf8'), sha: 'mock' }); }
      catch { return antwoord(res, { fout: 'Bestand niet gevonden.' }, 404); }
    }
    if (url.pathname === '/opslaan') {
      for (const b of json.bestanden) {
        if (!veilig(b.pad)) return antwoord(res, { fout: `Ongeldig pad: ${b.pad}` }, 400);
        const doel = path.join(WORTEL, b.pad);
        if (b.verwijder) { fs.rmSync(doel, { force: true }); continue; }
        fs.mkdirSync(path.dirname(doel), { recursive: true });
        if (b.base64 != null) fs.writeFileSync(doel, Buffer.from(b.base64, 'base64'));
        else fs.writeFileSync(doel, b.tekst ?? '');
      }
      log.push(json);
      console.log('opgeslagen:', json.bericht, json.bestanden.map((b) => `${b.verwijder ? '-' : '+'}${b.pad}`).join(' '));
      return antwoord(res, { commit: 'abc1234' });
    }
    if (url.pathname === '/status') return antwoord(res, { status: 'klaar', url: 'https://example.test/run' });
    return antwoord(res, { fout: 'Onbekende route.' }, 404);
  })
  .listen(4537, '127.0.0.1', () => console.log('nepbrug op http://127.0.0.1:4537'));
