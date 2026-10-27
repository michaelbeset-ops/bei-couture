// JSON-LD voor Bei Couture. Alleen gegevens die op de site zelf ook te zien zijn.
import { site, dagenKort, werkgebied } from '../data/site';

export const bedrijfId = (basis: string) => `${basis}#bedrijf`;

export function bedrijf(basis: string, logoUrl: string, afbeelding: string) {
  const openingsuren = site.tijden
    .map((t, d) => (t ? { '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]}`, opens: `${String(t[0]).padStart(2, '0')}:00`, closes: `${String(t[1]).padStart(2, '0')}:00` } : null))
    .filter(Boolean);

  return {
    '@type': ['ClothingStore', 'LocalBusiness'],
    '@id': bedrijfId(basis),
    name: site.naam,
    alternateName: 'Bruidsatelier Bei Couture',
    description:
      'Bruidsatelier en kleermaker in Rotterdam. Bruidsjurken op maat, trouwjurken vermaken, jurken voor de bruidsmoeder, bruidsmeisjes en bruidsjonkers, gala- en avondkleding en kleding op maat.',
    url: basis,
    logo: logoUrl,
    image: afbeelding,
    telephone: site.telE164,
    email: site.mail,
    priceRange: '$$',
    currenciesAccepted: 'EUR',
    foundingDate: '1997',
    founder: { '@type': 'Person', name: 'Bei' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.straat,
      postalCode: site.postcode,
      addressLocality: site.plaats,
      addressCountry: site.land,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lon },
    hasMap: site.reviews,
    openingHoursSpecification: openingsuren,
    openingHours: site.tijden.map((t, d) => (t ? `${dagenKort[d]} ${String(t[0]).padStart(2, '0')}:00-${String(t[1]).padStart(2, '0')}:00` : null)).filter(Boolean),
    areaServed: werkgebied.map((p) => ({ '@type': 'City', name: p })),
    knowsLanguage: ['nl', 'en', 'zh'],
    sameAs: ['https://www.instagram.com/beicouture/', site.reviews],
  };
}

export const dienstSchema = (naam: string, beschrijving: string, paginaUrl: string, basis: string) => ({
  '@type': 'Service',
  name: naam,
  description: beschrijving,
  serviceType: naam,
  url: paginaUrl,
  provider: { '@id': bedrijfId(basis) },
  areaServed: werkgebied.map((p) => ({ '@type': 'City', name: p })),
});

export const faqSchema = (vragen: { v: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: vragen.map((q) => ({
    '@type': 'Question',
    name: q.v,
    acceptedAnswer: { '@type': 'Answer', text: q.a },
  })),
});

export const kruimelSchema = (items: { naam: string; url: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((i, n) => ({ '@type': 'ListItem', position: n + 1, name: i.naam, item: i.url })),
});
