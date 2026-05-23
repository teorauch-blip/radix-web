import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'

const FOOTER_LINKS = {
  servicios: [
    { label: 'Compra y venta', href: '/propiedades' },
    { label: 'Alquileres', href: '/propiedades?tipo=alquiler' },
    { label: 'Inversiones', href: '/inversiones' },
    { label: 'Administración', href: '/administracion' },
    { label: 'Desarrollos', href: '/propiedades?tipo=desarrollo' },
  ],
  empresa: [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Equipo', href: '/nosotros#equipo' },
    { label: 'Trayectoria', href: '/nosotros#historia' },
    { label: 'Contacto', href: '/contacto' },
  ],
}

export function Footer() {
  return (
    <footer className="relative bg-radix-black border-t border-radix-border overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-radix-blue/5 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-radix-border">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-radix-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-white">RADIX</span>
            </div>
            <p className="text-radix-text-3 text-sm leading-relaxed max-w-xs">
              Firma moderna de real estate con presencia en Salta y Buenos Aires. Estrategia, diseño y precisión.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="tel:+5438712345678"
                className="flex items-center gap-3 text-sm text-radix-text-3 hover:text-radix-blue transition-colors"
              >
                <Phone className="w-4 h-4 text-radix-text-4" />
                +54 387 123-4567
              </a>
              <a
                href="mailto:info@radixconsultores.com"
                className="flex items-center gap-3 text-sm text-radix-text-3 hover:text-radix-blue transition-colors"
              >
                <Mail className="w-4 h-4 text-radix-text-4" />
                info@radixconsultores.com
              </a>
              <div className="flex items-start gap-3 text-sm text-radix-text-3">
                <MapPin className="w-4 h-4 text-radix-text-4 flex-shrink-0 mt-0.5" />
                <span>Balcarce 1050, Salta Capital<br />Av. del Libertador 1000, CABA</span>
              </div>
            </div>
          </div>

          {/* Links: Servicios */}
          <div>
            <h4 className="text-xs text-radix-text-4 uppercase tracking-widest mb-6">Servicios</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.servicios.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-radix-text-3 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Empresa */}
          <div>
            <h4 className="text-xs text-radix-text-4 uppercase tracking-widest mb-6">Empresa</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-radix-text-3 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-xs text-radix-text-4 uppercase tracking-widest mb-6">Oportunidades</h4>
            <p className="text-sm text-radix-text-3 mb-5 leading-relaxed">
              Recibí alertas de propiedades exclusivas antes de su publicación general.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <p className="text-xs text-radix-text-4">
            © {new Date().getFullYear()} RADIX Consultores Inmobiliarios. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacidad" className="text-xs text-radix-text-4 hover:text-radix-text-3 transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-radix-text-4 hover:text-radix-text-3 transition-colors">
              Términos
            </Link>
            <span className="text-xs text-radix-text-4">
              Matrícula CMCPRA Nº 0000
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
