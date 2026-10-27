import type { APIRoute } from 'astro';
import { site, url, werkgebied, stappen } from '../data/site';
import { diensten } from '../data/diensten';

// Korte, feitelijke samenvatting voor AI-assistenten. Alleen wat ook op de site staat.
export const GET: APIRoute = ({ site: basis }) => {
  const abs = (p: string) => new URL(url(p), basis).href;
  const regels = [
    `# ${site.naam}`,
    '',
    `> Bruidsatelier en kleermaker in ${site.plaats}. Bruidsjurken op maat, trouwjurken vermaken, jurken voor de bruidsmoeder, bruidsmeisjes en bruidsjonkers, gala- en avondkleding en kleding op maat. Eigen atelier sinds 1997, sinds 2009 gespecialiseerd in bruidsmode.`,
    '',
    '## Gegevens',
    `- Adres: ${site.straat}, ${site.postcode} ${site.plaats} (in het pand van ${site.inPand})`,
    `- Telefoon en WhatsApp: ${site.tel}`,
    `- E-mail: ${site.mail}`,
    '- Openingstijden: dinsdag tot en met vrijdag 11:00 tot 17:00, zondag 12:00 tot 17:00, maandag en zaterdag gesloten',
    '- Buiten de openingstijden is een afspraak mogelijk, ook in de avond, op maandag of op zaterdag',
    `- Beoordeling: ${site.google.score} uit ${site.google.aantal} Google-reviews`,
    `- Werkgebied: ${werkgebied.join(', ')}`,
    '',
    '## Wat het atelier doet',
    ...diensten.map((d) => `- [${d.kaartTitel}](${abs(`${d.slug}/`)}): ${d.kaartTekst}`),
    '',
    '## Werkwijze',
    ...stappen.map((s) => `${s.nr}. ${s.titel}: ${s.kort}`),
    '',
    '## Pagina\'s',
    `- [Home](${abs('')})`,
    `- [Atelier](${abs('atelier/')})`,
    `- [Werkwijze](${abs('werkwijze/')})`,
    `- [Klantervaringen](${abs('klantervaringen/')})`,
    `- [Over Bei](${abs('over-bei/')})`,
    `- [Afspraak maken](${abs('contact/')})`,
    '',
  ];
  return new Response(regels.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
