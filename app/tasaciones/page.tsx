import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WHATSAPP_MSG_TASACIONES } from '@/lib/content/contact'
import { getContactConfig } from '@/lib/data/web-config'
import { whatsappHrefOrContacto } from '@/lib/utils/contacto'
import { TrackedWhatsAppLink } from '@/components/analytics/tracked-whatsapp-link'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLd, breadcrumbSchema, serviceSchema } from '@/lib/seo/json-ld'
import { TasacionForm } from '@/components/tasaciones/tasacion-form'

export const revalidate = 3600

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Tasaciones inmobiliarias en Salta',
    description:
      'Solicitá una tasación profesional de tu casa, departamento, terreno, local u oficina en Salta. Análisis de mercado, comparables y asesoramiento personalizado.',
    path: '/tasaciones',
  }),
  // Título completo pedido para el <title> (sin el sufijo del template).
  title: {
    absolute: 'Tasaciones inmobiliarias en Salta | RADIX Consultores Inmobiliarios',
  },
}

// ─── Contenido ────────────────────────────────────────────────

const FACTORES = [
  'Ubicación',
  'Tipología',
  'Superficie',
  'Estado de conservación',
  'Calidad constructiva',
  'Entorno',
  'Oferta comparable',
  'Operaciones reales',
  'Potencial comercial',
  'Condiciones actuales del mercado',
]

const TIPOS_TASACION = [
  {
    badge: 'Venta',
    title: 'Tasación para venta',
    description:
      'Definir un precio competitivo y coherente para salir al mercado.',
  },
  {
    badge: 'Alquiler',
    title: 'Tasación para alquiler',
    description:
      'Estimar una renta razonable según propiedad, zona y demanda.',
  },
  {
    badge: 'Inversión',
    title: 'Tasación para inversión',
    description:
      'Analizar valor, renta posible, recupero y potencial.',
  },
  {
    badge: 'Patrimonio',
    title: 'Tasación patrimonial',
    description:
      'Contar con una referencia profesional para decisiones familiares, societarias o patrimoniales.',
  },
]

const PROCESO = [
  {
    step: '01',
    title: 'Relevamiento',
    description: 'Conocemos la propiedad y recopilamos sus características.',
  },
  {
    step: '02',
    title: 'Análisis',
    description: 'Estudiamos mercado, comparables y antecedentes.',
  },
  {
    step: '03',
    title: 'Valuación',
    description: 'Definimos un rango de valor con fundamentos.',
  },
  {
    step: '04',
    title: 'Entrega y asesoramiento',
    description: 'Explicamos el resultado y recomendamos una estrategia.',
  },
]

const DIFERENCIALES = [
  'Conocimiento del mercado inmobiliario de Salta',
  'Experiencia acumulada en operaciones concretas',
  'Análisis de comparables reales',
  'Criterio comercial, no solo teórico',
  'Presentación profesional del resultado',
  'Acompañamiento posterior para venta, alquiler o inversión',
]

