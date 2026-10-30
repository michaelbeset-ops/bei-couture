// Klantervaringen. De citaten staan letterlijk op het Google-profiel van Bei Couture
// (stand 15 oktober 2026, alle vijf sterren). De regel "wat er gedaan is" komt uit diezelfde
// review en is nergens aangevuld. Namen: voornaam plus initiaal, zoals Google ze toont.
// Foto's: eigen beeld uit het atelier van Bei (via WhatsApp aangeleverd, 30-10-2026), ter illustratie
// bij het verhaal. Het zijn niet de jurken van deze klanten zelf; dat staat op de pagina vermeld.
// Trouwfoto's van klanten komen er pas bij met hun toestemming.
import beiBruid from '../assets/e-bei-bruid.jpg';
import sluier from '../assets/e-sluier.jpg';
import lijfjePaspop from '../assets/lijfje-paspop.jpg';
import kantMouwen from '../assets/e-kant-mouwen.jpg';
import zeemeermin from '../assets/e-zeemeermin.jpg';
import kant from '../assets/kant.jpg';
import rugKnoopjes from '../assets/e-rug-knoopjes.jpg';
import roosje from '../assets/e-roosje.jpg';
import sleepKant from '../assets/e-sleep-kant.jpg';
import applicaties from '../assets/applicaties.jpg';
import tuleRok from '../assets/e-tule-rok.jpg';
import chiffon from '../assets/e-chiffon.jpg';
import vRug from '../assets/e-v-rug.jpg';
import corset from '../assets/e-corset.jpg';
import hanger from '../assets/e-hanger.jpg';
import bolero from '../assets/e-bolero.jpg';
import grijsJasje from '../assets/e-grijs-jasje.jpg';

export interface Ervaring {
  naam: string;
  wanneer: string;
  dienst: string;
  slug: string;
  samenvatting: string;
  citaat: string;
  /** Korte kern van de review, als kop boven het verhaal. */
  kern: string;
  foto: ImageMetadata;
  fotoAlt: string;
  pos?: string;
  foto2: ImageMetadata;
  foto2Alt: string;
  pos2?: string;
}

