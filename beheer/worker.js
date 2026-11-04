// Brug tussen de bewerkmodus op www.beicouture.nl en de GitHub-repo. Draait als Cloudflare Worker (gratis).
//
// Geheimen (wrangler secret put ...): WACHTWOORD (van Bei), SECRET (willekeurige lange tekst, voor de
// inlogtokens), GITHUB_TOKEN (fine-grained token, alleen deze repo: Contents lezen/schrijven, Actions lezen).
// Variabelen (wrangler.toml): REPO, TAK, ORIGINS.
//
// Alle routes behalve /login en /ping vragen "Authorization: Bearer <token>". Een token is "<vervaldatum>.<hmac>".

const tekst = new TextEncoder();

const antwoord = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...extra } });

function cors(env, req) {
  const origin = req.headers.get('Origin') || '';
  const toegestaan = (env.ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const ok = toegestaan.includes(origin);
  return {
    'access-control-allow-origin': ok ? origin : toegestaan[0] || '',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

async function hmac(secret, data) {
  const sleutel = await crypto.subtle.importKey('raw', tekst.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', sleutel, tekst.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const gelijk = (a, b) => {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

async function maakToken(env) {
  const tot = Date.now() + 30 * 24 * 3600 * 1000; // dertig dagen ingelogd blijven
  return { token: `${tot}.${await hmac(env.SECRET, String(tot))}`, tot };
}

async function geldig(env, req) {
  const m = /^Bearer (\d+)\.([0-9a-f]+)$/.exec(req.headers.get('Authorization') || '');
  if (!m) return false;
  if (Number(m[1]) < Date.now()) return false;
  return gelijk(m[2], await hmac(env.SECRET, m[1]));
}

async function github(env, pad, init = {}) {
  const r = await fetch(`https://api.github.com${pad}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'bei-couture-beheer',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`GitHub ${r.status} bij ${pad}: ${t.slice(0, 300)}`);
  }
  return r.status === 204 ? null : r.json();
}

// Eén commit met alle bestanden tegelijk (Git Data API), zodat de site precies één keer opnieuw bouwt.
async function opslaan(env, { bericht, bestanden }) {
  const repo = env.REPO;
  const tak = env.TAK || 'main';
  const ref = await github(env, `/repos/${repo}/git/ref/heads/${tak}`);
  const laatste = ref.object.sha;
  const commit = await github(env, `/repos/${repo}/git/commits/${laatste}`);

  const tree = [];
  for (const b of bestanden) {
    if (!/^[\w./-]+$/.test(b.pad) || b.pad.includes('..')) throw new Error(`Ongeldig pad: ${b.pad}`);
    if (b.verwijder) {
      tree.push({ path: b.pad, mode: '100644', type: 'blob', sha: null });
      continue;
    }
    const blob = await github(env, `/repos/${repo}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify(b.base64 != null ? { content: b.base64, encoding: 'base64' } : { content: b.tekst ?? '', encoding: 'utf-8' }),
    });
    tree.push({ path: b.pad, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const nieuweTree = await github(env, `/repos/${repo}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree }) });
  const nieuweCommit = await github(env, `/repos/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: bericht || 'Bijgewerkt via de bewerkmodus',
      tree: nieuweTree.sha,
      parents: [laatste],
      author: { name: 'Bei Couture (bewerkmodus)', email: 'info@beicouture.nl', date: new Date().toISOString() },
    }),
  });
  await github(env, `/repos/${repo}/git/refs/heads/${tak}`, { method: 'PATCH', body: JSON.stringify({ sha: nieuweCommit.sha, force: false }) });
  return { commit: nieuweCommit.sha };
}

async function bestand(env, pad) {
  const repo = env.REPO;
  const tak = env.TAK || 'main';
  const r = await github(env, `/repos/${repo}/contents/${pad}?ref=${encodeURIComponent(tak)}`);
  const bytes = Uint8Array.from(atob(r.content.replace(/\n/g, '')), (c) => c.charCodeAt(0));
  return { pad, inhoud: new TextDecoder().decode(bytes), sha: r.sha };
}

// Staat van de deploy voor een commit: wacht, bezig, klaar of mislukt.
async function status(env, commitSha) {
  const repo = env.REPO;
  const runs = await github(env, `/repos/${repo}/actions/runs?head_sha=${commitSha}&per_page=5`);
  const run = runs.workflow_runs?.[0];
  if (!run) return { status: 'wacht' };
  if (run.status !== 'completed') return { status: 'bezig', url: run.html_url };
  return { status: run.conclusion === 'success' ? 'klaar' : 'mislukt', url: run.html_url };
}

export default {
  async fetch(req, env) {
    const koppen = cors(env, req);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: koppen });
    const url = new URL(req.url);
    try {
      if (url.pathname === '/ping') return antwoord({ ok: true }, 200, koppen);

      if (url.pathname === '/login' && req.method === 'POST') {
        const { wachtwoord = '' } = await req.json().catch(() => ({}));
        if (!env.WACHTWOORD || !gelijk(String(wachtwoord), env.WACHTWOORD)) {
          await new Promise((r) => setTimeout(r, 1500)); // remmen tegen raden
          return antwoord({ fout: 'Wachtwoord klopt niet.' }, 401, koppen);
        }
        return antwoord(await maakToken(env), 200, koppen);
      }

      if (!(await geldig(env, req))) return antwoord({ fout: 'Niet ingelogd.' }, 401, koppen);

      if (url.pathname === '/bestand' && req.method === 'GET') {
        const pad = url.searchParams.get('pad') || '';
        if (!/^src\/(content|assets\/upload)\/[\w./-]+$/.test(pad) || pad.includes('..')) return antwoord({ fout: 'Ongeldig pad.' }, 400, koppen);
        return antwoord(await bestand(env, pad), 200, koppen);
      }

      if (url.pathname === '/opslaan' && req.method === 'POST') {
        const body = await req.json();
        if (!Array.isArray(body.bestanden) || !body.bestanden.length) return antwoord({ fout: 'Niets om op te slaan.' }, 400, koppen);
        for (const b of body.bestanden) {
          if (!/^src\/(content|assets\/upload)\/[\w./-]+$/.test(b.pad)) return antwoord({ fout: `Ongeldig pad: ${b.pad}` }, 400, koppen);
        }
        return antwoord(await opslaan(env, body), 200, koppen);
      }

      if (url.pathname === '/status' && req.method === 'GET') {
        const sha = url.searchParams.get('commit') || '';
        if (!/^[0-9a-f]{7,40}$/.test(sha)) return antwoord({ fout: 'Ongeldige commit.' }, 400, koppen);
        return antwoord(await status(env, sha), 200, koppen);
      }

      return antwoord({ fout: 'Onbekende route.' }, 404, koppen);
    } catch (e) {
      return antwoord({ fout: String(e.message || e) }, 500, koppen);
    }
  },
};
