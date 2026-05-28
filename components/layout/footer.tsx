import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'
import { RadixLogo } from '@/components/ui/radix-logo'
import { CONTACT } from '@/lib/content/contact'
import { getContactConfig, getEmpresaConfig } from '@/lib/data/web-config'

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

export async function Footer() {
  const [contact, empresa] = await Promise.all([
    getContactConfig(),
    getEmpresaConfig(),
  ])

  return (
    <footer className="relative bg-radix-black border-t border-white/[0.05] overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[240px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(196,168,112,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/[0.05]">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <RadixLogo size="sm" />
            </div>
            <p className="text-radix-text-4 text-sm leading-relaxed max-w-xs font-light">
              {empresa.tagline}
            </p>

            <div className="mt-7 space-y-3.5">
              {contact.phone && (
                <a
                  href={contact.phone_href}
                  className="flex items-center gap-3 text-sm text-radix-text-4 hover:text-radix-text-2 transition-colors duration-200"
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  {contact.phone}
                </a>
              )}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-sm text-radix-text-4 hover:text-radix-text-2 transition-colors duration-200"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                {contact.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-radix-text-4">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-[0.6rem] text-radix-text-4 uppercase tracking-[0.2em] mb-6">
              Servicios
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.servicios.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-radix-text-4 hover:text-radix-text-2 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-[0.6rem] text-radix-text-4 uppercase tracking-[0.2em] mb-6">
              Empresa
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-radix-text-4 hover:text-radix-text-2 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[0.6rem] text-radix-text-4 uppercase tracking-[0.2em] mb-6">
              Oportunidades
            </h4>
            <p className="text-sm text-radix-text-4 mb-5 leading-relaxed font-light">
              Recibí alertas de propiedades exclusivas antes de su publicación general.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <p className="text-[0.6rem] text-radix-text-4 tracking-wide">
            © {new Date().getFullYear()} RADIX Consultores Inmobiliarios. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacidad"
              className="text-[0.6rem] text-radix-text-4 hover:text-radix-text-3 transition-colors tracking-wide"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-[0.6rem] text-radix-text-4 hover:text-radix-text-3 transition-colors tracking-wide"
            >
              Términos
            </Link>
            <span className="text-[0.6rem] text-radix-text-4 tracking-wide">
              {empresa.matriculas}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