export const ervaringen: Ervaring[] = [
  {
    naam: 'Christina W.',
    wanneer: '4 maanden geleden',
    dienst: 'Trouwjurk en pak vermaakt',
    slug: 'trouwjurk-vermaken',
    kern: 'Alsof je bij familie binnenkomt',
    samenvatting:
      'Christina en haar partner kwamen samen langs. De trouwjurk en het pak zijn allebei in het atelier vermaakt, zodat ze op de dag zelf naast elkaar klopten. Wat ze vooral bijbleef was de sfeer in het atelier.',
    citaat:
      'Wat een topervaring hebben wij gehad bij lieve Bei, een warme vrouw die super mooi onze trouwjurk en pak heeft vermaakt. Het lijkt net alsof je bij een familielid bent zodra je bij Bei binnenkomt. … Dankbaar voor jouw werk Bei, je hebt gouden handen.',
    foto: beiBruid,
    fotoAlt: 'Bei schikt de kanten sleep van een bruid in het atelier',
    pos: '50% 40%',
    foto2: sluier,
    foto2Alt: 'Sluier met kanten rand over de rug van een bruidsjurk',
    pos2: '50% 50%',
  },
  {
    naam: 'Marisela B.',
    wanneer: 'een maand geleden',
    dienst: 'Bruidsjurk op maat gemaakt',
    slug: 'bruidsjurk-op-maat',
    kern: 'Rustig de tijd, en netjes op maat',
    samenvatting:
      'Voor Marisela is de bruidsjurk helemaal op maat gemaakt. Bij elke afspraak werd er rustig de tijd genomen, zodat er onderweg niets overhaast hoefde te worden.',
    citaat: 'Zeer tevreden, heel vriendelijk en neemt de tijd voor je. Mijn bruidsjurk was netjes opmaat gemaakt',
    foto: lijfjePaspop,
    fotoAlt: 'Lijfje met wit kant en pailletten en lange chiffon mouwen op de paspop',
    pos: '50% 35%',
    foto2: kantMouwen,
    foto2Alt: 'Lijfje met kant, hoge hals en lange kanten mouwen, van dichtbij',
    pos2: '50% 40%',
  },
  {
    naam: 'Çanci A.',
    wanneer: '11 maanden geleden',
    dienst: 'Trouwjurk vermaakt',
    slug: 'trouwjurk-vermaken',
    kern: 'Als gegoten',
    samenvatting:
      'Een gekochte trouwjurk die nog niet paste, is in het atelier helemaal naar haar maten gebracht. Op de pasbeurt daarna zat hij als gegoten.',
    citaat:
      'Bei kan trouwjurken vermaken als geen ander! … Hij zat echt als gegoten, voelde me net een Disney princes toen hij af was.',
    foto: zeemeermin,
    fotoAlt: 'Kanten zeemeerminjurk met een rij knoopjes op de rug, in het atelier',
    pos: '50% 40%',
    foto2: kant,
    foto2Alt: 'Detail van een kanten jurk met stoffen knoopjes langs de rug',
    pos2: '55% 50%',
  },
  {
    naam: 'Marcel',
    wanneer: '6 maanden geleden',
    dienst: 'Jurk aangepast naar eigen ideeën',
    slug: 'trouwjurk-vermaken',
    kern: 'Nog mooier dan gedacht',
    samenvatting:
      'De ideeën om de jurk nog mooier te maken zijn ter plekke aan tafel besproken, zodat meteen duidelijk was wat er zou gebeuren. Twee weken later kon de jurk opgehaald worden.',
    citaat:
      'Ik heb mijn ideeen om de jurk nog mooier te maken ter plekke met Bei kunnen bespreken en na 2 weken kon ik hem ophalen. Mijn droom werd werkelijkheid, hij was nog mooier dan ik had durven denken.',
    foto: rugKnoopjes,
    fotoAlt: 'Kanten rug met knoopjes en een tule rok, in het atelier',
    pos: '50% 35%',
    foto2: roosje,
    foto2Alt: 'Handgemaakt roosje van organza op de werktafel',
    pos2: '50% 50%',
  },
  {
    naam: 'Mariluz',
    wanneer: 'een jaar geleden',
    dienst: 'Grote, gedetailleerde jurk vermaakt',
    slug: 'trouwjurk-vermaken',
    kern: 'Niemand ziet dat er iets aan gedaan is',
    samenvatting:
      'Een jurk met veel detail en veel volume is zo vermaakt dat er aan het resultaat niets meer te zien was. Juist bij kant, kraaltjes en lagen stof komt het daarop aan.',
    citaat:
      'Mijn jurk was heel gedetailleerd en groot en toch heeft ze het jurk zo vermaakt dat het niet uitzag alsof het vermaakt is. … Echt super blij!',
    foto: sleepKant,
    fotoAlt: 'Bruid op de rug gezien in het atelier, lange sleep met kanten rand over de vloer',
    pos: '50% 45%',
    foto2: applicaties,
    foto2Alt: 'Gouden kanten applicaties met parels op een lijfje op de paspop',
    pos2: '50% 50%',
  },
];

// Losse beelden uit het atelier voor de fotostrook tussen de verhalen.
export const atelierStrook: { foto: ImageMetadata; alt: string; pos?: string }[] = [
  { foto: tuleRok, alt: 'Kanten rug met knoopjes en een tule rok met kanten zoom', pos: '50% 40%' },
  { foto: chiffon, alt: 'Bruid op de rug in het pashokje, diepe V-rug en soepele sleep', pos: '50% 40%' },
  { foto: corset, alt: 'Satijnen jurk met corsetrug en sleep', pos: '50% 35%' },
  { foto: vRug, alt: 'V-rug met kanten mouwtjes en knoopjes', pos: '50% 35%' },
  { foto: hanger, alt: 'Kanten bruidsjurk aan een hanger in het pashokje', pos: '50% 40%' },
  { foto: bolero, alt: 'Kanten bolero met lange mouwen aan een hanger', pos: '50% 45%' },
  { foto: grijsJasje, alt: 'Grijs kanten jasje met wijde mouwen op een paspop', pos: '50% 40%' },
];
