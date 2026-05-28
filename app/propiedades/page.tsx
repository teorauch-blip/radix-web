import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PropertyCard } from '@/components/property/property-card'
import { getPropiedadesPublicas, adaptPropiedad } from '@/lib/data/propiedades'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Propiedades',
  description: 'Portafolio completo de propiedades RADIX. Venta, alquiler y desarrollos en Salta y el NOA.',
}

export default async function PropiedadesPage() {
  const rawProps = await getPropiedadesPublicas({ limit: 50 })
  const properties = rawProps.map(adaptPropiedad)

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden pt-28">
        {/* Background — hero atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#172A47] to-[#122137]" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 25%, rgba(14,96,175,0.18) 0%, transparent 65%)' }}
        />
        <div className="relative z-10 section-container pt-6 pb-28 lg:pt-8 lg:pb-40">
          <div className="mb-14">
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

          {properties.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-radix-text-4 text-sm">
                Estamos actualizando el portafolio. Volvé pronto.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
