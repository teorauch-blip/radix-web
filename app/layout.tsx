import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { DM_Sans } from 'next/font/google'
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

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

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

const instrumentSerifUrl =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [contact, redes] = await Promise.all([getContactConfig(), getRedesConfig()])

  return (
    <html lang="es-AR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={instrumentSerifUrl} rel="stylesheet" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${dmSans.variable} antialiased`}
        style={
          {
            '--font-geist-mono': GeistMono.variable,
            '--font-instrument-serif': "'Instrument Serif'",
          } as React.CSSProperties
        }
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
      </body>
    </html>
  )
}
