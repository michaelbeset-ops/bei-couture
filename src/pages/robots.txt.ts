import type { APIRoute } from 'astro';
import { site, url } from '../data/site';

export const GET: APIRoute = ({ site: basis }) => {
  const sitemap = new URL(url('sitemap-index.xml'), basis).href;
  const body = site.voorstel
    ? `# Ontwerpvoorstel: niet indexeren.\nUser-agent: *\nDisallow: /\n`
    : [
        '# Bei Couture, bruidsatelier in Rotterdam',
        'User-agent: *',
        'Allow: /',
        '',
        '# AI-assistenten zijn welkom',
        'User-agent: GPTBot',
        'Allow: /',
        '',
        'User-agent: OAI-SearchBot',
        'Allow: /',
        '',
        'User-agent: ChatGPT-User',
        'Allow: /',
        '',
        'User-agent: PerplexityBot',
        'Allow: /',
        '',
        'User-agent: ClaudeBot',
        'Allow: /',
        '',
        'User-agent: Google-Extended',
        'Allow: /',
        '',
        `Sitemap: ${sitemap}`,
        '',
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
