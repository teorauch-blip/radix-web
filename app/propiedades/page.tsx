import { Suspense } from 'react'
import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getPropiedadesPublicas } from '@/lib/data/propiedades'
import { getFiltrosPropiedadesConfig } from '@/lib/data/web-config'
import { PropiedadesClient } from '@/components/propiedades/propiedades-client'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Propiedades',
  description: 'Portafolio completo de propiedades RADIX. Venta, alquiler y desarrollos en Salta y el NOA.',
}

// Esqueleto mínimo mientras el cliente hidrata
function FilterSkeleton() {
  return (
    <div className="mb-8 h-[88px] rounded-2xl bg-radix-surface/50 border border-radix-border animate-pulse" />
  )
}

export default async function PropiedadesPage() {
  const [rawProps, filtros] = await Promise.all([
    getPropiedadesPublicas({ limit: 50 }),
    getFiltrosPropiedadesConfig(),
  ])

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden pt-28">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#172A47] to-[#122137]" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 25%, rgba(14,96,175,0.18) 0%, transparent 65%)' }}
        />

        <div className="relative z-10 section-container pt-6 pb-28 lg:pt-8 lg:pb-40">

          {/* ── Encabezado — server rendered para SEO ── */}
          <div className="mb-10">
            <div className="label-tag mb-6">Portafolio</div>
            <h1 className="font-serif text-display-3 text-white">
              Propiedades
              <br />
              disponibles.
            </h1>
            <p className="text-radix-text-3 text-lg mt-6 max-w-lg leading-relaxed">
              Cada propiedad en nuestro portafolio es seleccionada con criterio. Sin relleno, sin improvisación.
            </p>
          </div>

          {/* ── Filtros + grilla — client component ── */}
          <Suspense fallback={<FilterSkeleton />}>
            <PropiedadesClient propiedades={rawProps} filtros={filtros} />
          </Suspense>

        </div>
      </main>
      <Footer />
    </>
  )
}
