// Feiten (bekeken 15 oktober 2026), bronnen in bron/:
// - Google-profiel "Bei Couture" (bron/google/place.json, uren.txt): Kleermaker, Hoogstraat 89A, 3011 PJ Rotterdam,
//   "Gevestigd in: Estay Concept & Design", 06 53612543, 5,0 uit 51 reviews.
//   Open di t/m vr 11:00-17:00, zo 12:00-17:00, ma en za gesloten. Nieuwste review "een maand geleden", eigenaar reageert op elke review.
// - Eigen site beicouture.nl geeft nu een PHP/WordPress-fout (bron/web/beicouture-390.png en -1440.png).
//   Teksten uit het webarchief (bron/archief, april en juni 2026): "Uw droom wordt werkelijkheid in ons atelier",
//   "Mijn naam is Bei", atelier sinds 1997 (Marconiplein), sinds 2009 gespecialiseerd in bruidsmode,
//   bruidsjurken, gala- en avondkleding, herenpakken, carnavalskleding, turnpakken; werkwijze met taft, bruidssatijn of tule.
// - Instagram @beicouture (bron/social): laatste post november 2020, niet gelinkt als actief kanaal.
// - Geen KvK-nummer gezien: niet getoond. Geen prijzen (oude "vanaf € 500" uit 2019 is tijdgebonden).
export const site = {
  naam: 'Bei Couture',
  eigenaar: 'Bei',
  plaats: 'Rotterdam',
  straat: 'Hoogstraat 89A',
  postcode: '3011 PJ',
  inPand: 'Estay Concept & Design',
  tel: '06 53 61 25 43',
  telHref: 'tel:+31653612543',
  wa: 'https://wa.me/31653612543',
  mail: 'info@beicouture.nl',
  route: 'https://www.google.com/maps/dir/?api=1&destination=Hoogstraat+89A%2C+3011+PJ+Rotterdam',
  reviews: 'https://www.google.com/maps/place/Bei+Couture/@51.922307,4.4914026,17z/data=!4m6!3m5!1s0x47c4335ec636a273:0xd37342ba58cbe407!8m2!3d51.922307!4d4.4914026!16s%2Fg%2F11b67bk6v8',
  google: { score: '5,0', aantal: 51 },
  // 0 = zondag ... 6 = zaterdag; null = gesloten
  tijden: [[12, 17], null, [11, 17], [11, 17], [11, 17], [11, 17], null] as ([number, number] | null)[],
  themeColor: '#1b1716',
  voorstel: import.meta.env.PUBLIC_VOORSTEL === '1',
};

export const dagen = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

// Letterlijk van Google (alle 5 sterren, in het Nederlands geschreven). Naam: voornaam + initiaal. "…" = ingekort.
export const reviews = [
  { naam: 'Christina W.', wanneer: '4 maanden geleden', tekst: 'Wat een topervaring hebben wij gehad bij lieve Bei, een warme vrouw die super mooi onze trouwjurk en pak heeft vermaakt. Het lijkt net alsof je bij een familielid bent zodra je bij Bei binnenkomt. … Dankbaar voor jouw werk Bei, je hebt gouden handen.' },
  { naam: 'Marisela B.', wanneer: 'een maand geleden', tekst: 'Zeer tevreden, heel vriendelijk en neemt de tijd voor je. Mijn bruidsjurk was netjes opmaat gemaakt' },
  { naam: 'Çanci A.', wanneer: '11 maanden geleden', tekst: 'Bei kan trouwjurken vermaken als geen ander! … Hij zat echt als gegoten, voelde me net een Disney princes toen hij af was.' },
  { naam: 'Marcel', wanneer: '6 maanden geleden', tekst: 'Ik heb mijn ideeen om de jurk nog mooier te maken ter plekke met Bei kunnen bespreken en na 2 weken kon ik hem ophalen. Mijn droom werd werkelijkheid, hij was nog mooier dan ik had durven denken.' },
  { naam: 'Mariluz', wanneer: 'een jaar geleden', tekst: 'Mijn jurk was heel gedetailleerd en groot en toch heeft ze het jurk zo vermaakt dat het niet uitzag alsof het vermaakt is. … Echt super blij!' },
];

export const url = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
export const waMet = (tekst: string) => `${site.wa}?text=${encodeURIComponent(tekst)}`;
export const waHoi = waMet('Hallo Bei, ik wil graag een afspraak maken in het atelier.');
