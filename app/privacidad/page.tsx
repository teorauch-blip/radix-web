import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad · RADIX',
}

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#172A47] to-[#122137]" />
        <div className="relative z-10 section-container pt-6 pb-28 lg:pt-10 lg:pb-40 max-w-3xl">
          <div className="label-tag mb-8">Legal</div>
          <h1 className="font-serif text-display-3 text-white mb-8">Política de Privacidad</h1>

          <div className="prose prose-invert text-radix-text-3 leading-relaxed space-y-6 text-base">
            <p>
              RADIX Consultores Inmobiliarios recopila y utiliza la información personal que los
              usuarios proporcionan en esta web exclusivamente para responder consultas y brindar
              asesoramiento inmobiliario.
            </p>
            <p>
              Los datos personales no serán cedidos a terceros sin consentimiento expreso del
              titular, salvo obligación legal. Podés ejercer tus derechos de acceso,
              rectificación y cancelación escribiendo a{' '}
              <a
                href="mailto:info@radixconsultores.com"
                className="text-radix-blue hover:text-radix-blue-light transition-colors"
              >
                info@radixconsultores.com
              </a>
              .
            </p>
            <p className="text-radix-text-4 text-sm">
              Este documento está sujeto a actualización. Última revisión: 2025.
            </p>
          </div>

          <div className="mt-12">
            <Link href="/" className="btn-ghost text-sm">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
