// Diensten van het atelier. Inhoud komt van Bei zelf (gesprek 27 oktober 2026) en van hun eigen
// teksten uit het webarchief. Geen prijzen en geen levertijden: die verschillen per jurk.
// Eigen foto's van Bei, via WhatsApp aangeleverd op 30-10-2026 (zie src/assets/BRONNEN.txt).
import bruidsjurk from '../assets/bruidsjurk.jpg';
import bruidsjurkRug from '../assets/bruidsjurk-rug.jpg';
import vermaken from '../assets/vermaken.jpg';
import vermakenRug from '../assets/vermaken-rug.jpg';
import bruidsmoeder from '../assets/bruidsmoeder.jpg';
import bruidsmoederDetail from '../assets/bruidsmoeder-detail.jpg';
import bruidsmoederZwart from '../assets/bruidsmoeder-zwart.jpg';
import bruidsmeisje from '../assets/bruidsmeisje.jpg';
import gala from '../assets/gala.jpg';
import galaDetail from '../assets/gala-detail.jpg';
import kantPatroon from '../assets/kant-patroon.jpg';
import lijfjeTafel from '../assets/lijfje-tafel.jpg';
import hero from '../assets/hero.jpg';

export interface Blok {
  kop: string;
  icoon: string;
  tekst?: string[];
  lijst?: string[];
}

export interface Dienst {
  slug: string;
  nav: string;
  kaartTitel: string;
  kaartTekst: string;
  voorWie: string;
  watJeKrijgt: string;
  kies: string;
  wie: 'Bruiden' | 'Klanten';
  img: ImageMetadata;
  pos: string;
  alt: string;
  /** Alleen als de paginakop een andere (grotere) foto nodig heeft dan het kaartje. */
  kopFoto?: ImageMetadata;
  kopPos?: string;
  kopAlt?: string;
  foto2: ImageMetadata;
  foto2Pos: string;
  foto2Alt: string;
  eigenFoto?: boolean;
  h1: string;
  h1Accent: string;
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  intro: string[];
  feiten: string[];
  blokken: Blok[];
  faq: { v: string; a: string }[];
  verwant: string[];
}

