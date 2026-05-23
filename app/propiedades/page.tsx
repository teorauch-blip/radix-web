import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PropertyCard } from '@/components/property/property-card'
import { FEATURED_PROPERTIES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Propiedades',
  description: 'Portafolio completo de propiedades RADIX. Venta, alquiler y desarrollos en Salta y Buenos Aires.',
}

export default function PropiedadesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-radix-void pt-28">
        <div className="section-container section-padding">
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_PROPERTIES.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
