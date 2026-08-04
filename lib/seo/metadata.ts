import type { Metadata } from 'next'
import { SITE_NAME, SITE_LOCALE, absoluteUrl } from '@/lib/seo/site'

/**
 * Imagen OG por defecto (1200×630) servida desde /public.
 * Coincide con la ruta configurada en el CMS (web_config → seo_global).
 */
export const DEFAULT_OG_IMAGE = '/og-image.jpg'

/**
 * Normaliza un texto del CMS para usarlo como meta description:
 * colapsa saltos de línea y recorta a ~160 caracteres en un límite de palabra
 * (Google trunca alrededor de ese largo en el snippet).
 */
export function toMetaDescription(text: string, maxLength = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean

  const cut = clean.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:·\-\s]+$/, '')}…`
}

export interface PageMetadataInput {
  /** Título sin la marca: el template del layout añade " — RADIX". */
  title: string
  description: string
  /** Ruta relativa canónica, ej. '/propiedades'. */
  path: string
  /** Título completo para OG/Twitter (por defecto: `${title} — RADIX`). */
  ogTitle?: string
  images?: string[]
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
}

/**
 * Construye metadata consistente para una página.
 *
 * Importante: en Next.js el objeto `openGraph` de una página REEMPLAZA al del
 * layout (no hace merge profundo), así que este helper siempre emite el bloque
 * OG completo — si no, se perderían siteName, locale, url e imagen.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  images = [DEFAULT_OG_IMAGE],
  type = 'website',
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const socialTitle = ogTitle ?? `${title} — RADIX`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: SITE_LOCALE,
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: images.map((image) => ({ url: image })),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images,
    },
    ...(noindex
      ? { robots: { index: false, follow: true } }
      : {}),
  }
}
