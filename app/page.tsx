import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { ExperiencePanels } from '@/components/home/experience-panels'
import { FeaturedProperties } from '@/components/home/featured-properties'
import { MapSection } from '@/components/home/map-section'
import { Administration } from '@/components/home/administration'
import { Inventory } from '@/components/home/inventory'
import { Investments } from '@/components/home/investments'
import { DataViz } from '@/components/home/data-viz'
import { Testimonials } from '@/components/home/testimonials'
import { CtaSection } from '@/components/home/cta-section'
import { FEATURED_PROPERTIES, TESTIMONIALS } from '@/lib/mock-data'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero cinematográfico fullscreen */}
        <Hero />

        {/* 2. Intro institucional */}
        <Intro />

        {/* 3. Experience panels */}
        <ExperiencePanels />

        {/* 4. Propiedades destacadas */}
        <FeaturedProperties properties={FEATURED_PROPERTIES} />

        {/* 5. Mapa interactivo */}
        <MapSection />

        {/* 6. Administración premium */}
        <Administration />

        {/* 7. Inventario dinámico */}
        <Inventory properties={FEATURED_PROPERTIES} />

        {/* 8. Inversiones y oportunidades */}
        <Investments />

        {/* 9. Visualización de datos */}
        <DataViz />

        {/* 10. Testimonios */}
        <Testimonials testimonials={TESTIMONIALS} />

        {/* 11. CTA premium */}
        <CtaSection />
      </main>

      {/* 12. Footer cinematográfico */}
      <Footer />
    </>
  )
}
