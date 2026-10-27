// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Pagina's die niet in Google horen en dus ook niet in de sitemap (zie src/data/site.ts: geenIndex).
const geenIndex = ['/privacy/', '/404/'];
const basis = '/sitefront/bei-couture';

// Demo draait in een submap van de Sitefront-verzamelrepo (deployscript zet dit om naar voorstel.sitefront.nl/bei-couture/).
export default defineConfig({
  site: 'https://michaelbeset-ops.github.io',
  base: basis,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { format: 'directory', inlineStylesheets: 'always' },
  // Content-Security-Policy als meta-tag. Astro hasht de eigen scripts, zodat er geen
  // 'unsafe-inline' voor JavaScript nodig is. Stijlattributen (object-position, animatievertraging)
  // vragen wel 'unsafe-inline' voor style-src.
  security: {
    csp: {
      algorithm: 'SHA-256',
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        "frame-src 'none'",
        'upgrade-insecure-requests',
      ],
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !geenIndex.some((p) => new URL(page).pathname === `${basis}${p}`),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
