// ─────────────────────────────────────────────────────────────────
// Constantes canónicas del sitio — única fuente de verdad para
// metadataBase, canonical URLs, sitemap, robots y JSON-LD.
// ─────────────────────────────────────────────────────────────────

/**
 * Origen canónico del sitio, SIN barra final.
 * Se puede sobreescribir con NEXT_PUBLIC_SITE_URL (útil en previews).
 * Vercel expone VERCEL_PROJECT_PRODUCTION_URL en builds de producción.
 */
function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '') ||
    'https://www.radixinmobiliaria.com.ar'

  const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

export const SITE_URL = resolveSiteUrl()

export const SITE_NAME = 'RADIX Consultores Inmobiliarios'
export const SITE_SHORT_NAME = 'RADIX'
export const SITE_LOCALE = 'es_AR'
export const SITE_LANG = 'es-AR'

export const SITE_TITLE_DEFAULT = 'RADIX Consultores Inmobiliarios — Salta y NOA'

export const SITE_DESCRIPTION =
  'Firma premium de real estate en Salta y el NOA. Compra, venta, alquiler, inversiones y administración de propiedades con más de 17 años de trayectoria.'

export const SITE_OG_DESCRIPTION =
  'Firma premium de real estate. Propiedades, inversiones y administración en Salta · NOA · Argentina.'

/** Convierte una ruta relativa en URL absoluta canónica. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean.replace(/\/+$/, '')}`
}
