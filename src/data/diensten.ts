// Diensten van het atelier. Inhoud komt van Bei zelf (gesprek 27 oktober 2026) en van hun eigen
// teksten uit het webarchief. Geen prijzen en geen levertijden: die verschillen per jurk.
import sMaken from '../assets/s-maken.jpg';
import sVermaken from '../assets/s-vermaken.jpg';
import sGala from '../assets/s-gala.jpg';
import sMeisjes from '../assets/s-bruidsmeisjes.jpg';
import sAtelier from '../assets/s-meer.jpg';
import satijn from '../assets/satijn.jpg';

export interface Blok {
  kop: string;
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
  img: ImageMetadata;
  pos: string;
  alt: string;
  eigenFoto?: boolean;
  h1: string;
  h1Accent: string;
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  intro: string[];
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
    watJeKrijgt: 'Ontwerp, patroon, stof en drie pasbeurten. Ook gekleurd of in een grote maat.',
    kies: 'Bruidsjurk laten maken',
    img: sMaken,
    pos: '50% 40%',
    alt: 'Kanten lijfje van een bruidsjurk op een paspop in het atelier',
    h1: 'Bruidsjurk op maat in',
    h1Accent: 'Rotterdam.',
    eyebrow: 'Bruidsjurk op maat',
    title: 'Bruidsjurk op maat laten maken in Rotterdam | Bei Couture',
    description: 'Trouwjurk op maat laten maken in Rotterdam. Ook een gekleurde trouwjurk of een trouwjurk in een grote maat. Bruidsatelier Bei Couture, Hoogstraat 89A.',
    lead: 'Een trouwjurk die precies past, in het model dat jij voor je ziet en in de kleur die jij wilt. Bei maakt hem van begin tot eind zelf in haar atelier aan de Hoogstraat.',
    intro: [
      'Je hoeft geen rek met jurken door te passen en te hopen dat er eentje bij zit. In het atelier begint het bij jouw idee. Je laat een foto zien van een jurk die je mooi vindt, of je vertelt wat je voor je ziet, en vanaf daar wordt er een jurk gemaakt die alleen van jou is.',
      'Bei naait sinds 1997 in haar eigen atelier en heeft zich in 2009 helemaal toegelegd op bruidsmode. Ze werkt alleen, dus de vrouw met wie je aan tafel zit is ook de vrouw die jouw jurk maakt.',
    ],
    blokken: [
      {
        kop: 'Alles kan anders dan op de foto',
        tekst: [
          'Een foto is een beginpunt, geen eindpunt. De hals open of juist dicht, mouwtjes erbij, de rug laag uitgesneden, een sleep langer of korter, een andere rok onder hetzelfde lijfje: het kan allemaal, want de jurk wordt toch vanaf nul opgebouwd.',
          'Je kiest zelf de stof. Taft, bruidssatijn, tule en kant liggen klaar in het atelier, en applicaties, kraaltjes of borduursel kunnen toegevoegd worden waar jij ze wilt.',
        ],
      },
      {
        kop: 'Een gekleurde trouwjurk',
        tekst: [
          'Niet iedere bruid wil wit of ivoor. Een gekleurde trouwjurk hoort er net zo goed bij: zacht poederroze, champagne, blauw, bordeaux of een jurk met kleur in de onderrok of in het kant. Omdat de jurk vanaf de stof wordt opgebouwd, is kleur gewoon een keuze die je maakt, geen uitzondering waar je lang naar moet zoeken.',
        ],
      },
      {
        kop: 'Een trouwjurk in een grote maat',
        tekst: [
          'In de winkel is de keuze in grote maten vaak klein, en wat er hangt moet meestal alsnog flink vermaakt worden. Op maat werkt andersom: er wordt gemeten aan jouw lijf en daar wordt het patroon omheen gebouwd. Geen standaardmaat die je moet zien te benaderen.',
          'Bei denkt daarbij mee over steun en pasvorm, zodat het lijfje blijft zitten waar het hoort en je de hele dag vrij kunt bewegen, dansen en ademhalen.',
        ],
      },
      {
        kop: 'Waar je rekening mee houdt',
        lijst: [
          'Kom op tijd langs. Er zijn meerdere pasafspraken nodig en die wil je niet samenpersen.',
          'Neem je trouwschoenen mee naar de pasbeurten, want die bepalen de lengte.',
          'Neem gerust je moeder, zus of getuige mee. Een tweede paar ogen helpt.',
          'Foto\'s van jurken die je mooi vindt, maar ook van wat je juist niet wilt, zijn welkom.',
        ],
      },
    ],
    faq: [
      { v: 'Kan ik een trouwjurk laten maken naar een foto?', a: 'Ja. Een foto van een jurk die je mooi vindt is het handigste beginpunt. Tijdens de afspraak bespreken we wat je precies van die jurk aanspreekt en wat je anders wilt. De jurk wordt daarna naar jouw maten gemaakt, dus het hoeft geen kopie te worden.' },
      { v: 'Maken jullie ook een gekleurde trouwjurk?', a: 'Ja. Omdat elke jurk vanaf de stof wordt opgebouwd, is elke kleur mogelijk. Van ivoor en champagne tot poederroze, blauw of bordeaux, of kleur alleen in de onderrok of het kant.' },
      { v: 'Ik heb een grote maat, kan dat ook?', a: 'Zeker. Er wordt gemeten aan jouw lijf en het patroon wordt daar omheen gemaakt, dus er is geen standaardmaat waar je in moet passen. Bei denkt mee over pasvorm en steun zodat de jurk de hele dag goed blijft zitten.' },
      { v: 'Hoeveel pasafspraken zijn er?', a: 'In de regel pas je eerst een proefjurk, daarna een proefmodel in de gekozen stof en ten slotte de complete jurk. Soms is er een extra pasbeurt nodig, bijvoorbeeld als je maten veranderen. Dat hoort erbij.' },
    ],
    verwant: ['trouwjurk-vermaken', 'bruidsmeisjes-en-bruidsjonkers', 'bruidsmoeder-jurk'],
  },
  {
    slug: 'trouwjurk-vermaken',
    nav: 'Trouwjurk vermaken',
    kaartTitel: 'Trouwjurk vermaken',
    kaartTekst: 'Je eigen jurk korter, passender of helemaal anders. Ook de jurk van je moeder of van een eerdere trouwdag.',
    voorWie: 'Voor een gekochte jurk, of de jurk van je moeder.',
    watJeKrijgt: 'Innemen, inkorten, uitleggen, bandjes of mouwen. Meestal twee pasbeurten.',
    kies: 'Trouwjurk laten vermaken',
    img: sVermaken,
    pos: '50% 35%',
    alt: 'Handen die de rug van een kanten trouwjurk innemen',
    h1: 'Trouwjurk vermaken in',
    h1Accent: 'Rotterdam.',
    eyebrow: 'Vermaken',
    title: 'Trouwjurk vermaken Rotterdam | Bruidsatelier Bei Couture',
    description: 'Trouwjurk of bruidsjurk laten vermaken in Rotterdam. Innemen, uitleggen, inkorten of een jurk opnieuw passend maken. Bruidsatelier Bei Couture, Hoogstraat 89A.',
    lead: 'Je jurk is bijna goed, maar nog niet helemaal van jou. In het atelier wordt hij ingenomen, uitgelegd, ingekort of omgebouwd tot hij zit alsof hij voor jou gemaakt is.',
    intro: [
      'Een jurk uit de winkel is gemaakt op een standaardmaat. Vrijwel niemand heeft die maat precies. Vermaken is daarom geen noodgreep maar de normale laatste stap, en juist die stap bepaalt of een jurk er duur uitziet of niet.',
      'Bei vermaakt al jaren bruidsjurken en krijgt van bruiden vaak te horen dat niemand meer kan zien dat er iets aan gedaan is. Dat is precies het doel.',
    ],
    blokken: [
      {
        kop: 'Wat er mogelijk is',
        lijst: [
          'Innemen of uitleggen in taille, heup, lijfje of cup',
          'Inkorten op de lengte van jouw trouwschoenen',
          'Bandjes, mouwen of een bolero toevoegen of juist weghalen',
          'De rug of hals aanpassen, bijvoorbeeld hoger of juist opener',
          'Een sleep inkorten of een ophaalsysteem voor het feest erin zetten',
          'Steun en cups inzetten zodat je geen beha nodig hebt',
          'Kant, applicaties of kraaltjes bijwerken na het aanpassen',
        ],
      },
      {
        kop: 'De jurk van een eerdere trouwdag of van je moeder',
        tekst: [
          'Trouw je voor de tweede keer, of wil je de jurk van je moeder dragen, dan hoeft die jurk niet te blijven zoals hij is. Een jurk kan gemoderniseerd worden: mouwen eraf, een andere hals, de rok smaller, of alleen het kant bewaren en er een nieuw lijfje onder bouwen.',
          'Zulke jurken hebben vaak een verhaal. Dat wordt met zorg behandeld, en we bespreken eerst goed wat je wel en vooral niet wilt veranderen voordat er geknipt wordt.',
        ],
      },
      {
        kop: 'Ook voor de rest van het gezelschap',
        tekst: [
          'De jurk van de bruidsmoeder, de jurkjes van de bruidsmeisjes en de kleding van de bruidsjonkers kunnen in dezelfde ronde meegenomen worden. Dan sluit alles op elkaar aan en loop je niet op de dag zelf nog met een te lange zoom.',
        ],
      },
    ],
    faq: [
      { v: 'Hoe lang van tevoren moet ik langskomen om mijn trouwjurk te laten vermaken?', a: 'Hoe eerder hoe rustiger. Voor vermaken zijn meestal twee of drie pasbeurten nodig. Zit je krap in de tijd, bel of app dan even. Er wordt altijd eerlijk gezegd of het nog haalbaar is.' },
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
    img: sGala,
    pos: '50% 30%',
    alt: 'Avondjurk in diep bordeauxrood',
    h1: 'Een jurk voor de',
    h1Accent: 'bruidsmoeder.',
    eyebrow: 'Moeder van de bruid',
    title: 'Bruidsmoeder jurk op maat in Rotterdam | Bei Couture',
    description: 'Jurk voor de moeder van de bruid of bruidegom, op maat gemaakt of vermaakt in Rotterdam. Bruidsatelier Bei Couture, Hoogstraat 89A. Afspraak: 06 53 61 25 43.',
    lead: 'Als moeder van de bruid sta je de hele dag op de foto. Dan wil je een jurk die bij de bruid past, bij jou past en waarin je kunt zitten, dansen en huilen zonder er steeds aan te hoeven trekken.',
    intro: [
      'Bruidsmoeders lopen vaak tegen hetzelfde aan. In de winkel is het of te jong, of te saai, of de kleur klopt net niet bij de jurk van de bruid. En wat wel mooi is, zit zelden meteen goed.',
      'In het atelier draai je dat om. Je begint bij de kleur en de sfeer van de bruiloft en bij wat jij zelf prettig vindt om te dragen, en daar wordt een jurk omheen gemaakt of een bestaande jurk op aangepast.',
    ],
    blokken: [
      {
        kop: 'Afgestemd op de bruid',
        tekst: [
          'Neem gerust een foto van de bruidsjurk mee, of kom samen met je dochter langs. Dan kunnen we de kleur, de stof en de lengte naast elkaar leggen, zodat je op de foto\'s van die dag bij elkaar past in plaats van met elkaar vloekt.',
          'Ook de moeder van de bruidegom is welkom. Het is heel gewoon dat beide moeders in hetzelfde atelier geholpen worden, dan weet je zeker dat de twee jurken naast elkaar kloppen.',
        ],
      },
      {
        kop: 'Comfortabel en bedekt waar jij dat wilt',
        lijst: [
          'Mouwtjes, een cape of een bijpassend jasje voor je bovenarmen',
          'Een lijfje met steun, zodat je zelf niets hoeft te corrigeren',
          'Een rok die mooi valt als je zit, niet alleen als je staat',
          'Een lengte die werkt op jouw schoenen, ook op het gras of de dansvloer',
          'Elke kleur, ook de kleuren die in de winkel zelden te vinden zijn',
        ],
      },
      {
        kop: 'Op maat of vermaakt',
        tekst: [
          'Heb je al een jurk gekocht die bijna goed is, dan kan die aangepast worden. Wil je liever iets dat er nog niet is, dan wordt hij gemaakt. Beide kan, en bij de eerste afspraak hoor je welke weg voor jou de verstandigste is.',
        ],
      },
    ],
    faq: [
      { v: 'Welke kleur draag ik als bruidsmoeder?', a: 'Dat is helemaal vrij, zolang je niet in het wit of ivoor verschijnt. Het werkt het prettigst om een kleur te kiezen die aansluit bij het kleurenpalet van de bruiloft. Neem een foto van de bruidsjurk en van de bloemen mee, dan leggen we de stoffen ernaast.' },
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
    img: sMeisjes,
    pos: '50% 45%',
    alt: 'Bruid met haar bruidsmeisjes, op de rug gezien',
    h1: 'Bruidsmeisjes en',
    h1Accent: 'bruidsjonkers.',
    eyebrow: 'Het hele gezelschap',
    title: 'Bruidsmeisjesjurk op maat in Rotterdam | Bei Couture',
    description: 'Bruidsmeisjesjurken en kleding voor bruidsjonkers op maat in Rotterdam, afgestemd op de bruidsjurk. Bruidsatelier Bei Couture, Hoogstraat 89A.',
    lead: 'De bruidsmeisjes en bruidsjonkers staan de hele dag naast je. In het atelier worden hun jurkjes en kleding afgestemd op jouw jurk, in dezelfde kleur, stof of detaillering.',
    intro: [
      'Bruidsmeisjes hebben zelden dezelfde maat en zelden dezelfde smaak. Online een set jurken bestellen levert daarom vaak een stapel teleurstellingen op: de een vindt het te kort, de ander zit klem in de taille en de kleuren blijken op de foto anders dan in het echt.',
      'Bei is zich sinds 2009 gaan specialiseren in bruidsmode, en juist ook voor bruidsjonkers en bruidsmeisjes. Iedereen wordt afzonderlijk opgemeten, maar alles komt uit hetzelfde ontwerp, zodat de groep bij elkaar hoort.',
    ],
    blokken: [
      {
        kop: 'Eén lijn, verschillende lijven',
        tekst: [
          'Hetzelfde model staat niet iedereen even goed. Daarom kan het model per meisje iets verschillen, terwijl de stof, de kleur en de details hetzelfde blijven. De een draagt bandjes, de ander mouwtjes, en op de foto ziet het er toch uit als één geheel.',
          'Dat geldt ook voor kinderen. Een jurkje voor een klein bruidsmeisje mag mooi zijn en tegelijk iets waarin gespeeld en gerend kan worden.',
        ],
      },
      {
        kop: 'Bruidsjonkers',
        tekst: [
          'Voor de bruidsjonkers kan de kleding gemaakt of aangepast worden in dezelfde kleurlijn, bijvoorbeeld met een vestje, een strik of een band in de stof van de bruidsmeisjesjurken. Zo loopt de stijl door het hele gezelschap.',
        ],
      },
      {
        kop: 'Handig om te weten',
        lijst: [
          'Kom bij voorkeur samen langs, dan kunnen de kleuren naast elkaar beoordeeld worden.',
          'Bij kinderen wordt er ruimte ingebouwd, want ze groeien tussen de pasbeurten door.',
          'Al gekochte jurkjes kunnen ook gewoon vermaakt worden, dat hoeft niet nieuw.',
          'Plan dit samen met jouw eigen jurk in, dan scheelt dat afspraken.',
        ],
      },
    ],
    faq: [
      { v: 'Kunnen bruidsmeisjes verschillende modellen dragen?', a: 'Ja, en dat werkt vaak zelfs mooier. Door de stof, de kleur en de details gelijk te houden en het model per persoon aan te passen, staat het iedereen goed en blijft het één geheel.' },
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
    img: satijn,
    pos: '50% 50%',
    alt: 'Ivoorkleurig satijn in plooien',
    h1: 'Gala- en',
    h1Accent: 'avondkleding.',
    eyebrow: 'Gala en avond',
    title: 'Galajurk op maat laten maken in Rotterdam | Bei Couture',
    description: 'Galajurk of avondjurk op maat laten maken of vermaken in Rotterdam. Atelier van Bei Couture aan de Hoogstraat 89A. Afspraak: 06 53 61 25 43.',
    lead: 'Voor een gala, een jubileum, een feest of een gelegenheid waar je er echt wilt staan. Een jurk die niemand anders heeft, in jouw kleur en op jouw maat.',
    intro: [
      'Niet elke mooie avond is een bruiloft. Bei maakt ook galajurken en avondkleding, met dezelfde aandacht als voor bruidsmode: opgemeten, gepast en afgewerkt tot het klopt.',
      'Dat kan een lange jurk zijn in zware stof, iets korters met beweging, of een jurk die je later met een andere ceintuur of een ander jasje opnieuw kunt dragen.',
    ],
    blokken: [
      {
        kop: 'Waar je aan kunt denken',
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
        tekst: [
          'Satijn valt zwaar en glanst, tule geeft volume, taft houdt zijn vorm en kant geeft richting aan het hele ontwerp. Tijdens de afspraak voel je de stoffen en houd je ze bij je gezicht, want een kleur die op een schermpje mooi is, is dat op jouw huid niet altijd.',
        ],
      },
      {
        kop: 'Ook als je een jurk al hebt',
        tekst: [
          'Een galajurk die je online besteld hebt zit bijna nooit meteen goed. Innemen, inkorten, bandjes verzetten of cups inzetten tilt zo\'n jurk vaak in één pasbeurt naar een heel ander niveau.',
        ],
      },
    ],
    faq: [
      { v: 'Hoe lang van tevoren moet ik een galajurk laten maken?', a: 'Reken op meerdere pasafspraken en houd daar ruim de tijd voor. Is je gala al snel, bel of app dan even, dan hoor je meteen of het nog lukt of dat vermaken van een bestaande jurk slimmer is.' },
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
    img: sAtelier,
    pos: '40% 50%',
    alt: 'Garenklosjes, een vingerhoed en spelden op de werktafel van het atelier',
    h1: 'Kleding op maat en',
    h1Accent: 'vermaken.',
    eyebrow: 'Kleermaker',
    title: 'Kleermaker in Rotterdam: kleding op maat | Bei Couture',
    description: 'Kleermaker in Rotterdam voor kleding op maat en vermaakwerk. Jurken, rokken, blouses en jassen, innemen, inkorten en herstellen. Bei Couture, Hoogstraat 89A.',
    lead: 'Bei is kleermaker. Naast bruidsmode maakt en vermaakt ze gewoon kleding, voor vrouwen die iets willen dat echt past.',
    intro: [
      'Er zijn kledingstukken waar je maar geen goede versie van kunt vinden. Een rok die altijd te kort of te lang is, een jurk in precies die ene kleur, een blouse die op jouw schouders klopt. Dat kan hier gemaakt worden.',
      'En er zijn kledingstukken waar je aan gehecht bent en die net niet meer zitten. Die hoef je niet weg te doen.',
    ],
    blokken: [
      {
        kop: 'Op maat gemaakt',
        lijst: [
          'Jurken, rokken, blouses en pantalons naar jouw ontwerp',
          'Een mantel of jas, afgestemd op jouw lengte en schouders',
          'Kleding in een maat die in de winkel nauwelijks te vinden is',
          'Een kledingstuk nagemaakt dat je versleten hebt en niet meer kunt kopen',
        ],
      },
      {
        kop: 'Vermaken en herstellen',
        lijst: [
          'Innemen en uitleggen in taille, heup, cup of schouder',
          'Inkorten van rokken, jurken, mouwen en broekspijpen',
          'Ritsen, voeringen en gescheurde naden vervangen',
          'Een kledingstuk aanpassen na een verandering in je maten',
        ],
      },
      {
        kop: 'Ook carnaval, turnpakjes en kostuums',
        tekst: [
          'Het atelier maakt ook carnavalskleding, turnpakjes en kostuums. Juist dat soort werk vraagt om maatwerk, omdat het moet kunnen rekken, zitten en bewegen. Noem het maar op en het wordt in het atelier gemaakt.',
        ],
      },
    ],
    faq: [
      { v: 'Maakt Bei Couture ook gewone kleding, dus geen bruidsmode?', a: 'Ja. Bei is kleermaker en maakt en vermaakt ook alledaagse kleding, van rokken en jurken tot jassen. Bruidsmode is haar specialisme, maar niet het enige wat ze doet.' },
      { v: 'Kan ik een kledingstuk laten namaken?', a: 'Vaak wel. Breng het kledingstuk mee naar de afspraak, dan kijkt Bei hoe het in elkaar zit en welke stof erbij past.' },
      { v: 'Doen jullie ook kleine reparaties?', a: 'Ja, zoals ritsen vervangen, voeringen herstellen, naden en zomen. Loop even binnen tijdens de openingstijden of app een foto, dan hoor je wat er mogelijk is.' },
    ],
    verwant: ['trouwjurk-vermaken', 'gala-en-avondkleding', 'bruidsjurk-op-maat'],
  },
];

export const dienstOp = (slug: string) => diensten.find((d) => d.slug === slug)!;
