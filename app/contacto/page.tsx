import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react'
import { whatsappUrl, WHATSAPP_DEFAULT_MSG } from '@/lib/content/contact'
import { getContactConfig } from '@/lib/data/web-config'
import { LeadForm } from '@/components/property/lead-form'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contacto · RADIX',
  description:
    'Contactate con RADIX. Estamos en Salta Capital, listos para acompañarte en tu próxima operación inmobiliaria.',
}

export default async function ContactoPage() {
  const contact = await getContactConfig()
  const wa = whatsappUrl(WHATSAPP_DEFAULT_MSG)
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
          <div className="label-tag mb-8">Contacto</div>

          <h1 className="font-serif text-display-2 text-white mb-6 max-w-2xl">
            El primer paso es
            <br />
            <span className="italic font-normal text-radix-text-2">una conversación.</span>
          </h1>

          <p className="text-radix-text-3 text-lg leading-relaxed max-w-xl mb-16">
            Contanos qué buscás. Nuestro equipo analiza tu situación y te presenta opciones
            concretas, sin rodeos.
          </p>

          {/* Primary actions */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-16">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-8 bg-radix-blue/10 border border-radix-blue/25 rounded-2xl hover:border-radix-blue/50 hover:bg-radix-blue/[0.15] transition-all duration-500"
            >
              <div className="text-xs text-radix-blue uppercase tracking-[0.15em] mb-3">
                WhatsApp
              </div>
              <div className="text-white text-lg font-light mb-2">Escribir ahora</div>
              <div className="text-radix-text-4 text-sm flex-1">
                Respondemos a la brevedad en horario de atención.
              </div>
              <ArrowUpRight className="w-5 h-5 text-radix-blue mt-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="group flex flex-col p-8 bg-radix-surface border border-radix-border rounded-2xl hover:border-radix-border-2 transition-all duration-500"
            >
              <div className="text-xs text-radix-text-4 uppercase tracking-[0.15em] mb-3">
                Email
              </div>
              <div className="text-white text-lg font-light mb-2">{contact.email}</div>
              <div className="text-radix-text-4 text-sm flex-1">
                Para consultas formales o envío de documentación.
              </div>
              <ArrowUpRight className="w-5 h-5 text-radix-text-4 mt-6 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Lead form */}
          <div className="max-w-2xl mb-16">
            <div className="text-xs text-radix-text-4 uppercase tracking-[0.15em] mb-4">
              O dejanos tu consulta
            </div>
            <div className="bg-radix-surface/40 border border-radix-border rounded-2xl p-7 lg:p-8">
              <LeadForm />
            </div>
          </div>

          {/* Info strip */}
          <div className="flex flex-wrap gap-8 lg:gap-14 pt-10 border-t border-white/[0.07]">
            {contact.phone && (
              <div className="flex items-center gap-3 text-sm text-radix-text-4">
                <Phone className="w-4 h-4 flex-shrink-0" />
                {contact.phone}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-radix-text-4">
              <Mail className="w-4 h-4 flex-shrink-0" />
              {contact.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-radix-text-4">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {contact.address}
            </div>
            <div className="flex items-center gap-3 text-sm text-radix-text-4">
              <Clock className="w-4 h-4 flex-shrink-0" />
              {contact.hours}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
