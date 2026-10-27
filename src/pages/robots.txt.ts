import type { APIRoute } from 'astro';
import { site, url } from '../data/site';

// Zoek- en AI-zoekcrawlers staan altijd toe: zonder hen geen vermelding in Google, Bing,
// ChatGPT, Perplexity, Copilot of Gemini. Trainingscrawlers zijn een keuze van de klant;
// voor een klein atelier weegt bekendheid zwaarder dan afschermen (seo.config.json:
// aiCrawlers.training = allow).
const zoeken = [
  'Googlebot',
  'Googlebot-Image',
  'Google-Agent',
  'Google-Extended',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'Applebot',
  'DuckAssistBot',
  'MistralAI-User',
  'Meta-ExternalFetcher',
  'Amazonbot',
  'YandexBot',
  'Slurp',
];

const training = ['GPTBot', 'ClaudeBot', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'FacebookBot', 'Google-CloudVertexBot'];

export const GET: APIRoute = ({ site: basis }) => {
  const sitemap = new URL(url('sitemap-index.xml'), basis).href;

  if (site.voorstel) {
    return tekst('# Ontwerpvoorstel van Sitefront: niet indexeren.\nUser-agent: *\nDisallow: /\n');
  }

  const regels = [
    `# ${site.naam}, bruidsatelier aan de ${site.straat} in ${site.plaats}`,
    '# Zoekmachines en AI-assistenten zijn welkom. Samenvatting: /llms.txt',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Zoeken en citeren in AI-antwoorden',
    ...zoeken.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    '# Trainingscrawlers (toegestaan door Bei Couture)',
    ...training.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${sitemap}`,
    '',
  ];
  return tekst(regels.join('\n'));
};

const tekst = (body: string) => new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
