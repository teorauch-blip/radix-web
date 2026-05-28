import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Términos y Condiciones · RADIX',
}

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#172A47] to-[#122137]" />
        <div className="relative z-10 section-container pt-6 pb-28 lg:pt-10 lg:pb-40 max-w-3xl">
          <div className="label-tag mb-8">Legal</div>
          <h1 className="font-serif text-display-3 text-white mb-8">Términos y Condiciones</h1>

          <div className="prose prose-invert text-radix-text-3 leading-relaxed space-y-6 text-base">
            <p>
              El acceso y uso de este sitio web implica la aceptación de los presentes términos.
              RADIX Consultores Inmobiliarios se reserva el derecho de modificar el contenido y
              los términos en cualquier momento.
            </p>
            <p>
              La información publicada en este sitio tiene carácter orientativo y no constituye
              oferta vinculante. Toda operación inmobiliaria deberá ser confirmada mediante
              documentación formal y en conformidad con la legislación argentina vigente.
            </p>
            <p>
              Las imágenes y datos de propiedades son referenciales y pueden estar sujetos a
              cambios sin previo aviso.
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
