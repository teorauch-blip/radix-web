import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getAllPropiedadesPublicas } from '@/lib/data/propiedades'
import { getContactConfig, getFiltrosPropiedadesConfig } from '@/lib/data/web-config'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/lib/seo/json-ld'
import {
  applyPropiedadesFilters,
  firstParam,
  ordenarParaListado,
  readFiltrosActivos,
} from '@/lib/utils/filtros'
import { whatsappHrefOrContacto } from '@/lib/utils/contacto'
import { WHATSAPP_MSG_PROPIEDADES_SALTA } from '@/lib/content/contact'
import { LandingViewTracker } from '@/components/landing/landing-view-tracker'
import { LandingWhatsAppCta } from '@/components/landing/landing-whatsapp-cta'
import { TrustStrip } from '@/components/landing/trust-strip'
import { PropiedadesSaltaClient } from '@/components/landing/propiedades-salta-client'
// Importado del módulo neutro, NO del componente de cliente: cruzar la frontera
// con un valor que no es un componente devuelve una referencia de cliente, no el
// número. Ver components/landing/constants.ts.
import { LANDING_MAX_RESULTADOS } from '@/components/landing/constants'

const RUTA = '/propiedades-en-salta'

// Mismo ISR que /propiedades: los datos del CMS y del inventario se cachean 5
// minutos. La página se renderiza por request porque lee `searchParams` (ver
// abajo), pero ese render trabaja sobre datos ya cacheados — no hay una ida a
// Supabase por visitante.
export const revalidate = 300

/**
 * Metadata propia, escrita palabra por palabra.
 *
 * `titleAbsolute` evita el template `%s — RADIX` del layout: el título ya
 * termina en "| RADIX" y si no, saldría duplicado.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Propiedades en Salta | Casas, Departamentos y Terrenos | RADIX',
  titleAbsolute: true,
  description:
    'Encontrá propiedades en venta y alquiler en Salta. Casas, departamentos, terrenos y locales seleccionados por RADIX Consultores Inmobiliarios.',
  path: RUTA,
})

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Landing de Google Ads — /propiedades-en-salta
 *
 * Es la pantalla de aterrizaje de las campañas: hero corto, filtros, seis
 * propiedades, cierre. Nada institucional. La versión completa del portafolio
 * es /propiedades y a ahí lleva el CTA principal de los resultados.
 *
 * ─── Por qué lee searchParams ───
 * Hacerlo vuelve la ruta dinámica (no se prerenderiza), y a cambio una URL de
 * anuncio con filtros —?operacion=alquiler&ubicacion=tres cerritos— sale del
 * servidor ya filtrada, con sus tarjetas en el HTML inicial. La alternativa
 * (página estática + filtrar en el cliente) obliga a un parpadeo o a un
 * Suspense que saca la grilla del HTML, y las dos cosas empeoran justo lo que
 * esta página tiene que hacer bien.
 *
 * ─── Presupuesto de JavaScript ───
 * Todo lo que está arriba del pliegue —H1, subtítulo, CTAs— es HTML del
 * servidor y no espera a que hidrate nada. Los únicos componentes de cliente
 * son el CTA de WhatsApp (por la conversión), el bloque de filtros/resultados
 * y el tracker de la vista, que no pinta nada.
 */
export default async function PropiedadesEnSaltaPage({ searchParams }: PageProps) {
  const params = await searchParams

  const [inventario, filtros, contact] = await Promise.all([
    getAllPropiedadesPublicas(),
    getFiltrosPropiedadesConfig(),
    getContactConfig(),
  ])

  // Filtros iniciales desde la URL, con el mismo parser que usa /propiedades.
  const initialFiltros = readFiltrosActivos((key) => firstParam(params[key]))

  // Se ordena UNA vez, acá: destacadas primero y después las más recientes.
  // Como `applyPropiedadesFilters` usa `.filter()`, que preserva el orden,
  // cualquier subconjunto que arme el cliente hereda esta prioridad.
  const ordenadas = ordenarParaListado(inventario)

  // Mismo cálculo que hará el cliente en su primer render — de ahí sale el
  // ItemList del JSON-LD, que así describe exactamente las tarjetas que se ven.
  const visibles = applyPropiedadesFilters(ordenadas, initialFiltros, filtros.ubicaciones).slice(
    0,
    LANDING_MAX_RESULTADOS,
  )

  // Número del CMS. Si no hay uno válido, el CTA cae a /contacto: nunca se
  // inventa un teléfono. Ver lib/utils/contacto.ts.
  const cta = whatsappHrefOrContacto(contact.whatsapp_number, WHATSAPP_MSG_PROPIEDADES_SALTA)

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Propiedades en Salta', path: RUTA },
          ]),
          itemListSchema(
            visibles.map((p) => ({ slug: p.slug, titulo: p.titulo_web ?? p.codigo })),
          ),
        ]}
      />

      <Header />

      <main className="relative min-h-screen overflow-hidden">
        {/* Fondo — mismo tratamiento que /propiedades, para que la landing se
            lea como parte del sitio y no como una página ajena. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#172A47] to-[#122137]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(14,96,175,0.18) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />

        <div className="section-container relative z-10 pb-20 pt-24 sm:pt-28 lg:pb-28 lg:pt-32">
          {/* ══ Hero compacto ══
              Sin altura completa, sin animaciones de entrada y sin imagen: el
              usuario llega de un anuncio y tiene que entender de qué se trata
              esto sin scrollear ni esperar. */}
          <header className="max-w-2xl">
            <h1 className="font-serif text-heading-1 text-white sm:text-display-3">
              Propiedades en Salta
            </h1>
            <p className="mt-4 max-w-lg text-base font-light leading-relaxed text-radix-text-2 sm:text-lg">
              Encontrá casas, departamentos, terrenos y locales en venta o alquiler.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#propiedades" className="btn-primary w-full justify-center sm:w-auto">
                Ver propiedades
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <LandingWhatsAppCta
                href={cta.href}
                isWhatsApp={cta.isWhatsApp}
                ubicacion="hero"
                className="btn-ghost w-full justify-center sm:w-auto"
              >
                Consultar por WhatsApp
              </LandingWhatsAppCta>
            </div>
          </header>

          {/* ══ Filtros + resultados + cierre ══ */}
          <section
            id="propiedades"
            aria-label="Propiedades disponibles en Salta"
            className="mt-10 scroll-mt-24 lg:mt-12"
          >
            <PropiedadesSaltaClient
              propiedades={ordenadas}
              filtros={filtros}
              initialFiltros={initialFiltros}
              whatsappHref={cta.href}
              whatsappIsReal={cta.isWhatsApp}
            />
          </section>
        </div>
      </main>

      <TrustStrip />
      <Footer />

      <LandingViewTracker ruta={RUTA} />
    </>
  )
}