export default async function TasacionesPage() {
  const contact = await getContactConfig()
  // Número del CMS; si no hay uno válido, el botón lleva a /contacto.
  const asesor = whatsappHrefOrContacto(
    contact.whatsapp_number,
    contact.whatsapp_message ?? WHATSAPP_MSG_TASACIONES,
  )

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: 'Tasaciones inmobiliarias',
            description:
              'Tasación profesional de casas, departamentos, terrenos, locales y oficinas en Salta, con análisis de mercado, comparables y asesoramiento personalizado.',
            path: '/tasaciones',
            ofertas: TIPOS_TASACION.map(t => ({
              name: t.title,
              description: t.description,
            })),
          }),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Tasaciones', path: '/tasaciones' },
          ]),
        ]}
      />
      <Header />

      <main className="min-h-screen relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#172A47] to-[#122137]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 50% 20%, rgba(14,96,175,0.15) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-10 section-container pt-6 pb-28 lg:pt-10 lg:pb-40">

          {/* ── A. Hero ── */}
          <section>
            <div className="label-tag mb-8">Tasaciones inmobiliarias</div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h1 className="font-serif text-display-2 text-white mb-6">
                  Conocé el valor real
                  <br />
                  <span className="italic font-normal text-radix-text-2">
                    de tu propiedad.
                  </span>
                </h1>
                <p className="text-radix-text-3 text-lg leading-relaxed mb-10 max-w-xl">
                  Una tasación profesional combina análisis de mercado, conocimiento local
                  y criterio comercial para definir un valor serio, competitivo y defendible.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#solicitar" className="btn-primary text-base px-8 py-4">
                    Solicitar una tasación
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <TrackedWhatsAppLink
                    href={asesor.href}
                    {...(asesor.isWhatsApp
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="btn-ghost text-base px-8 py-4"
                  >
                    Hablar con un asesor
                  </TrackedWhatsAppLink>
                </div>
              </div>

              {/* B. Qué se analiza */}
              <div className="bg-radix-surface border border-radix-border rounded-2xl p-8">
                <div className="text-xs text-radix-text-4 uppercase tracking-[0.18em] mb-4">
                  Qué analizamos
                </div>
                <p className="text-radix-text-3 text-sm leading-relaxed mb-7">
                  Tasar no es mirar publicaciones. Un valor bien estimado surge de cruzar
                  las características concretas del inmueble con lo que efectivamente
                  ocurre en el mercado.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {FACTORES.map(f => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-radix-text-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-radix-blue flex-shrink-0 mt-1" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── C. Tipos de tasación ── */}
          <section className="mt-28 lg:mt-36">
            <div className="label-tag mb-6">Tipos de tasación</div>
            <h2 className="font-serif text-display-3 text-white mb-6 max-w-2xl">
              Cada decisión necesita
              <br />
              <span className="italic font-normal text-radix-text-2">su propio análisis.</span>
            </h2>
            <p className="text-radix-text-3 text-lg leading-relaxed max-w-xl mb-14">
              El mismo inmueble puede valer distinto según qué querés hacer con él.
              Ajustamos el enfoque al objetivo.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TIPOS_TASACION.map(t => (
                <div
                  key={t.title}
                  className="bg-radix-surface border border-radix-border rounded-2xl p-8 hover:border-radix-border-2 transition-all duration-500"
                >
                  <div className="highlight-badge mb-6">{t.badge}</div>
                  <h3 className="text-white text-lg font-light mb-3">{t.title}</h3>
                  <p className="text-radix-text-4 text-sm leading-relaxed">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── D. Proceso ── */}
          <section className="mt-28 lg:mt-36">
            <div className="label-tag mb-6">Proceso</div>
            <h2 className="font-serif text-display-3 text-white mb-14 max-w-2xl">
              Cómo trabajamos
              <br />
              <span className="italic font-normal text-radix-text-2">una tasación.</span>
            </h2>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROCESO.map(p => (
                <li
                  key={p.step}
                  className="bg-radix-surface border border-radix-border rounded-2xl p-8 flex flex-col"
                >
                  <div className="font-mono text-radix-gold text-xs tracking-[0.2em] mb-6">
                    {p.step}
                  </div>
                  <h3 className="text-white text-lg font-light mb-3">{p.title}</h3>
                  <p className="text-radix-text-4 text-sm leading-relaxed">
                    {p.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* ── E. Diferenciales ── */}
          <section className="mt-28 lg:mt-36">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <div className="label-tag mb-6">Por qué RADIX</div>
                <h2 className="font-serif text-display-3 text-white mb-6">
                  Criterio construido
                  <br />
                  <span className="italic font-normal text-radix-text-2">operando el mercado.</span>
                </h2>
                <p className="text-radix-text-3 text-lg leading-relaxed mb-8">
                  Tasamos con la información de quien vende, alquila y administra
                  propiedades en Salta todos los días. Esa práctica es la que separa
                  un número estimado de un valor defendible.
                </p>
                <p className="text-radix-text-4 text-sm leading-relaxed">
                  ¿Ya tenés la propiedad en renta? Conocé también nuestro servicio de{' '}
                  <Link
                    href="/administracion"
                    className="text-radix-blue hover:text-radix-blue-light transition-colors"
                  >
                    administración de propiedades
                  </Link>
                  .
                </p>
              </div>

              <ul className="bg-radix-surface border border-radix-border rounded-2xl p-8 space-y-4">
                {DIFERENCIALES.map(d => (
                  <li key={d} className="flex items-start gap-3 text-sm text-radix-text-2">
                    <CheckCircle2 className="w-4 h-4 text-radix-blue flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── F. Formulario ── */}
          <section id="solicitar" className="mt-28 lg:mt-36 scroll-mt-28">
            <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 items-start">
              <div>
                <div className="label-tag mb-6">Solicitud</div>
                <h2 className="font-serif text-display-3 text-white mb-6">
                  Pedí tu tasación.
                </h2>
                <p className="text-radix-text-3 text-lg leading-relaxed mb-8">
                  Completá los datos de la propiedad y un asesor se contacta para
                  coordinar el relevamiento. Cuanta más información nos des, más
                  precisa es la estimación inicial.
                </p>
                <p className="text-radix-text-4 text-sm leading-relaxed">
                  ¿Preferís hablar antes?{' '}
                  <Link
                    href="/contacto"
                    className="text-radix-blue hover:text-radix-blue-light transition-colors"
                  >
                    Escribinos desde Contacto
                  </Link>
                  .
                </p>
              </div>

              <div className="bg-radix-surface border border-radix-border rounded-2xl p-8 lg:p-10">
                <TasacionForm />
              </div>
            </div>
          </section>

          {/* ── G. CTA final ── */}
          <section className="mt-28 lg:mt-36">
            <div className="bg-radix-surface border border-radix-border rounded-2xl p-10 lg:p-16 text-center">
              <h2 className="font-serif text-display-3 text-white mb-5 max-w-2xl mx-auto">
                Una buena decisión comienza con un valor bien estimado.
              </h2>
              <p className="text-radix-text-3 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                Solicitá una tasación profesional y conocé el potencial real de tu inmueble.
              </p>
              <Link href="#solicitar" className="btn-primary text-base px-8 py-4">
                Solicitar tasación
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
