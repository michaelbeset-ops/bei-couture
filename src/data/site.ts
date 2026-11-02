// Feiten (bekeken 15 oktober 2026), bronnen in bron/:
// - Google-profiel "Bei Couture" (bron/google/place.json, uren.txt): Kleermaker, Hoogstraat 89A, 3011 PJ Rotterdam,
//   "Gevestigd in: Estay Concept & Design", 06 53612543, 5,0 uit 51 reviews.
//   Open di t/m vr 11:00-17:00, zo 12:00-17:00, ma en za gesloten. Buiten deze tijden kan er een afspraak
//   ingepland worden (bevestigd door Bei, 27 oktober 2026).
// - Eigen site beicouture.nl gaf een PHP/WordPress-fout (bron/web/beicouture-390.png en -1440.png).
//   Teksten uit het webarchief (bron/archief, april en juni 2026): "Uw droom wordt werkelijkheid in ons atelier",
//   "Mijn naam is Bei", atelier sinds 1997 (Marconiplein), sinds 2009 gespecialiseerd in bruidsmode.
// - Instagram @beicouture (bron/social): laatste post november 2020, niet gelinkt als actief kanaal.
// - Geen KvK-nummer gezien: niet getoond. Geen prijzen (oude "vanaf € 500" uit 2019 is tijdgebonden).
export const site = {
  naam: 'Bei Couture',
  eigenaar: 'Bei',
  plaats: 'Rotterdam',
  straat: 'Hoogstraat 89A',
  postcode: '3011 PJ',
  land: 'NL',
  inPand: 'Estay Concept & Design',
  tel: '06 53 61 25 43',
  telHref: 'tel:+31653612543',
  telE164: '+31653612543',
  wa: 'https://wa.me/31653612543',
  mail: 'info@beicouture.nl',
  lat: 51.922307,
  lon: 4.4914026,
  route: 'https://www.google.com/maps/dir/?api=1&destination=Hoogstraat+89A%2C+3011+PJ+Rotterdam',
  reviews: 'https://www.google.com/maps/place/Bei+Couture/@51.922307,4.4914026,17z/data=!4m6!3m5!1s0x47c4335ec636a273:0xd37342ba58cbe407!8m2!3d51.922307!4d4.4914026!16s%2Fg%2F11b67bk6v8',
  google: { score: '5,0', scoreNum: 5, aantal: 51 },
  // 0 = zondag ... 6 = zaterdag; null = gesloten. Maandag op afspraak; zaterdag echt dicht (zie `dicht`).
  // Afspraken kunnen al vanaf 9:00, voordat het atelier opengaat (Bei, 02-11-2026).
  tijden: [[12, 17], null, [11, 17], [11, 17], [11, 17], [11, 17], null] as ([number, number] | null)[],
  dicht: [6],
  afspraakVanaf: 9,
  opAfspraak: 'Een afspraak kan al vanaf 9:00 uur, voordat het atelier opengaat. Past het overdag niet, dan kan het in overleg ook in de avond of op maandag. Even bellen of appen en we prikken samen een moment.',
  themeColor: '#1b1716',
  voorstel: import.meta.env.PUBLIC_VOORSTEL === '1',
};

export const dagen = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
export const dagenKort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const volgorde = [1, 2, 3, 4, 5, 6, 0];

// Werkgebied: Rotterdam en omgeving, binnen ongeveer een half uur rijden van de Hoogstraat.
export const werkgebied = [
  'Rotterdam', 'Schiedam', 'Vlaardingen', 'Capelle aan den IJssel', 'Krimpen aan den IJssel',
  'Barendrecht', 'Ridderkerk', 'Spijkenisse', 'Hoogvliet', 'Rhoon', 'Berkel en Rodenrijs',
  'Bergschenhoek', 'Nieuwerkerk aan den IJssel', 'Maassluis', 'Delft', 'Dordrecht',
];

export const url = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
export const waMet = (tekst: string) => `${site.wa}?text=${encodeURIComponent(tekst)}`;
export const waHoi = waMet('Hallo Bei, ik wil graag een afspraak maken in het atelier.');

// Letterlijk van Google (alle 5 sterren, in het Nederlands geschreven). Naam: voornaam + initiaal. "…" = ingekort.
export const reviews = [
  { naam: 'Christina W.', wanneer: '4 maanden geleden', tekst: 'Wat een topervaring hebben wij gehad bij lieve Bei, een warme vrouw die super mooi onze trouwjurk en pak heeft vermaakt. Het lijkt net alsof je bij een familielid bent zodra je bij Bei binnenkomt. … Dankbaar voor jouw werk Bei, je hebt gouden handen.' },
  { naam: 'Marisela B.', wanneer: 'een maand geleden', tekst: 'Zeer tevreden, heel vriendelijk en neemt de tijd voor je. Mijn bruidsjurk was netjes opmaat gemaakt' },
  { naam: 'Çanci A.', wanneer: '11 maanden geleden', tekst: 'Bei kan trouwjurken vermaken als geen ander! … Hij zat echt als gegoten, voelde me net een Disney princes toen hij af was.' },
  { naam: 'Marcel', wanneer: '6 maanden geleden', tekst: 'Ik heb mijn ideeen om de jurk nog mooier te maken ter plekke met Bei kunnen bespreken en na 2 weken kon ik hem ophalen. Mijn droom werd werkelijkheid, hij was nog mooier dan ik had durven denken.' },
  { naam: 'Mariluz', wanneer: 'een jaar geleden', tekst: 'Mijn jurk was heel gedetailleerd en groot en toch heeft ze het jurk zo vermaakt dat het niet uitzag alsof het vermaakt is. … Echt super blij!' },
];

