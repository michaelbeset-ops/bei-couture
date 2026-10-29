# Bei Couture, Rotterdam: site (bijgewerkt 27-10-2026)

## Concept
Bei Couture is het bruidsatelier van Bei, kleermaker, Hoogstraat 89A in Rotterdam (eigen atelier sinds 1997,
sinds 2009 gespecialiseerd in bruidsmode). De site draait op hun eigen logo: zwarte Bodoni-letters, een gestippelde
cirkel als stiksel en het oudroze van het strikje. De stippellijn ("naad") komt terug als scheidingslijn, eyebrow en
kader. Hun eigen zin is de kop: "Uw droom wordt werkelijkheid in ons atelier." Bei vertelt zelf (ik-vorm).
Wow: "Vertel Bei wat je droomt": kies waarvoor, stof, datum, dag, foto mee, naam. Rechts staat het WhatsApp-bericht
live klaar. Vanaf een dienstpagina staat de juiste keuze al aangevinkt (/contact/?voor=...).

## Keuzes
Lichte site: wit als basis, geen crème of beige (die las de klant als "AI"), haarlijnen #e7e3e0, één heel licht
neutraal vlak #f7f6f5 voor het afspraakformulier. Zwart #1b1716 zoals in de hero, rozenhout #8f4b4f voor knoppen en
accentwoorden, strik #e3bfb6 als roze accent op donker.
Letters: de hero houdt Bodoni Moda 800 (hun logo). Daarbuiten Playfair Display 400 voor koppen (gekozen door de
klant uit drie proeven, 29-10-2026) en DM Sans voor tekst, labels en knoppen (kapitalen met tracking).
Hoeken 2 px, knoppen rechthoekig zoals in de hero, geen schaduwen, geen golfjes, geen nummering.
Diensten op de homepage als zes staande foto's met de naam in kapitalen, voor wie het is, en "Bekijk".
Werkwijze als vijf stappen van links naar rechts op één lijn. Kop doorzichtig over de hero met het logo in ivoor;
op lichte pagina's een donkere balk.

## Paginastructuur
- `/` home: hero > cijfers > 6 dienstkaarten > over Bei (eigen atelierfoto) > Google-reviews (swipebaar) >
  werkwijze > afspraak (wow) > bezoek met openingstijden > FAQ > slotbalk
- `/atelier/` overzicht van alles wat gemaakt en vermaakt wordt
- 6 dienstpagina's (29-10-2026 herbouwd na review door zes invalshoeken: ontwerp, mobiel, tekst, SEO, conversie,
  toegankelijkheid): hero met WhatsApp als eerste knop, roze feitenlint, groot citaat met afspraakpaneel (portret Bei,
  prijs bij de eerste afspraak), eerste onderdeel als foto plus tekst op roze, de rest als raster met figuurtjes,
  werkwijze, donkere reviews, FAQ met prijsvraag, verwante diensten, slotbalk met de dienst voorgevuld.
  `/bruidsjurk-op-maat/` (ook gekleurde trouwjurk en grote maten), `/trouwjurk-vermaken/`
  (ook de jurk van een eerdere trouwdag of van moeder), `/bruidsmoeder-jurk/`, `/bruidsmeisjes-en-bruidsjonkers/`,
  `/gala-en-avondkleding/`, `/kleding-op-maat/`
- `/werkwijze/` de vijf stappen, visueel als draad langs genummerde cirkels, plus wat je meeneemt
- `/klantervaringen/` verhalen per klant: citaat van Google, wat er gedaan is, foto waar die er is
- `/over-bei/` haar verhaal, tijdlijn 1997 / 2009 / nu, waarom bruiden komen
- `/contact/` contactmanieren, openingstijden met het blok "ook buiten de openingstijden", afspraakformulier
- `/privacy/`, `/404`

## SEO
Doelgroep is vrouwelijk: bruid, bruidsmoeder (moeder van de bruid), bruidsmeisjes, bruidsjonkers. Geen herenmode.
Zoekwoorden per pagina in `seo.config.json`. Schema: ClothingStore/LocalBusiness met openingstijden, werkgebied en
geo, plus Service, FAQPage, HowTo, BreadcrumbList en Person. Geen aggregateRating (self-serving, Google toont die
niet). `robots.txt` en `llms.txt` worden gegenereerd; in voorstelmodus staat alles op noindex zonder schema en
zonder canonical. Werkgebied: Rotterdam en omgeving, 16 plaatsen.

## Beveiliging
Content-Security-Policy als meta-tag (Astro hasht de eigen scripts, dus geen 'unsafe-inline' voor JavaScript),
`default-src 'self'`, `object-src 'none'`, `form-action 'none'`, `frame-src 'none'` en `upgrade-insecure-requests`.
Referrer-policy `strict-origin-when-cross-origin`. Geen externe scripts, geen trackers, geen cookies, geen embeds:
alles wordt vanaf de eigen site geladen. Externe links met `rel="noopener"`. `/.well-known/security.txt` wijst naar
Sitefront. Het afspraakformulier verstuurt niets en slaat niets op; het opent WhatsApp met een klaargezet bericht.

## AI-zichtbaarheid
`robots.txt` noemt de zoek- en AI-zoekcrawlers apart (Googlebot, Google-Extended, Google-Agent, Bingbot,
OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Applebot, DuckAssistBot en meer) en staat ook de
trainingscrawlers toe, zoals afgesproken in `seo.config.json` (`aiCrawlers.training: allow`). `llms.txt` bevat de
gegevens, de openingstijden, de diensten, de vijf stappen en tien korte vraag-en-antwoorden. Diezelfde feiten staan
zichtbaar op de site (sectie "Goed om te weten" en de FAQ's), want AI-antwoorden citeren alleen wat op de pagina
staat. Eigen deelafbeelding per pagina (`public/og-*.jpg`, gemaakt met `node tools/og.mjs`).

## Openingstijden
Di t/m vr 11:00 tot 17:00, zondag 12:00 tot 17:00, maandag en zaterdag op afspraak. Dat een afspraak buiten de
openingstijden kan, staat op elke pagina: in de topbalk, in het openingstijdenblok, onder elke slotbalk en als
keuze in het afspraakformulier.

## Bronnen
bron/web, bron/archief (teksten april/juni 2026), bron/google (place, uren, 5 reviews), bron/social, bron/unsplash.
Logo en de atelierfoto van Bei zijn door de klant aangeleverd (27-10-2026), zie src/assets/BRONNEN.txt.

## Nog aanleveren
KvK-nummer en bewaartermijn voor de privacyverklaring. Eigen foto's van jurken en atelier (nu nog sfeerfoto's van
Unsplash). Trouwfoto's plus verhaal van klanten voor `/klantervaringen/` (het `foto`-veld in
`src/data/ervaringen.ts` staat klaar).
