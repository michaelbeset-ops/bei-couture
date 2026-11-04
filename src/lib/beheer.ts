// Hulpfuncties voor de inhoud die Bei zelf beheert via de bewerkmodus (public/beheer/bewerk.js):
// klantervaringen (src/content/klantverhalen/*.json) en klantfoto's (src/content/galerij/fotos.json).
import galerijBestand from '../content/galerij/fotos.json';
import type { VerhaalFoto } from '../components/Verhaal.astro';
import { diensten } from '../data/diensten';

// Foto's uit src/assets/upload. De bewerkmodus schrijft paden relatief vanuit src/content/<map>/
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

// ---------- klantervaringen die Bei zelf toevoegt ----------
// Vorm van een bestand in src/content/klantverhalen/ (zo schrijft bewerk.js het ook weg).
interface KlantverhaalBestand {
  label?: string;
  kop?: string;
  citaat?: string;
  tekst?: string;
  naam?: string;
  sterren?: number;
  bron?: string;
  datum?: string;
  dienst?: string;
  fotos?: { foto?: string; alt?: string }[];
  online?: boolean;
}
export interface Klantverhaal {
  id: string;
  label: string;
  kop: string;
  citaat: string;
  tekst: string[];
  naam: string;
  sterren: number;
  /** Bron plus maand, zoals hij op de pagina staat: "Google, november 2026". */
  bron: string;
  google: boolean;
  datum: Date;
  dienst: string;
  fotos: VerhaalFoto[];
  online: boolean;
}

const verhaalBestanden = import.meta.glob<KlantverhaalBestand>('/src/content/klantverhalen/*.json', { eager: true, import: 'default' });
const dienstSlugs = new Set(diensten.map((d) => d.slug));

export const maandJaar = (d: Date) => d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

/** Alle klantervaringen van Bei, nieuwste eerst, ook de offline gezette (die staan verborgen op de pagina,
 *  zodat Bei ze in de bewerkmodus terug kan zetten). */
export function klantverhalen(): Klantverhaal[] {
  return Object.entries(verhaalBestanden)
    .map(([pad, v]) => {
      const datum = new Date(`${v.datum ?? '2026-01-01'}T12:00:00`);
      const naam = (v.naam ?? '').trim();
      const bronNaam = (v.bron ?? '').trim();
      const fotos = (v.fotos ?? [])
        .map((f) => ({ foto: uploadFoto(f.foto), alt: f.alt?.trim() || `Foto bij de ervaring${naam ? ` van ${naam}` : ''} met Bei Couture` }))
        .filter((f): f is VerhaalFoto => !!f.foto)
        .slice(0, 4);
      return {
        id: pad.split('/').pop()!.replace(/\.json$/, ''),
        label: (v.label ?? '').trim(),
        kop: (v.kop ?? '').trim() || 'Een klantervaring',
        citaat: (v.citaat ?? '').trim().replace(/^["“”]+|["“”]+$/g, ''),
        tekst: (v.tekst ?? '').replace(/\r/g, '').split(/\n\s*\n/).map((t) => t.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean),
        naam,
        sterren: Math.max(0, Math.min(5, Math.round(Number(v.sterren ?? 0)) || 0)),
        bron: [bronNaam, isNaN(datum.getTime()) ? '' : maandJaar(datum)].filter(Boolean).join(', '),
        google: bronNaam === 'Google',
        datum,
        dienst: dienstSlugs.has(v.dienst ?? '') ? v.dienst! : '',
        fotos,
        online: v.online !== false,
      };
    })
    .sort((a, b) => b.datum.getTime() - a.datum.getTime() || a.id.localeCompare(b.id));
}
