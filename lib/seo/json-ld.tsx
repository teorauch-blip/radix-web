import type { PropiedadPublica } from '@/lib/types/db'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, absoluteUrl } from '@/lib/seo/site'
import { DEFAULT_OG_IMAGE } from '@/lib/seo/metadata'

// ─────────────────────────────────────────────────────────────────
// Schema.org / JSON-LD
// ─────────────────────────────────────────────────────────────────

type Json = Record<string, unknown>

/**
 * Inserta un bloque JSON-LD. Se renderiza en el servidor, por lo que
 * Google lo ve en el HTML inicial sin ejecutar JavaScript.
 */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // El contenido lo generamos nosotros desde datos tipados; se escapa
      // `<` para evitar que un string de la DB cierre el <script>.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

/** Descarta placeholders del contenido estático (ej. '+54 387 XXX-XXXX'). */
function realValue(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const v = value.trim()
  if (!v || /X{3,}/i.test(v) || /0{7,}/.test(v)) return undefined
  return v
}

export interface OrganizationInput {
  telefono?: string | null
  email?: string | null
  direccion?: string | null
  whatsapp?: string | null
  redes?: Array<string | null | undefined>
}

/** RealEstateAgent — el tipo más específico para una inmobiliaria. */
export function organizationSchema(input: OrganizationInput = {}): Json {
  const sameAs = (input.redes ?? []).filter((u): u is string => Boolean(u && u.trim()))
  const telephone = realValue(input.telefono)
  const email = realValue(input.email)
  const whatsapp = realValue(input.whatsapp)

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'RADIX',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/branding/radix-isotype.png'),
    },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: SITE_DESCRIPTION,
    areaServed: [
      { '@type': 'City',              name: 'Salta' },
      { '@type': 'AdministrativeArea', name: 'Salta, Argentina' },
      { '@type': 'AdministrativeArea', name: 'Noroeste Argentino (NOA)' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: realValue(input.direccion) ?? 'Balcarce 1050',
      addressLocality: 'Salta',
      addressRegion: 'Salta',
      addressCountry: 'AR',
    },
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    ...(sameAs.length || whatsapp
      ? { sameAs: [...sameAs, ...(whatsapp ? [`https://wa.me/${whatsapp}`] : [])] }
      : {}),
    knowsLanguage: 'es-AR',
  }
}

/** WebSite — habilita el sitelinks searchbox y consolida el nombre del sitio. */
export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'es-AR',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export interface Crumb {
  name: string
  path: string
}

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}

const TIPO_SCHEMA: Record<string, string> = {
  departamento: 'Apartment',
  casa:         'House',
  duplex:       'House',
  terreno:      'LandForm',
  local:        'Place',
  oficina:      'Place',
  cochera:      'Place',
  galpon:       'Place',
  otro:         'Place',
}

/**
 * RealEstateListing de una propiedad, con oferta y características.
 * Solo se emite la oferta si hay precio real: Google penaliza `price: 0`.
 */
export function propertySchema(p: PropiedadPublica, imageUrls: string[]): Json {
  const url = absoluteUrl(`/propiedades/${p.slug}`)
  const precio = p.precio_venta ?? p.precio_alquiler
  const moneda = p.precio_venta ? p.moneda_venta : p.moneda_alquiler
  const name = p.titulo_web ?? `${p.tipo} en ${p.barrio ?? p.ciudad}`

  const amenities = [
    p.tiene_ascensor   && 'Ascensor',
    p.tiene_balcon     && 'Balcón',
    p.tiene_terraza    && 'Terraza',
    p.tiene_piscina    && 'Piscina',
    p.permite_mascotas && 'Permite mascotas',
  ].filter((v): v is string => Boolean(v))

  const superficie = p.superficie_cubierta ?? p.superficie_total

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    url,
    name,
    ...(p.descripcion_web ? { description: p.descripcion_web } : {}),
    ...(imageUrls.length ? { image: imageUrls.slice(0, 8) } : {}),
    ...(p.publicado_en ? { datePosted: p.publicado_en } : {}),
    inLanguage: 'es-AR',
    provider: { '@id': `${SITE_URL}/#organization` },
    ...(precio && precio > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: precio,
            priceCurrency: moneda ?? 'USD',
            availability: 'https://schema.org/InStock',
            businessFunction: p.precio_venta
              ? 'http://purl.org/goodrelations/v1#Sell'
              : 'http://purl.org/goodrelations/v1#LeaseOut',
            url,
          },
        }
      : {}),
    about: {
      '@type': TIPO_SCHEMA[p.tipo] ?? 'Accommodation',
      name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: p.direccion,
        ...(p.barrio ? { addressLocality: p.barrio } : { addressLocality: p.ciudad }),
        addressRegion: p.provincia,
        addressCountry: 'AR',
      },
      ...(p.latitud != null && p.longitud != null
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: p.latitud,
              longitude: p.longitud,
            },
          }
        : {}),
      ...(superficie != null
        ? {
            floorSize: {
              '@type': 'QuantitativeValue',
              value: superficie,
              unitCode: 'MTK',
            },
          }
        : {}),
      ...(p.dormitorios != null ? { numberOfBedrooms: p.dormitorios } : {}),
      ...(p.banos        != null ? { numberOfBathroomsTotal: p.banos } : {}),
      ...(p.ambientes    != null ? { numberOfRooms: p.ambientes } : {}),
      ...(amenities.length
        ? {
            amenityFeature: amenities.map((a) => ({
              '@type': 'LocationFeatureSpecification',
              name: a,
              value: true,
            })),
          }
        : {}),
    },
  }
}

/** ItemList del listado de propiedades — ayuda a Google a entender la colección. */
export function itemListSchema(items: Array<{ slug: string | null; titulo: string }>): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Propiedades disponibles — RADIX',
    numberOfItems: items.length,
    itemListElement: items
      .filter((i) => Boolean(i.slug))
      .map((i, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: i.titulo,
        url: absoluteUrl(`/propiedades/${i.slug}`),
      })),
  }
}
