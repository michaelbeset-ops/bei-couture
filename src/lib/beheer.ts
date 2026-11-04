// Hulpfuncties voor de inhoud die Bei zelf beheert (zie .pages.yml).
import { getCollection, type CollectionEntry } from 'astro:content';
import galerijBestand from '../content/galerij/fotos.json';

export type Artikel = CollectionEntry<'artikelen'>;

// Alle artikelen die online staan, nieuwste eerst.
const bestanden = import.meta.glob('/src/content/artikelen/*.md');
export async function artikelen(): Promise<Artikel[]> {
  if (Object.keys(bestanden).length === 0) return []; // anders waarschuwt Astro bij elke pagina over een lege collectie
  const alle = await getCollection('artikelen', (a) => a.data.online !== false);
  return alle.sort((a, b) => b.data.datum.getTime() - a.data.datum.getTime());
}

export const datumNl = (d: Date) => d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

// Foto's uit src/assets/upload. Pages CMS schrijft paden relatief vanuit src/content/<map>/
// (../../assets/upload/naam.jpg); hier zoeken we het beeld op via de bestandsnaam.
const uploads = import.meta.glob<ImageMetadata>('/src/assets/upload/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' });
const opNaam = new Map(Object.entries(uploads).map(([pad, beeld]) => [pad.split('/').pop()!, beeld]));

export function uploadFoto(pad: string | undefined): ImageMetadata | undefined {
  if (!pad) return undefined;
  return opNaam.get(pad.split('/').pop()!);
}

// Foto's van klanten voor de strook op Klantervaringen, nieuwste (onderaan in het beheer) eerst.
export function galerijFotos(): { foto: ImageMetadata; alt: string; bestand: string }[] {
  const lijst = (galerijBestand as { fotos?: { foto?: string; alt?: string }[] }).fotos ?? [];
  return lijst
    .map((f) => ({ foto: uploadFoto(f.foto), alt: f.alt?.trim() || 'Foto uit het atelier van Bei Couture', bestand: (f.foto ?? '').split('/').pop() ?? '' }))
    .filter((f): f is { foto: ImageMetadata; alt: string; bestand: string } => !!f.foto)
    .reverse();
}
