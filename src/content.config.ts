// Inhoud die Bei zelf beheert via Pages CMS (zie .pages.yml): artikelen als markdown in src/content/artikelen.
// De foto's van klanten (src/content/galerij/fotos.json) worden rechtstreeks ingelezen in src/lib/beheer.ts.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artikelen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artikelen' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      datum: z.coerce.date(),
      intro: z.string(),
      foto: image().optional(),
      fotoAlt: z.string().optional(),
      online: z.boolean().default(true),
    }),
});

export const collections = { artikelen };
