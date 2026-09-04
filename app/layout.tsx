import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  SITE_TITLE_DEFAULT,
  SITE_DESCRIPTION,
  SITE_OG_DESCRIPTION,
} from '@/lib/seo/site'
import { DEFAULT_OG_IMAGE, toMetaDescription } from '@/lib/seo/metadata'
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/seo/json-ld'
import { getContactConfig, getRedesConfig, getSeoConfig } from '@/lib/data/web-config'
import { GoogleTag } from '@/components/analytics/google-tag'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

/**
 * Instrument Serif — self-hosted.
 *
 * Antes venía de un <link> a fonts.googleapis.com, que bloqueaba el render de
 * TODA la página ~870ms (medido) y encadenaba tres saltos:
 * HTML → googleapis (CSS) → gstatic (woff2). Ahora sale del mismo origen, se
 * preloadea junto al HTML y no bloquea nada.
 *
 * Solo el subset `latin`: cubre el español completo (á é í ó ú ñ ü ¿ ¡). No se
 * baja `latin-ext`, que no usamos.
 *
 * `adjustFontFallback` genera una @font-face de respaldo con las métricas
 * reales del archivo (ascent/descent/size-adjust) sobre Times New Roman, para
 * que el swap no mueva el <h1> del hero, donde la palabra en itálica se ve a
 * hasta 8rem. Antes el fallback era Georgia crudo, sin ajuste de métricas.
 */
const instrumentSerif = localFont({
  src: [
    { path: './fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-instrument-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'serif'],
})

/**
 * Geist Mono: se dejó de cargar a propósito.
 *
 * Nunca llegó a renderizar. El layout hacía
 * `style={{ '--font-geist-mono': GeistMono.variable }}`, y `.variable` es el
 * NOMBRE DE CLASE (`geistmono_…__variable`), no una familia; al ir inline
 * pisaba la definición real de la clase. O sea que `font-mono` viene cayendo
 * a la monospace del sistema desde siempre, en las tres pantallas que la usan
 * (tasaciones, experience-panels, valuations) — todas below-the-fold.
 *
 * Como esa ES la apariencia actual, se conserva tal cual: tailwind.config
 * ahora declara `mono: ['monospace']` explícitamente y no se descargan los
 * 71 KB del woff2, que además salían con prioridad VeryHigh en cada página.
 *
 * Si en algún momento se quiere Geist Mono de verdad, es agregar acá un
 * `localFont({ src: './fonts/GeistMono-Variable.woff2', variable:
 * '--font-geist-mono', preload: false })` y devolver la variable al config.
 * Es una decisión de diseño, no de performance.
 */

/**
 * Metadata global. Los textos se pueden editar desde el CMS (web_config →
 * seo_global); si la DB no responde, se usan las constantes de lib/seo/site.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoConfig()

  const title = seo.defaultTitle || SITE_TITLE_DEFAULT
  const description = seo.defaultDescription || SITE_DESCRIPTION

  return {
    // Base para resolver canonical / OG / Twitter relativos a URL absolutas.
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s — RADIX',
    },
    description: toMetaDescription(description),
    applicationName: SITE_NAME,
    keywords: [
      'inmobiliaria Salta',
      'propiedades en Salta',
      'casas en venta Salta',
      'departamentos en alquiler Salta',
      'inversiones inmobiliarias NOA',
      'administración de propiedades Salta',
      'real estate Salta',
      'Valle de Lerma',
      'RADIX Consultores Inmobiliarios',
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'real estate',
    // Sin `alternates.canonical` global a propósito: en Next.js las páginas
    // heredarían el canonical del layout y todas apuntarían al home.
    // Cada página define el suyo con pageMetadata().
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      title: seo.ogTitle || title,
      description: seo.ogDescription || SITE_OG_DESCRIPTION,
      images: [{ url: seo.ogImage || DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || title,
      description: seo.ogDescription || SITE_OG_DESCRIPTION,
      images: [seo.ogImage || DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#050810',
  colorScheme: 'dark',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [contact, redes] = await Promise.all([getContactConfig(), getRedesConfig()])

  return (
    // Sin <head> propio: ya no hay preconnect a fonts.googleapis/gstatic porque
    // no queda ninguna fuente externa. Todas se sirven desde el mismo origen.
    <html lang="es-AR" className="dark">
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} antialiased`}
      >
        <JsonLd
          data={[
            organizationSchema({
              telefono: contact.phone,
              email: contact.email,
              direccion: contact.address,
              whatsapp: contact.whatsapp_number,
              redes: [redes.instagram, redes.facebook, redes.linkedin],
            }),
            websiteSchema(),
          ]}
        />
        {children}
        <GoogleTag />
      </body>
    </html>
  )
}
