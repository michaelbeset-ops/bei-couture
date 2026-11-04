import type { APIRoute } from 'astro';
import { site, url, werkgebied, stappen, kernfeiten, dagen, volgorde } from '../data/site';
import { diensten } from '../data/diensten';

// Korte, feitelijke samenvatting voor AI-assistenten. Alleen wat ook zichtbaar op de site staat.
export const GET: APIRoute = async ({ site: basis }) => {
  const abs = (p: string) => new URL(url(p), basis).href;
  const tijden = volgorde.map((d) => {
    const t = site.tijden[d];
    return `- ${dagen[d]}: ${t ? `${t[0]}:00 tot ${t[1]}:00` : site.dicht.includes(d) ? 'gesloten' : 'gesloten, wel op afspraak'}`;
  });

  const regels = [
    `# ${site.naam}`,
    '',
    `> Bruidsatelier en kleermaker aan de ${site.straat} in ${site.plaats}. Bruidsjurken op maat, trouwjurken vermaken, jurken voor de bruidsmoeder, bruidsmeisjes en bruidsjonkers, gala- en avondkleding en kleding op maat. Eigen atelier sinds 1997, sinds 2009 gespecialiseerd in bruidsmode. ${site.google.score} uit ${site.google.aantal} Google-reviews.`,
    '',
    '## Gegevens',
    `- Adres: ${site.straat}, ${site.postcode} ${site.plaats} (in het pand van ${site.inPand})`,
    `- Telefoon en WhatsApp: ${site.tel}`,
    `- E-mail: ${site.mail}`,
    `- Website: ${abs('')}`,
    `- Eigenaar en kleermaker: ${site.eigenaar}`,
    `- Werkgebied: ${werkgebied.join(', ')}`,
    '',
    '## Openingstijden',
    ...tijden,
    '- Buiten deze tijden is een afspraak mogelijk, ook in de avond, op maandag',
    '',
    '## Wat het atelier doet',
    ...diensten.map((d) => `- [${d.kaartTitel}](${abs(`${d.slug}/`)}): ${d.kaartTekst}`),
    '',
    '## Werkwijze',
    ...stappen.map((s) => `${s.nr}. ${s.titel}: ${s.kort}`),
    '',
    '## Veelgestelde vragen',
    ...kernfeiten.flatMap((f) => [`### ${f.vraag}`, f.antwoord, '']),
    "## Pagina's",
    `- [Home](${abs('')}): bruidsatelier in ${site.plaats}`,
    `- [Atelier](${abs('atelier/')}): alles wat gemaakt en vermaakt wordt`,
    `- [Werkwijze](${abs('werkwijze/')}): de vier afspraken van schets tot jurk`,
    `- [Klantervaringen](${abs('klantervaringen/')}): verhalen van bruiden`,
    `- [Over Bei](${abs('over-bei/')}): wie Bei is en hoe zij werkt`,
    `- [Afspraak maken](${abs('afspraak/')}): in een paar vragen, daarna staat het bericht klaar voor WhatsApp`,
    `- [Contact](${abs('contact/')}): adres, openingstijden en contactmanieren`,
    '',
  ];
  return new Response(regels.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
