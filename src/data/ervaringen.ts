// Klantervaringen. De citaten staan letterlijk op het Google-profiel van Bei Couture
// (stand 15 oktober 2026, alle vijf sterren). De regel "wat er gedaan is" komt uit diezelfde
// review en is nergens aangevuld. Namen: voornaam plus initiaal, zoals Google ze toont.
// Foto's: alleen eigen beeld van het atelier. Zodra klanten hun eigen trouwfoto's aanleveren,
// kan `foto` per verhaal gevuld worden.
import kant from '../assets/kant.jpg';
import bei from '../assets/bei-atelier.jpg';
import applicaties from '../assets/applicaties.jpg';

export interface Ervaring {
  naam: string;
  wanneer: string;
  dienst: string;
  slug: string;
  samenvatting: string;
  citaat: string;
  foto?: ImageMetadata;
  fotoAlt?: string;
  pos?: string;
}

export const ervaringen: Ervaring[] = [
  {
    naam: 'Christina W.',
    wanneer: '4 maanden geleden',
    dienst: 'Trouwjurk en pak vermaakt',
    slug: 'trouwjurk-vermaken',
    samenvatting:
      'Christina en haar partner kwamen samen langs. De trouwjurk en het pak zijn allebei in het atelier vermaakt, zodat ze op de dag zelf naast elkaar klopten. Wat ze vooral bijbleef was de sfeer in het atelier.',
    citaat:
      'Wat een topervaring hebben wij gehad bij lieve Bei, een warme vrouw die super mooi onze trouwjurk en pak heeft vermaakt. Het lijkt net alsof je bij een familielid bent zodra je bij Bei binnenkomt. … Dankbaar voor jouw werk Bei, je hebt gouden handen.',
    foto: bei,
    fotoAlt: 'Bei schikt geplooide stof op de paspop in haar atelier',
    pos: '50% 35%',
  },
  {
    naam: 'Marisela B.',
    wanneer: 'een maand geleden',
    dienst: 'Bruidsjurk op maat gemaakt',
    slug: 'bruidsjurk-op-maat',
    samenvatting:
      'Voor Marisela is de bruidsjurk helemaal op maat gemaakt. Bij elke afspraak werd er rustig de tijd genomen, zodat er onderweg niets overhaast hoefde te worden.',
    citaat: 'Zeer tevreden, heel vriendelijk en neemt de tijd voor je. Mijn bruidsjurk was netjes opmaat gemaakt',
  },
  {
    naam: 'Çanci A.',
    wanneer: '11 maanden geleden',
    dienst: 'Trouwjurk vermaakt',
    slug: 'trouwjurk-vermaken',
    samenvatting:
      'Een gekochte trouwjurk die nog niet paste, is in het atelier helemaal naar haar maten gebracht. Op de pasbeurt daarna zat hij als gegoten.',
    citaat:
      'Bei kan trouwjurken vermaken als geen ander! … Hij zat echt als gegoten, voelde me net een Disney princes toen hij af was.',
    foto: kant,
    fotoAlt: 'Detail van een kanten jurk met stoffen knoopjes langs de rug',
    pos: '55% 50%',
  },
  {
    naam: 'Marcel',
    wanneer: '6 maanden geleden',
    dienst: 'Jurk aangepast naar eigen ideeën',
    slug: 'trouwjurk-vermaken',
    samenvatting:
      'De ideeën om de jurk nog mooier te maken zijn ter plekke aan tafel besproken, zodat meteen duidelijk was wat er zou gebeuren. Twee weken later kon de jurk opgehaald worden.',
    citaat:
      'Ik heb mijn ideeen om de jurk nog mooier te maken ter plekke met Bei kunnen bespreken en na 2 weken kon ik hem ophalen. Mijn droom werd werkelijkheid, hij was nog mooier dan ik had durven denken.',
  },
  {
    naam: 'Mariluz',
    wanneer: 'een jaar geleden',
    dienst: 'Grote, gedetailleerde jurk vermaakt',
    slug: 'trouwjurk-vermaken',
    samenvatting:
      'Een jurk met veel detail en veel volume is zo vermaakt dat er aan het resultaat niets meer te zien was. Juist bij kant, kraaltjes en lagen stof komt het daarop aan.',
    citaat:
      'Mijn jurk was heel gedetailleerd en groot en toch heeft ze het jurk zo vermaakt dat het niet uitzag alsof het vermaakt is. … Echt super blij!',
    foto: applicaties,
    fotoAlt: 'Gouden kanten applicaties met parels op een lijfje op de paspop',
    pos: '50% 50%',
  },
];
