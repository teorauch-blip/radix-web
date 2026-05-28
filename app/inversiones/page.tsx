import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { whatsappUrl } from '@/lib/content/contact'
import { INVESTMENT_AREAS } from '@/lib/content/home'
import { getContactConfig } from '@/lib/data/web-config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Inversiones · RADIX',
  description:
    'Oportunidades de inversión inmobiliaria en Salta y el NOA. Lotes estratégicos, proyectos en pozo y activos de renta.',
}

export default async function InversionesPage() {
  const contact = await getContactConfig()
  const wa = whatsappUrl('Hola, estoy interesado en oportunidades de inversión inmobiliaria en Salta. ¿Podría obtener más información?')
  return (
    <>
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
          <div className="label-tag mb-8">Inversiones</div>

          <h1 className="font-serif text-display-2 text-white mb-6 max-w-2xl">
            Capital en
            <br />
            <span className="italic font-normal text-radix-text-2">movimiento.</span>
          </h1>

          <p className="text-radix-text-3 text-lg leading-relaxed max-w-xl mb-16">
            El NOA tiene un mercado en crecimiento sostenido. RADIX acompaña operaciones de
            inversión con criterio profesional y conocimiento local del mercado salteño.
          </p>

          {/* Zones */}
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {INVESTMENT_AREAS.map((area) => (
              <div
                key={area.title}
                className="bg-radix-surface border border-radix-border rounded-2xl p-8 hover:border-radix-border-2 transition-all duration-500"
              >
                <div className="highlight-badge mb-6">{area.badge}</div>
                <h3 className="text-white text-lg font-light mb-3">{area.title}</h3>
                <p className="text-radix-text-4 text-sm leading-relaxed mb-6">{area.description}</p>
                <div className="text-xs text-radix-text-4 tracking-wider">{area.type}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4"
            >
              Consultar oportunidades
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link href="/propiedades" className="btn-ghost text-base px-8 py-4">
              Ver portafolio disponible
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