export const diensten: Dienst[] = [
  {
    slug: 'bruidsjurk-op-maat',
    nav: 'Bruidsjurk op maat',
    kaartTitel: 'Bruidsjurk op maat',
    kaartTekst: 'Jouw trouwjurk, gemaakt naar jouw ontwerp, jouw kleur en jouw maat. Ook in een kleur of in een grote maat.',
    voorWie: 'Voor de bruid die een jurk wil die nog niet bestaat.',
    watJeKrijgt: 'Schets, maten, proefjurk en de jurk in de echte stof. Ook gekleurd of in een grote maat.',
    kies: 'Bruidsjurk laten maken',
    wie: 'Bruiden',
    img: bruidsjurk,
    pos: '50% 35%',
    alt: 'Kanten lijfje met hoge hals en lange doorschijnende mouwen, gepast in het atelier',
    foto2: bruidsjurkRug,
    foto2Pos: '50% 40%',
    foto2Alt: 'Kanten rug van een bruidsjurk met een rij stoffen knoopjes en doorschijnende mouwen',
    eigenFoto: true,
    h1: 'Bruidsjurk op maat in',
    h1Accent: 'Rotterdam.',
    eyebrow: 'Bruidsjurk op maat',
    title: 'Bruidsjurk op maat laten maken in Rotterdam | Bei Couture',
    description: 'Trouwjurk op maat laten maken in Rotterdam. Ook een gekleurde trouwjurk of een trouwjurk in een grote maat. Bruidsatelier Bei Couture, Hoogstraat 89A.',
    lead: 'Een trouwjurk op maat die precies past, in het model en de kleur die jij voor je ziet. Bei maakt hem van begin tot eind zelf, in haar atelier aan de Hoogstraat.',
    intro: [
      'Je hoeft geen rek met jurken door te passen en te hopen dat er eentje bij zit. Hier begint het bij jouw idee.',
      'Laat een foto zien van een jurk die je mooi vindt, of vertel wat je voor je ziet. Vanaf daar wordt een trouwjurk op maat gemaakt die alleen van jou is.',
      'Bei naait sinds 1997 in haar eigen atelier en legt zich sinds 2009 helemaal toe op bruidsmode. Ze werkt alleen, dus de vrouw met wie je aan tafel zit is ook de vrouw die jouw jurk maakt.',
    ],
    feiten: ['Schets en maten bij de eerste afspraak', 'Stof kies je in het atelier', 'Ook een gekleurde trouwjurk', 'Ook in grote maten'],
    blokken: [
      {
        kop: 'De foto is het beginpunt',
        icoon: 'foto',
        tekst: [
          'De hals open of dicht, mouwtjes erbij, de rug laag, de sleep langer of korter, een andere rok onder hetzelfde lijfje. Het kan allemaal, want de jurk wordt vanaf nul opgebouwd.',
          'Je kiest zelf de stof. Taft, bruidssatijn, tule en kant liggen klaar in het atelier. Applicaties, kraaltjes of borduursel komen precies waar jij ze wilt.',
        ],
      },
      {
        kop: 'Gekleurde trouwjurk',
        icoon: 'jurk',
        tekst: [
          'Niet iedere bruid wil wit of ivoor. Zacht poederroze, champagne, blauw, bordeaux, of kleur alleen in de onderrok of het kant. Omdat de jurk vanaf de stof wordt opgebouwd, is kleur gewoon een keuze.',
        ],
      },
      {
        kop: 'Trouwjurk in grote maat',
        icoon: 'meet',
        tekst: [
          'In de winkel is de keuze in grote maten klein, en wat er hangt moet vaak alsnog flink vermaakt worden. Op maat werkt andersom: er wordt gemeten aan jouw lijf en het patroon wordt daaromheen gebouwd, met steun waar het lijfje dat nodig heeft.',
        ],
      },
      {
        kop: 'Goed om te weten',
        icoon: 'kalender',
        lijst: [
          'Kom op tijd. Er zijn drie tot vier afspraken nodig en die wil je niet samenpersen.',
          'Neem je trouwschoenen mee naar de pasbeurten, want die bepalen de lengte.',
          'Neem gerust je moeder, zus of getuige mee. Een tweede paar ogen helpt.',
          'Foto\'s van wat je mooi vindt, en van wat je juist niet wilt, zijn welkom.',
        ],
      },
    ],
    faq: [
      { v: 'Kan ik een trouwjurk laten maken naar een foto?', a: 'Ja. Een foto van een jurk die je mooi vindt is het handigste beginpunt. Tijdens de afspraak bespreken we wat je precies van die jurk aanspreekt en wat je anders wilt. De jurk wordt daarna naar jouw maten gemaakt, dus het hoeft geen kopie te worden.' },
      { v: 'Wat kost een bruidsjurk op maat?', a: 'Dat hangt af van het model, de stof en het werk. Je hoort de prijs bij de eerste afspraak, voordat er iets gemaakt wordt. Zo weet je waar je aan toe bent.' },
      { v: 'Moet ik al weten wat ik wil?', a: 'Nee. Een foto van een jurk die je mooi vindt is handig, maar een kleur, een gevoel of alleen "geen kant" is ook genoeg. In het eerste gesprek wordt het samen duidelijk.' },
      { v: 'Maken jullie ook een gekleurde trouwjurk?', a: 'Ja. Omdat elke jurk vanaf de stof wordt opgebouwd, is elke kleur mogelijk. Van ivoor en champagne tot poederroze, blauw of bordeaux, of kleur alleen in de onderrok of het kant.' },
      { v: 'Ik heb een grote maat, kan dat ook?', a: 'Zeker. Er wordt gemeten aan jouw lijf en het patroon wordt daar omheen gemaakt, dus er is geen standaardmaat waar je in moet passen. Bei denkt mee over pasvorm en steun zodat de jurk de hele dag goed blijft zitten.' },
      { v: 'Hoeveel afspraken zijn er?', a: 'Meestal drie, soms vier. Bij de eerste afspraak bespreek je je ideeën, maakt Bei een schets en neemt ze je maten op. Daarna pas je de proefjurk, en bij de derde afspraak jouw jurk in de echte stof. Is er dan nog een kleine aanpassing nodig, dan haal je hem de vierde keer op.' },
    ],
    verwant: ['trouwjurk-vermaken', 'bruidsmeisjes-en-bruidsjonkers', 'bruidsmoeder-jurk'],
  },
  {
    slug: 'trouwjurk-vermaken',
    nav: 'Trouwjurk vermaken',
    kaartTitel: 'Trouwjurk vermaken',
    kaartTekst: 'Je eigen jurk korter, passender of helemaal anders. Ook de jurk van je moeder of van een eerdere trouwdag.',
    voorWie: 'Voor een gekochte jurk, of de jurk van je moeder.',
    watJeKrijgt: 'Innemen, inkorten, uitleggen, bandjes of mouwen. Meestal twee pasbeurten, soms een derde.',
    kies: 'Trouwjurk laten vermaken',
    wie: 'Bruiden',
    img: vermaken,
    pos: '50% 45%',
    alt: 'Bei past een bruidsjurk met lange tule sleep, de bruid op de rug gezien',
    foto2: vermakenRug,
    foto2Pos: '50% 35%',
    foto2Alt: 'Bei bekijkt de open kanten rug van een zeemeerminjurk',
    eigenFoto: true,
    h1: 'Trouwjurk vermaken in',
    h1Accent: 'Rotterdam.',
    eyebrow: 'Trouwjurk vermaken',
    title: 'Trouwjurk vermaken Rotterdam | Bruidsatelier Bei Couture',
    description: 'Trouwjurk of bruidsjurk laten vermaken in Rotterdam: innemen, uitleggen, inkorten of opnieuw passend maken. Bruidsatelier Bei Couture, Hoogstraat 89A.',
    lead: 'Je jurk is bijna goed, maar nog niet helemaal van jou. In het atelier wordt hij ingenomen, uitgelegd of ingekort tot hij zit alsof hij voor jou gemaakt is.',
    intro: [
      'Een jurk uit de winkel is gemaakt op een standaardmaat, en vrijwel niemand heeft die maat precies. Je bruidsjurk laten vermaken is daarom geen noodgreep, maar de normale laatste stap.',
      'Juist die stap bepaalt of een jurk er duur uitziet of niet. Bei vermaakt al jaren bruidsjurken. Bruiden zeggen vaak dat niemand meer ziet dat er iets aan gedaan is, en dat is precies de bedoeling.',
    ],
    feiten: ['Meestal twee pasbeurten', 'Niemand ziet het', 'Ook de jurk van je moeder', 'Ook het hele gezelschap'],
    blokken: [
      {
        kop: 'Trouwjurk laten innemen, inkorten of aanpassen',
        icoon: 'schaar',
        lijst: [
          'Je trouwjurk laten innemen of uitleggen in taille, heup, lijfje of cup',
          'Inkorten op de lengte van jouw trouwschoenen',
          'Bandjes, mouwen of een bolero toevoegen of juist weghalen',
          'De rug of hals aanpassen, bijvoorbeeld hoger of juist opener',
          'Een sleep inkorten of een ophaalsysteem voor het feest erin zetten',
          'Steun en cups inzetten zodat je geen beha nodig hebt',
          'Kant, applicaties of kraaltjes bijwerken na het aanpassen',
        ],
      },
      {
        kop: 'De jurk van je moeder',
        icoon: 'hart',
        tekst: [
          'Trouw je voor de tweede keer, of wil je de jurk van je moeder dragen, dan hoeft die niet te blijven zoals hij is. Mouwen eraf, een andere hals, de rok smaller, of alleen het kant bewaren en er een nieuw lijfje onder bouwen.',
          'Zulke jurken hebben een verhaal. We bespreken eerst goed wat je wel en vooral niet wilt veranderen, en pas dan wordt er geknipt.',
        ],
      },
      {
        kop: 'Ook voor je gezelschap',
        icoon: 'jurk',
        tekst: [
          'De jurk van de bruidsmoeder en de jurkjes van de bruidsmeisjes en bruidsjonkers kunnen in dezelfde ronde mee. Dan sluit alles op elkaar aan en loop je op de dag zelf niet met een te lange zoom.',
        ],
      },
    ],
    faq: [
      { v: 'Hoe lang van tevoren moet ik langskomen om mijn trouwjurk te laten vermaken?', a: 'Hoe eerder hoe rustiger. Voor vermaken zijn meestal twee pasbeurten nodig, soms een derde. Zit je krap in de tijd, bel of app dan even. Er wordt altijd eerlijk gezegd of het nog haalbaar is.' },
      { v: 'Wat kost het vermaken van een trouwjurk?', a: 'Dat hangt af van wat er aan de jurk moet gebeuren. Bij de eerste afspraak kijkt Bei in de jurk en hoor je de prijs, voordat er iets aan gedaan wordt.' },
      { v: 'Neem ik mijn schoenen mee?', a: 'Ja, graag. De lengte van de jurk wordt bepaald door de schoenen die je op je trouwdag draagt. Heb je ze nog niet, neem dan schoenen mee met een vergelijkbare hak.' },
      { v: 'Kan een jurk ook uitgelegd worden?', a: 'Vaak wel. Hoeveel ruimte er is, hangt af van de naden en de stof. Bij de eerste afspraak kijkt Bei in de jurk en vertelt ze meteen wat er mogelijk is.' },
      { v: 'Kan de trouwjurk van mijn moeder aangepast worden?', a: 'Ja. Een oudere jurk kan ingenomen, ingekort en gemoderniseerd worden, en soms wordt alleen het kant of het borduursel bewaard en de rest nieuw gemaakt. We bespreken van tevoren precies wat er wel en niet verandert.' },
    ],
    verwant: ['bruidsjurk-op-maat', 'kleding-op-maat', 'bruidsmoeder-jurk'],
  },
  {
    slug: 'bruidsmoeder-jurk',
    nav: 'Bruidsmoeder',
    kaartTitel: 'Jurk voor de bruidsmoeder',
    kaartTekst: 'Moeder van de bruid of van de bruidegom. Een jurk die klopt bij de bruidsjurk en waarin je je de hele dag prettig voelt.',
    voorWie: 'Voor de moeder van de bruid of de bruidegom.',
    watJeKrijgt: 'Op maat gemaakt of aangepast, afgestemd op de kleur van de bruidsjurk.',
    kies: 'Jurk voor de bruidsmoeder',
    wie: 'Bruiden',
    img: bruidsmoeder,
    pos: '50% 38%',
    alt: 'Blauwgrijze jurk met wit lijfje, kanten band en bijpassend jasje',
    kopFoto: bruidsmoederZwart,
    kopPos: '50% 30%',
    kopAlt: 'Zwarte lange jurk met wit borduursel en fladdermouwtjes, gepast in het atelier',
    foto2: bruidsmoederDetail,
    foto2Pos: '50% 45%',
    foto2Alt: 'Gouden applicaties met parels en spelden op een champagnekleurig lijfje op de paspop',
    eigenFoto: true,
    h1: 'Jurk voor de bruidsmoeder in',
    h1Accent: 'Rotterdam.',
    eyebrow: 'Moeder van de bruid of bruidegom',
    title: 'Bruidsmoeder jurk op maat in Rotterdam | Bei Couture',
    description: 'Jurk voor de moeder van de bruid of bruidegom, op maat gemaakt of vermaakt in Rotterdam, afgestemd op de bruidsjurk. Bei Couture, Hoogstraat 89A.',
    lead: 'Als moeder van de bruid sta je de hele dag op de foto. Dan wil je een jurk die bij de bruid past, bij jou past en waarin je kunt zitten en dansen zonder er steeds aan te trekken.',
    intro: [
      'Bruidsmoeders lopen vaak tegen hetzelfde aan. In de winkel is het te jong, te saai, of de kleur klopt net niet bij de jurk van de bruid. En wat wel mooi is, zit zelden meteen goed.',
      'In het atelier draai je dat om. Je begint bij de kleur van de bruiloft en bij wat jij prettig draagt. Daar wordt een jurk omheen gemaakt, of een gekochte jurk op aangepast.',
    ],
    feiten: ['Afgestemd op de bruidsjurk', 'Op maat of vermaakt', 'Ook de moeder van de bruidegom', 'Elke kleur, elke maat'],
    blokken: [
      {
        kop: 'Afgestemd op de bruid',
        icoon: 'hart',
        tekst: [
          'Neem een foto van de bruidsjurk mee, of kom samen met je dochter. Dan leggen we kleur, stof en lengte naast elkaar, zodat jullie op de foto\'s bij elkaar passen.',
          'Ook de moeder van de bruidegom is welkom. Beide moeders in hetzelfde atelier gebeurt vaak, dan weet je zeker dat de twee jurken naast elkaar kloppen.',
        ],
      },
      {
        kop: 'Bedekt waar jij dat wilt',
        icoon: 'jurk',
        lijst: [
          'Mouwtjes, een cape of een bijpassend jasje voor je bovenarmen',
          'Een lijfje met steun, zodat je zelf niets hoeft te corrigeren',
          'Een rok die mooi valt als je zit, niet alleen als je staat',
          'Een lengte die werkt op jouw schoenen, ook op het gras',
          'Elke kleur, ook de kleuren die in de winkel zelden te vinden zijn',
        ],
      },
      {
        kop: 'Op maat of vermaakt',
        icoon: 'naald',
        tekst: [
          'Heb je al een jurk gekocht die bijna goed is, dan kan die aangepast worden. Wil je liever iets dat er nog niet is, dan wordt hij gemaakt. Bij de eerste afspraak hoor je welke weg voor jou de verstandigste is.',
        ],
      },
    ],
    faq: [
      { v: 'Welke kleur draag ik als bruidsmoeder?', a: 'Dat is helemaal vrij, zolang je niet in het wit of ivoor verschijnt. Het werkt het prettigst om een kleur te kiezen die aansluit bij het kleurenpalet van de bruiloft. Neem een foto van de bruidsjurk en van de bloemen mee, dan leggen we de stoffen ernaast.' },
      { v: 'Wat kost een bruidsmoederjurk op maat?', a: 'Dat hangt af van het model, de stof en of er een bestaande jurk wordt aangepast of een nieuwe gemaakt. Je hoort de prijs bij de eerste afspraak, voordat er iets gebeurt.' },
      { v: 'Kunnen beide moeders bij jullie terecht?', a: 'Ja, dat gebeurt vaak. Het voordeel is dat de twee jurken dan op elkaar afgestemd worden in kleur, lengte en stijl.' },
      { v: 'Ik wil mijn bovenarmen bedekken, kan dat mooi?', a: 'Zeker. Mouwtjes, een cape, een los jasje of een laagje tule over de arm kan allemaal, en het wordt zo ontworpen dat het bij de rest van de jurk hoort in plaats van er los overheen te hangen.' },
    ],
    verwant: ['gala-en-avondkleding', 'bruidsjurk-op-maat', 'trouwjurk-vermaken'],
  },
  {
    slug: 'bruidsmeisjes-en-bruidsjonkers',
    nav: 'Bruidsmeisjes',
    kaartTitel: 'Bruidsmeisjes en bruidsjonkers',
    kaartTekst: 'Jurkjes voor de bruidsmeisjes en kleding voor de bruidsjonkers, in één lijn met jouw jurk.',
    voorWie: 'Voor de meisjes en jongens naast de bruid.',
    watJeKrijgt: 'Jurkjes en kleding in één lijn met jouw jurk, elk op eigen maat.',
    kies: 'Bruidsmeisjes of bruidsjonkers',
    wie: 'Bruiden',
    img: bruidsmeisje,
    pos: '50% 42%',
    alt: 'Roze glitter-tule jurkje voor een bruidsmeisje aan een hanger tussen de bruidsjurken',
    foto2: hero,
    foto2Pos: '62% 40%',
    foto2Alt: 'Een bruid wordt in haar kanten trouwjurk geholpen',
    h1: 'Bruidsmeisjesjurken en bruidsjonkers in',
    h1Accent: 'Rotterdam.',
    eyebrow: 'Bruidsmeisjesjurk op maat',
    title: 'Bruidsmeisjesjurk op maat in Rotterdam | Bei Couture',
    description: 'Bruidsmeisjesjurken en kleding voor bruidsjonkers op maat in Rotterdam, afgestemd op de bruidsjurk. Bruidsatelier Bei Couture, Hoogstraat 89A.',
    lead: 'Je bruidsmeisjes en bruidsjonkers staan de hele dag naast je. Hun jurkjes en kleding worden afgestemd op jouw jurk, in dezelfde kleur, stof of details.',
    intro: [
      'Bruidsmeisjes hebben zelden dezelfde maat en zelden dezelfde smaak. Online een set jurken bestellen levert dan een stapel teleurstellingen op: de een vindt het te kort, de ander zit klem in de taille en de kleur blijkt in het echt anders dan op de foto.',
      'In het atelier wordt iedereen apart opgemeten, ook de bruidsjonkers. Alles komt uit hetzelfde ontwerp, zodat de groep bij elkaar hoort.',
    ],
    feiten: ['Elk op eigen maat', 'Eén lijn met jouw jurk', 'Ook voor kinderen', 'Gekochte jurkjes vermaken kan ook'],
    blokken: [
      {
        kop: 'Eén lijn, elk op eigen maat',
        icoon: 'jurk',
        tekst: [
          'Hetzelfde model staat niet iedereen even goed. Daarom mag het model per meisje verschillen, terwijl stof, kleur en details gelijk blijven. De een draagt bandjes, de ander mouwtjes, en op de foto is het toch één geheel.',
          'Dat geldt ook voor kinderen. Een jurkje voor een klein bruidsmeisje mag mooi zijn en tegelijk iets waarin gespeeld en gerend kan worden.',
        ],
      },
      {
        kop: 'Kleding voor bruidsjonkers',
        icoon: 'naald',
        tekst: [
          'Voor de bruidsjonkers, ook wel bruidsjongens genoemd, kan de kleding gemaakt of aangepast worden in dezelfde kleurlijn. Bijvoorbeeld met een vestje, een strik of een band in de stof van de bruidsmeisjesjurken. Zo loopt de stijl door het hele gezelschap.',
        ],
      },
      {
        kop: 'Goed om te weten',
        icoon: 'kalender',
        lijst: [
          'Kom bij voorkeur samen langs, dan kunnen de kleuren naast elkaar beoordeeld worden.',
          'Bij kinderen wordt er ruimte ingebouwd, want ze groeien tussen de pasbeurten door.',
          'Al gekochte jurkjes kunnen ook gewoon vermaakt worden, dat hoeft niet nieuw.',
          'Plan dit samen met je eigen pasbeurten in, dat scheelt afspraken.',
        ],
      },
    ],
    faq: [
      { v: 'Kunnen bruidsmeisjes verschillende modellen dragen?', a: 'Ja, en dat werkt vaak zelfs mooier. Door de stof, de kleur en de details gelijk te houden en het model per persoon aan te passen, staat het iedereen goed en blijft het één geheel.' },
      { v: 'Wat kosten bruidsmeisjesjurken op maat?', a: 'Dat hangt af van het aantal jurkjes, het model en de stof. Je hoort de prijs bij de eerste afspraak, voordat er iets gemaakt wordt.' },
      { v: 'Maken jullie ook jurkjes voor kinderen?', a: 'Ja. Voor kleine bruidsmeisjes wordt er ruimte in het jurkje gelaten, omdat kinderen tussen de pasbeurten door groeien, en er wordt gekozen voor stoffen waarin ze zich kunnen bewegen.' },
      { v: 'Wij hebben de jurkjes al gekocht, kunnen die vermaakt worden?', a: 'Dat kan. Innemen, inkorten en bandjes of mouwtjes aanpassen zijn allemaal mogelijk, zodat de jurkjes alsnog goed zitten.' },
    ],
    verwant: ['bruidsjurk-op-maat', 'bruidsmoeder-jurk', 'trouwjurk-vermaken'],
  },
  {
    slug: 'gala-en-avondkleding',
    nav: 'Gala en avond',
    kaartTitel: 'Gala- en avondkleding',
    kaartTekst: 'Een galajurk of avondjurk die alleen jij hebt, in jouw kleur en op jouw maat.',
    voorWie: 'Voor een gala, feest of jubileum.',
    watJeKrijgt: 'Een jurk die alleen jij hebt, of een gekochte jurk passend gemaakt.',
    kies: 'Gala- of avondkleding',
    wie: 'Klanten',
    img: gala,
    pos: '50% 50%',
    alt: 'Rode kanten avondjurk met lange sleep, gepast in het atelier',
    foto2: galaDetail,
    foto2Pos: '50% 40%',
    foto2Alt: 'Rug op de paspop met een gouden kanten applicatie over één schouder',
    eigenFoto: true,
    h1: 'Galajurk of avondjurk op maat in',
    h1Accent: 'Rotterdam.',
    eyebrow: 'Gala en avond',
    title: 'Galajurk op maat laten maken in Rotterdam | Bei Couture',
    description: 'Galajurk of avondjurk op maat laten maken of vermaken in Rotterdam. Bruidsatelier Bei Couture, Hoogstraat 89A. Afspraken kunnen al vanaf 9:00 uur.',
    lead: 'Voor een gala, een jubileum of een feest waar je er echt wilt staan. Een jurk die niemand anders heeft, in jouw kleur en op jouw maat.',
    intro: [
      'Niet elke mooie avond is een bruiloft. Bei maakt ook galajurken en avondjurken, met dezelfde aandacht als voor bruidsmode: opgemeten, gepast en afgewerkt tot het klopt.',
      'Dat kan een lange jurk zijn in zware stof, iets korters met beweging, of een jurk die je later met een andere ceintuur of een ander jasje opnieuw kunt dragen.',
    ],
    feiten: ['Galajurk of avondjurk', 'In jouw kleur en maat', 'Gekochte jurk passend maken', 'Stoffen voel je in het atelier'],
    blokken: [
      {
        kop: 'Waarvoor je komt',
        icoon: 'ster',
        lijst: [
          'Galajurk voor een eindexamengala of een studentengala',
          'Avondjurk voor een feest, een jubileum of een gala-avond',
          'Een jurk voor een huwelijksjubileum of een doopfeest',
          'Een bestaande feestjurk die ingenomen of ingekort moet worden',
          'Een tweede jurk voor het avondfeest, naast je trouwjurk',
        ],
      },
      {
        kop: 'Stof maakt het verschil',
        icoon: 'naald',
        tekst: [
          'Satijn valt zwaar en glanst, tule geeft volume, taft houdt zijn vorm en kant geeft richting aan het ontwerp. Tijdens de afspraak voel je de stoffen en houd je ze bij je gezicht. Een kleur die op een schermpje mooi is, is dat op jouw huid niet altijd.',
        ],
      },
      {
        kop: 'Galajurk vermaken',
        icoon: 'schaar',
        tekst: [
          'Een galajurk die je online hebt besteld zit bijna nooit meteen goed. Innemen, inkorten, bandjes verzetten of cups inzetten maakt vaak in één pasbeurt het verschil.',
        ],
      },
    ],
    faq: [
      { v: 'Hoe lang van tevoren moet ik een galajurk laten maken?', a: 'Reken op meerdere pasafspraken en houd daar ruim de tijd voor. Is je gala al snel, bel of app dan even, dan hoor je meteen of het nog lukt of dat vermaken van een bestaande jurk slimmer is.' },
      { v: 'Wat kost een galajurk op maat?', a: 'Dat hangt af van het model, de stof en het werk. Je hoort de prijs bij de eerste afspraak, voordat er iets gemaakt wordt.' },
      { v: 'Kan ik een galajurk laten vermaken?', a: 'Ja. Innemen, inkorten, bandjes verzetten en steun inzetten kan allemaal, ook bij jurken die je online hebt gekocht.' },
      { v: 'Maken jullie ook een tweede jurk voor het avondfeest?', a: 'Dat kan. Sommige bruiden willen voor het feest iets korters of makkelijkers, in dezelfde sfeer als de trouwjurk. Dat wordt dan in dezelfde lijn ontworpen.' },
    ],
    verwant: ['bruidsmoeder-jurk', 'bruidsjurk-op-maat', 'kleding-op-maat'],
  },
  {
    slug: 'kleding-op-maat',
    nav: 'Kleding op maat',
    kaartTitel: 'Kleding op maat en vermaken',
    kaartTekst: 'Ook buiten de bruidsmode. Eigen kleding op maat gemaakt, of je favoriete stuk weer passend.',
    voorWie: 'Voor alles buiten de bruidsmode.',
    watJeKrijgt: 'Jurken, rokken, blouses en jassen op maat; vermaken en herstellen.',
    kies: 'Kleding op maat of vermaken',
    wie: 'Klanten',
    img: kantPatroon,
    pos: '50% 50%',
    alt: 'Kant met pailletten op een papieren patroon, met een schaar ernaast',
    foto2: lijfjeTafel,
    foto2Pos: '50% 45%',
    foto2Alt: 'Geplisseerd lijfje in wording op de werktafel naast een patroonkaart',
    eigenFoto: true,
    h1: 'Kleermaker in Rotterdam voor kleding op maat en',
    h1Accent: 'vermaken.',
    eyebrow: 'Kleding op maat en vermaken',
    title: 'Kleermaker in Rotterdam: kleding op maat | Bei Couture',
    description: 'Kleermaker in Rotterdam voor kleding op maat en vermaakwerk: jurken, rokken, blouses en jassen, innemen, inkorten en herstellen. Bei Couture, Hoogstraat 89A.',
    lead: 'Bei is kleermaker. Naast bruidsmode maakt en vermaakt ze gewone kleding, voor vrouwen die iets willen dat echt past.',
    intro: [
      'Sommige kledingstukken vind je nergens goed. Een rok die altijd te kort of te lang is, een jurk in precies die ene kleur, een blouse die op jouw schouders klopt. Dat kan hier gemaakt worden.',
      'En er is kleding waar je aan gehecht bent en die net niet meer zit. Die hoef je niet weg te doen.',
    ],
    feiten: ['Kleermaker sinds 1997', 'Op maat of vermaakt', 'Ook kleine reparaties', 'Loop binnen tijdens de openingstijden'],
    blokken: [
      {
        kop: 'Kleding op maat',
        icoon: 'naald',
        lijst: [
          'Jurken, rokken, blouses en pantalons naar jouw ontwerp',
          'Een mantel of jas, afgestemd op jouw lengte en schouders',
          'Kleding in een maat die in de winkel nauwelijks te vinden is',
          'Een kledingstuk nagemaakt dat je versleten hebt en niet meer kunt kopen',
        ],
      },
      {
        kop: 'Kleding vermaken en herstellen',
        icoon: 'schaar',
        lijst: [
          'Innemen en uitleggen in taille, heup, cup of schouder',
          'Inkorten van rokken, jurken, mouwen en broekspijpen',
          'Ritsen, voeringen en gescheurde naden vervangen',
          'Een kledingstuk aanpassen na een verandering in je maten',
        ],
      },
      {
        kop: 'Carnaval, turnpakjes en kostuums',
        icoon: 'ster',
        tekst: [
          'Het atelier maakt ook carnavalskleding, turnpakjes en kostuums. Juist dat werk vraagt om maatwerk, omdat het moet rekken, zitten en meebewegen.',
        ],
      },
    ],
    faq: [
      { v: 'Maakt Bei Couture ook gewone kleding, dus geen bruidsmode?', a: 'Ja. Bei is kleermaker en maakt en vermaakt ook alledaagse kleding, van rokken en jurken tot jassen. Bruidsmode is haar specialisme, maar niet het enige wat ze doet.' },
      { v: 'Wat kost kleding op maat of vermaken?', a: 'Dat hangt af van het kledingstuk en het werk. Je hoort de prijs bij de eerste afspraak of nadat Bei het kledingstuk heeft gezien, voordat er iets gebeurt.' },
      { v: 'Kan ik een kledingstuk laten namaken?', a: 'Vaak wel. Breng het kledingstuk mee naar de afspraak, dan kijkt Bei hoe het in elkaar zit en welke stof erbij past.' },
      { v: 'Doen jullie ook kleine reparaties?', a: 'Ja, zoals ritsen vervangen, voeringen herstellen, naden en zomen. Loop even binnen tijdens de openingstijden of app een foto, dan hoor je wat er mogelijk is.' },
    ],
    verwant: ['trouwjurk-vermaken', 'gala-en-avondkleding', 'bruidsjurk-op-maat'],
  },
];

export const dienstOp = (slug: string) => diensten.find((d) => d.slug === slug)!;
