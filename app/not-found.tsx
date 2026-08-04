import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscás no existe o fue movida.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
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

        <div className="relative z-10 section-container pt-6 pb-28 lg:pt-10 lg:pb-40 max-w-3xl">
          <div className="label-tag mb-8">Error 404</div>

          <h1 className="font-serif text-display-2 text-white mb-6">
            Esta página
            <br />
            <span className="italic font-normal text-radix-text-2">no existe.</span>
          </h1>

          <p className="text-radix-text-3 text-lg leading-relaxed max-w-xl mb-12">
            Puede que el enlace esté desactualizado o que la propiedad ya no esté publicada.
            Explorá el portafolio disponible o escribinos y te ayudamos.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/propiedades" className="btn-primary">
              Ver propiedades
            </Link>
            <Link href="/contacto" className="btn-ghost">
              Contactar
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
