import { Metadata } from 'next'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { whatsappUrl } from '@/lib/content/contact'
import { getContactConfig } from '@/lib/data/web-config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Administración · RADIX',
  description:
    'Administración profesional de propiedades en Salta. Gestión integral de carteras inmobiliarias con informes periódicos.',
}

const FEATURES = [
  'Gestión de cobros y liquidaciones mensuales',
  'Seguimiento de contratos y vencimientos',
  'Coordinación de mantenimiento y reparaciones',
  'Informes de rendimiento periódicos',
  'Atención a inquilinos',
  'Asesoramiento en renovaciones y ajustes',
]

export default async function AdministracionPage() {
  const contact = await getContactConfig()
  const wa = whatsappUrl('Hola, me interesa el servicio de administración de propiedades de RADIX. ¿Podría obtener más información?')

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
          <div className="label-tag mb-8">Administración</div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h1 className="font-serif text-display-2 text-white mb-6">
                Tu patrimonio,
                <br />
                <span className="italic font-normal text-radix-text-2">en orden.</span>
              </h1>
              <p className="text-radix-text-3 text-lg leading-relaxed mb-10">
                Gestionamos tu cartera inmobiliaria con la misma exigencia que aplicamos a
                nuestras propias operaciones. Transparencia, puntualidad y criterio profesional
                en cada gestión.
              </p>

              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base px-8 py-4"
              >
                Consultar el servicio
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-radix-surface border border-radix-border rounded-2xl p-8">
              <div className="text-xs text-radix-text-4 uppercase tracking-[0.18em] mb-8">
                Gestión integral incluye
              </div>
              <ul className="space-y-4">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-radix-text-2">
                    <CheckCircle2 className="w-4 h-4 text-radix-blue flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
