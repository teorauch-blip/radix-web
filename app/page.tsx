import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { Inventory } from '@/components/home/inventory'
import { Valuations } from '@/components/home/valuations'
import { DataViz } from '@/components/home/data-viz'
import { MapSection } from '@/components/home/map-section'
import { ExperiencePanels } from '@/components/home/experience-panels'
import { Administration } from '@/components/home/administration'
import { Investments } from '@/components/home/investments'
import { Testimonials } from '@/components/home/testimonials'
import { CtaSection } from '@/components/home/cta-section'
import type { Metadata } from 'next'
import { getPropiedadesPublicas, getGaleriasRotacionHome, adaptPropiedad } from '@/lib/data/propiedades'
import { idsVisiblesInventario, ROTACION_MAX_IMAGENES, HOME_FETCH_LIMIT } from '@/lib/utils/inventario-home'
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
  getInventarioHomeConfig,
  getTasacionesHomeConfig,
  getSeoConfig,
} from '@/lib/data/web-config'
import { SITE_NAME, SITE_LOCALE, SITE_TITLE_DEFAULT, SITE_DESCRIPTION, absoluteUrl } from '@/lib/seo/site'
import { DEFAULT_OG_IMAGE, toMetaDescription } from '@/lib/seo/metadata'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoConfig()

  return {
    // El home usa el título por defecto (sin sufijo del template).
    title: {
      absolute: seo.defaultTitle || SITE_TITLE_DEFAULT,
    },
    description: toMetaDescription(seo.defaultDescription || SITE_DESCRIPTION),
    alternates: {
      canonical: absoluteUrl('/'),
    },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url: absoluteUrl('/'),
      siteName: SITE_NAME,
      title: seo.ogTitle || seo.defaultTitle || SITE_TITLE_DEFAULT,
      description: seo.ogDescription || seo.defaultDescription || SITE_DESCRIPTION,
      images: [{ url: seo.ogImage || DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || seo.defaultTitle || SITE_TITLE_DEFAULT,
      description: seo.ogDescription || seo.defaultDescription || SITE_DESCRIPTION,
      images: [seo.ogImage || DEFAULT_OG_IMAGE],
    },
  }
}

export default async function HomePage() {
  const [
    rawProps, contact, hero, sobreRadix, metricas, ctaFinal,
    territorio, servicios, administracion, inversiones, testimoniosConfig, inventario,
    tasaciones,
  ] = await Promise.all([
    getPropiedadesPublicas({ limit: HOME_FETCH_LIMIT }),
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
    getInventarioHomeConfig(),
    getTasacionesHomeConfig(),
  ])

  const base = rawProps.map(adaptPropiedad)

  // Galerías para la rotación automática de las tarjetas del inventario. Se piden solo
  // para las propiedades que el grid puede llegar a mostrar (no las ~50), y recortadas a
  // ROTACION_MAX_IMAGENES URLs cada una. Corre en build/revalidación, no por visitante.
  const portadaPorId = new Map(rawProps.map((p) => [p.id, p.imagen_portada_url]))
  const galerias = await getGaleriasRotacionHome(
    idsVisiblesInventario(base, inventario.maxDisplay).map((id) => ({
      id,
      portadaUrl: portadaPorId.get(id) ?? null,
    })),
    ROTACION_MAX_IMAGENES,
  )

  const properties = base.map((p) =>
    galerias[p.id] ? { ...p, images: galerias[p.id] } : p,
  )

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <Hero cms={hero} />

        {/* 2. Sobre Radix */}
        <Intro cms={sobreRadix} />

        {/* 3. Experiencia acumulada */}
        <DataViz metrics={metricas} />

        {/* 4. Presencia donde importa */}
        <MapSection cms={territorio} />

        {/* 5. Propiedades disponibles — datos reales */}
        <Inventory properties={properties} cms={inventario} />

        {/* 6. Tasaciones */}
        <Valuations cms={tasaciones} />

        {/* 7. Cada dimensión del mercado */}
        <ExperiencePanels cms={servicios} />

        {/* 8. Administración premium */}
        <Administration cms={administracion} />

        {/* 9. Inversiones y oportunidades */}
        <Investments cms={inversiones} />

        {/* 10. Testimonios */}
        <Testimonials
          testimonials={testimoniosConfig.items}
          cms={{
            label:     testimoniosConfig.label,
            titleLine1: testimoniosConfig.titleLine1,
            titleLine2: testimoniosConfig.titleLine2,
          }}
        />

        {/* 11. CTA premium — datos de contacto reales */}
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
