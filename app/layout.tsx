import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'RADIX Consultores Inmobiliarios',
    template: '%s — RADIX',
  },
  description:
    'Firma premium de real estate en Salta y el NOA. Estrategia, diseño y precisión al servicio del capital inmobiliario.',
  keywords: ['inmobiliaria', 'real estate', 'Salta', 'NOA', 'Valle de Lerma', 'propiedades premium', 'inversiones inmobiliarias'],
  authors: [{ name: 'RADIX Consultores Inmobiliarios' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'RADIX Consultores Inmobiliarios',
    title: 'RADIX Consultores Inmobiliarios',
    description: 'Firma premium de real estate. Salta · NOA · Argentina.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RADIX Consultores Inmobiliarios',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const instrumentSerifUrl =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
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
        {children}
      </body>
    </html>
  )
}
