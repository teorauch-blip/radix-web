import { Metadata } from 'next'
import Image from 'next/image'
import { Linkedin, Mail } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { COMPANY, COMPANY_ABOUT } from '@/lib/content/company'
import { getEquipoNosotrosConfig } from '@/lib/data/web-config'
import type { EquipoMiembro } from '@/lib/types/db'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Nosotros · RADIX',
  description:
    'Empresa familiar con más de 17 años en el mercado inmobiliario de Salta. Conocé nuestra historia y equipo.',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

function MemberCard({ member }: { member: EquipoMiembro }) {
  const hasLinks = member.linkedinUrl || member.email
  return (
    <div className="bg-radix-surface border border-radix-border rounded-2xl p-8 flex flex-col gap-5 hover:border-radix-border-2 transition-colors duration-300">
      {/* Avatar + Identidad */}
      <div className="flex items-start gap-5">
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          {member.fotoUrl ? (
            <Image
              src={member.fotoUrl}
              alt={member.nombre}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full bg-radix-gradient flex items-center justify-center">
              <span className="text-white font-semibold text-sm tracking-wide">
                {getInitials(member.nombre)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="text-white text-base font-light leading-snug">
            {member.nombre}
          </div>
          <div className="text-radix-text-4 text-[0.65rem] mt-1 uppercase tracking-[0.1em]">
            {member.cargo}
          </div>
        </div>
      </div>

      {/* Descripción */}
      {member.descripcion && (
        <p className="text-radix-text-3 text-sm leading-relaxed flex-1">
          {member.descripcion}
        </p>
      )}

      {/* Links */}
      {hasLinks && (
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-radix-border">
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-radix-text-4 hover:text-radix-text-2 transition-colors duration-200"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-1.5 text-xs text-radix-text-4 hover:text-radix-text-2 transition-colors duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              {member.email}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default async function NosotrosPage() {
  const equipo = await getEquipoNosotrosConfig()

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

          {/* Equipo */}
          <div id="equipo" className="pt-16 border-t border-white/[0.07]">
            <div className="label-tag mb-6">{equipo.sectionLabel}</div>
            <h2 className="font-serif text-display-3 text-white mb-12">
              {equipo.titleLine1}
              <br />
              <span className="italic font-normal text-radix-text-2">{equipo.titleLine2}</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipo.items.map((member) => (
                <MemberCard key={member.nombre} member={member} />
              ))}
            </div>
          </div>

          {/* Historia */}
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
