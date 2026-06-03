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
import {
  getContactConfig,
  getHeroConfig,
  getSobreRadixConfig,
  getMetricasConfig,
  getCtaFinalConfig,
  getTeritorioConfig,
  getServiciosConfig,
  getAdministracionHomeConfig,
  getInversionesHomeConfig,
  getTestimoniosConfig,
} from '@/lib/data/web-config'

export const revalidate = 300

export default async function HomePage() {
  const [
    rawProps, contact, hero, sobreRadix, metricas, ctaFinal,
    territorio, servicios, administracion, inversiones, testimoniosConfig,
  ] = await Promise.all([
    getPropiedadesPublicas({ limit: 9 }),
    getContactConfig(),
    getHeroConfig(),
    getSobreRadixConfig(),
    getMetricasConfig(),
    getCtaFinalConfig(),
    getTeritorioConfig(),
    getServiciosConfig(),
    getAdministracionHomeConfig(),
    getInversionesHomeConfig(),
    getTestimoniosConfig(),
  ])

  // LOG TEMPORAL — ver en terminal del servidor
  console.log('[home] hero resolved:',      JSON.stringify(hero))
  console.log('[home] sobreRadix resolved:', JSON.stringify(sobreRadix))
  console.log('[home] metricas resolved:',  JSON.stringify(metricas))
  console.log('[home] ctaFinal resolved:',  JSON.stringify(ctaFinal))

  const properties = rawProps.map(adaptPropiedad)

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <Hero cms={hero} />

        {/* 2. Sobre Radix */}
        <Intro cms={sobreRadix} />

        {/* 3. Propiedades disponibles — datos reales */}
        <Inventory properties={properties} />

        {/* 4. Experiencia acumulada */}
        <DataViz metrics={metricas} />

        {/* 5. Presencia donde importa */}
        <MapSection cms={territorio} />

        {/* 6. Cada dimensión del mercado */}
        <ExperiencePanels cms={servicios} />

        {/* 7. Administración premium */}
        <Administration cms={administracion} />

        {/* 8. Inversiones y oportunidades */}
        <Investments cms={inversiones} />

        {/* 9. Testimonios */}
        <Testimonials
          testimonials={testimoniosConfig.items}
          cms={{
            label:     testimoniosConfig.label,
            titleLine1: testimoniosConfig.titleLine1,
            titleLine2: testimoniosConfig.titleLine2,
          }}
        />

        {/* 10. CTA premium — datos de contacto reales */}
        <CtaSection
          phone={contact.phone}
          phoneHref={contact.phone_href}
          email={contact.email}
          hours={contact.hours}
          ctaLabel={ctaFinal.ctaLabel}
          headline1={ctaFinal.headline1}
          headline2={ctaFinal.headline2}
          subtitle={ctaFinal.subtitle}
          primaryCtaLabel={ctaFinal.primaryCtaLabel}
          primaryCtaHref={ctaFinal.primaryCtaHref}
          locationLine={ctaFinal.locationLine}
        />
      </main>

      <Footer />
    </>
  )
}
