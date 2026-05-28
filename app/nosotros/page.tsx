import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { COMPANY, COMPANY_ABOUT } from '@/lib/content/company'

export const metadata: Metadata = {
  title: 'Nosotros · RADIX',
  description:
    'Empresa familiar con más de 17 años en el mercado inmobiliario de Salta. Conocé nuestra historia y equipo.',
}

export default function NosotrosPage() {
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
          <div className="label-tag mb-8">{COMPANY_ABOUT.label}</div>

          <div className="grid lg:grid-cols-12 gap-16 items-start mb-24">
            <div className="lg:col-span-5">
              <h1 className="font-serif text-display-2 text-white">
                {COMPANY_ABOUT.headlineLines[0]}
                <br />
                <span className="italic font-normal text-radix-text-2">
                  {COMPANY_ABOUT.headlineLines[1]}
                </span>
              </h1>
            </div>

            <div className="lg:col-span-7 lg:pt-12 space-y-6">
              {COMPANY_ABOUT.paragraphs.map((text, i) => (
                <p
                  key={i}
                  className={`text-lg leading-relaxed ${
                    i === 0 ? 'text-radix-text-2' : 'text-radix-text-3'
                  }`}
                >
                  {text}
                </p>
              ))}

              <div className="pt-8 border-t border-white/[0.07]">
                <div className="flex flex-wrap gap-10 mt-8">
                  {COMPANY_ABOUT.details.map((item) => (
                    <div key={item.label}>
                      <div className="text-sm font-medium text-radix-text-2">{item.label}</div>
                      <div className="text-xs text-radix-text-4 mt-1">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team stub */}
          <div id="equipo" className="pt-16 border-t border-white/[0.07]">
            <div className="label-tag mb-8">Equipo</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-radix-surface border border-radix-border rounded-2xl p-8">
                <div className="w-14 h-14 rounded-full bg-radix-surface-2 mb-5" />
                <div className="text-white text-base font-light">{COMPANY.founder}</div>
                <div className="text-radix-text-4 text-xs mt-1 uppercase tracking-wider">
                  Fundadora · Directora
                </div>
              </div>
            </div>
          </div>

          {/* History stub */}
          <div id="historia" className="pt-20 border-t border-white/[0.07] mt-20">
            <div className="label-tag mb-8">Trayectoria</div>
            <p className="text-radix-text-3 text-lg max-w-xl leading-relaxed">
              Más de {COMPANY.yearsActive} años construyendo relaciones y operaciones inmobiliarias
              en {COMPANY.location} y la región NOA.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
