import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { Inventory } from '@/components/home/inventory'
import { DataViz } from '@/components/home/data-viz'
import { MapSection } from '@/components/home/map-section'
import { ExperiencePanels } from '@/components/home/experience-panels'
import { Administration } from '@/components/home/administration'
import { Investments } from '@/components/home/investments'
import { Testimonials } from '@/components/home/testimonials'
import { CtaSection } from '@/components/home/cta-section'
import { getPropiedadesPublicas, adaptPropiedad } from '@/lib/data/propiedades'
import { getContactConfig } from '@/lib/data/web-config'
import { TESTIMONIALS } from '@/lib/mock-data'

export const revalidate = 300

export default async function HomePage() {
  const [rawProps, contact] = await Promise.all([
    getPropiedadesPublicas({ limit: 9 }),
    getContactConfig(),
  ])

  const properties = rawProps.map(adaptPropiedad)

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <Hero />

        {/* 2. Sobre Radix */}
        <Intro />

        {/* 3. Propiedades disponibles — datos reales */}
        <Inventory properties={properties} />

        {/* 4. Experiencia acumulada */}
        <DataViz />

        {/* 5. Presencia donde importa */}
        <MapSection />

        {/* 6. Cada dimensión del mercado */}
        <ExperiencePanels />

        {/* 7. Administración premium */}
        <Administration />

        {/* 8. Inversiones y oportunidades */}
        <Investments />

        {/* 9. Testimonios — TODO: conectar a DB */}
        <Testimonials testimonials={TESTIMONIALS} />

        {/* 10. CTA premium — datos de contacto reales */}
        <CtaSection
          phone={contact.phone}
          phoneHref={contact.phone_href}
          email={contact.email}
          hours={contact.hours}
        />
      </main>

      <Footer />
    </>
  )
}
