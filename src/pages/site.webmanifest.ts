import type { APIRoute } from 'astro';
import { site, url } from '../data/site';

export const GET: APIRoute = () => {
  const manifest = {
    name: `${site.naam}, bruidsatelier in ${site.plaats}`,
    short_name: site.naam,
    description: `Bruidsatelier en kleermaker aan de ${site.straat} in ${site.plaats}.`,
    lang: 'nl-NL',
    start_url: url(''),
    scope: url(''),
    display: 'standalone',
    background_color: '#f7f2ec',
    theme_color: site.themeColor,
    icons: [
      { src: url('icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: url('icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: url('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } });
};
