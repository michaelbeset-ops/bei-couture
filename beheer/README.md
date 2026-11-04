# De brug voor de bewerkmodus (voor Michael)

De bewerkmodus op www.beicouture.nl/admin/ (code: `public/beheer/bewerk.js`) slaat op via een kleine
Cloudflare Worker: `worker.js` in deze map. Die bewaart de GitHub-sleutel en controleert het wachtwoord
van Bei. Elke "opslaan" wordt één commit op main; daarna bouwt GitHub Actions de site (zie
`.github/workflows/deploy.yml`). Alles gratis.

## Eenmalig inrichten (ongeveer 15 minuten)

### 1. GitHub-sleutel maken

1. GitHub, rechtsboven je profiel, Settings, Developer settings, Personal access tokens,
   Fine-grained tokens, Generate new token.
2. Naam: `bei-couture-beheer`. Expiration: 1 jaar (zet een herinnering, daarna opnieuw maken).
3. Repository access: Only select repositories, kies `michaelbeset-ops/bei-couture`.
4. Repository permissions: Contents: Read and write. Actions: Read-only. (Metadata staat vanzelf aan.)
5. Generate token en kopieer hem; je ziet hem maar één keer.

### 2. Worker plaatsen bij Cloudflare (gratis account volstaat)

Via de website, zonder iets te installeren:

1. dash.cloudflare.com, Workers & Pages, Create, Create Worker. Naam: `bei-couture-beheer`. Deploy.
2. Klik op Edit code, verwijder alles en plak de inhoud van `beheer/worker.js`. Deploy.
3. Ga naar Settings, Variables and Secrets, en voeg toe:
   - `REPO` (text): `michaelbeset-ops/bei-couture`
   - `TAK` (text): `main`
   - `ORIGINS` (text): `https://www.beicouture.nl,https://beicouture.nl`
   - `WACHTWOORD` (secret): het wachtwoord voor Bei (lang en niet te raden, bijvoorbeeld drie woorden)
   - `SECRET` (secret): een willekeurige lange tekst van minstens 32 tekens (bijvoorbeeld uit een
     wachtwoordgenerator); hiermee worden de inlogsessies ondertekend
   - `GITHUB_TOKEN` (secret): de sleutel uit stap 1
4. Deploy. Noteer de URL van de Worker, bijvoorbeeld `https://bei-couture-beheer.<jouw-account>.workers.dev`.
5. Controle: open `<worker-url>/ping` in de browser; je moet `{"ok":true}` zien.

Liever met de commandoregel: `npm i -g wrangler`, in deze map `wrangler login`, `wrangler deploy`, en
daarna `wrangler secret put WACHTWOORD` (en SECRET, GITHUB_TOKEN). De variabelen staan in `wrangler.toml`.

### 3. De site aan de brug koppelen

1. GitHub, repo bei-couture, Settings, Secrets and variables, Actions, tab Variables, New repository
   variable: naam `PUBLIC_BEHEER_API`, waarde de Worker-URL (zonder slash aan het eind).
2. Start een deploy (Actions, "Site bouwen en uitrollen", Run workflow) of push iets naar main.
3. Test: www.beicouture.nl/admin, inloggen, "Klantervaring toevoegen", iets invullen, "Op de site zetten".
   Na drie minuten staat het onderaan de verhalen op www.beicouture.nl/klantervaringen/. Verwijder de
   testervaring daarna via "Deze ervaring bewerken", Verwijderen.

Lokaal testen zonder Cloudflare: `node tools/beheer-mock.mjs` (nepbrug op poort 4537, wachtwoord `test`),
`PUBLIC_BEHEER_API=http://127.0.0.1:4537 npm run build && npm run preview`, en `node tools/beheer-test.mjs`
voor de automatische test.

## Wat Bei kan

Klantervaringen op Klantervaringen (toevoegen, aanpassen, offline zetten, verwijderen; met 0 tot 4 foto's) en klantfoto's op Klantervaringen (toevoegen,
verwijderen). De handleiding voor haar staat in `BEHEER.md`.

## Veiligheid

- De GitHub-sleutel staat alleen in de Worker, nooit in de site of de browser.
- De Worker accepteert alleen paden onder `src/content/` en `src/assets/upload/`; de rest van de site kan
  er niet mee veranderd worden.
- Een fout wachtwoord wacht anderhalve seconde, zodat raden niet loont. Inlogsessies verlopen na dertig dagen.
- Wachtwoord veranderen: pas de secret `WACHTWOORD` aan in Cloudflare. Alle sessies ongeldig maken: pas `SECRET` aan.