// Concrete feiten over het atelier. Deze staan zichtbaar op de site (sectie "Goed om te weten")
// en in llms.txt, zodat zoekmachines en AI-assistenten ze kunnen overnemen. Alleen wat klopt.
export const kernfeiten = [
  { vraag: 'Wat is Bei Couture?', antwoord: 'Een bruidsatelier en kleermakerij aan de Hoogstraat 89A in Rotterdam. Bei maakt en vermaakt er zelf bruidsjurken, jurken voor de bruidsmoeder, bruidsmeisjes en bruidsjonkers, gala- en avondkleding en gewone kleding op maat.' },
  { vraag: 'Sinds wanneer?', antwoord: 'Bei heeft sinds 1997 een eigen atelier, begonnen op het Marconiplein, en legde zich in 2009 toe op bruidsmode.' },
  { vraag: 'Wie maakt de jurk?', antwoord: 'Bei zelf. Zij voert het gesprek, meet op, knipt en naait. Je werkt dus van begin tot eind met dezelfde persoon.' },
  { vraag: 'Welke stoffen?', antwoord: 'Taft, bruidssatijn, tule en kant, met applicaties, kraaltjes of borduursel waar je ze wilt.' },
  { vraag: 'Hoeveel afspraken?', antwoord: 'Bij een jurk op maat meestal drie, soms vier: schets en maten, de proefjurk, de jurk in de echte stof, en als er nog iets aangepast is een vierde keer om op te halen. Bij vermaakwerk meestal twee.' },
  { vraag: 'Welke talen?', antwoord: 'Nederlands, Engels en Chinees.' },
  { vraag: 'Afspraak nodig?', antwoord: 'Voor bruidsmode wel, zodat de tijd voor jou wordt vrijgehouden. Voor een korte vraag of een kleine vermaking kun je tijdens de openingstijden binnenlopen.' },
  { vraag: 'Buiten de openingstijden?', antwoord: 'Ja. Een afspraak kan al vanaf 9:00 uur, en in overleg ook in de avond of op maandag. Zaterdag is het atelier gesloten.' },
  { vraag: 'Wat kost het?', antwoord: 'Dat hangt af van het model, de stof en het werk. Je hoort de prijs bij de eerste afspraak, voordat er iets gemaakt wordt.' },
  { vraag: 'Beoordeling?', antwoord: '5,0 uit 51 reviews op Google.' },
];

// De werkwijze zoals Bei hem zelf beschrijft (02-11-2026): vier afspraken. Soms is de derde al de laatste.
export const stappen = [
  {
    nr: '01',
    titel: 'Ideeën, schets en maten',
    kort: 'Eerste afspraak: foto\'s bespreken, schets, opmeten, stof kiezen',
    tekst: 'Je neemt foto\'s en ideeën mee en we bespreken ze rustig. Zodra duidelijk is wat je wilt, maakt Bei meteen een schets van het ontwerp en neemt ze je maten op. Ook de stof en het materiaal komen in deze eerste afspraak aan bod: taft, bruidssatijn, tule, kant en eventuele applicaties liggen in het atelier om te voelen.',
    icoon: 'praat',
  },
  {
    nr: '02',
    titel: 'De proefjurk passen',
    kort: 'Tweede afspraak: pasvorm in proefstof, met de echte stof ernaast',
    tekst: 'Bij de tweede afspraak pas je de proefjurk, gemaakt in een proefstof. Zo voel je het model echt om je heen en controleren we de pasvorm: het lijfje, de rok, de lengte op je schoenen. De gekozen stof ligt er meteen naast, zodat je ziet hoe de jurk wordt.',
    icoon: 'meet',
  },
  {
    nr: '03',
    titel: 'Jouw jurk in de echte stof',
    kort: 'Derde afspraak: de jurk in het gekozen materiaal',
    tekst: 'Nu pas je jouw jurk, gemaakt in de stof die je gekozen hebt. Meestal zit hij dan goed en neem je hem mee. Is er nog een kleine aanpassing nodig, dan wordt die afgespeld.',
    icoon: 'naald',
  },
  {
    nr: '04',
    titel: 'Ophalen',
    kort: 'Vierde afspraak, alleen als er nog iets aangepast is',
    tekst: 'Waren er bij de derde afspraak nog kleine aanpassingen, dan pas je de jurk nog één keer en neem je hem helemaal compleet mee. Daarna hangt hij klaar voor je grote dag. Verandert er daarna nog iets aan je maten, dan kun je altijd terugkomen.',
    icoon: 'jurk',
  },
];
