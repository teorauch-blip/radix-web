import { Clock, MapPin, BadgeCheck } from 'lucide-react'
import { COMPANY } from '@/lib/content/company'

/**
 * Franja de confianza de la landing.
 *
 * Tres datos y nada más: la landing tiene que dar respaldo sin convertirse en
 * una página institucional ni sumar scroll. La versión larga de esto vive en
 * /nosotros.
 *
 * Los tres textos salen de COMPANY (lib/content/company.ts), que es la fuente
 * única de los datos institucionales del sitio y ya alimenta el bloque "Sobre
 * RADIX" del home. No se hardcodea nada acá: si cambian los años o la
 * matrícula, cambian en un solo lugar y esta franja acompaña.
 *
 * Server Component: cero JavaScript en el cliente.
 */
export function TrustStrip() {
  const items = [
    {
      Icon: Clock,
      text: `${COMPANY.yearsActive} años en el mercado inmobiliario de Salta`,
    },
    {
      Icon: MapPin,
      text: `Oficina en ${COMPANY.location}`,
    },
    {
      Icon: BadgeCheck,
      text: COMPANY.license,
    },
  ]

  return (
    <section
      aria-label="Respaldo profesional de RADIX"
      className="border-t border-white/[0.06] bg-radix-black/40"
    >
      <div className="section-container py-7 lg:py-8">
        <ul className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {items.map(({ Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 text-sm font-light text-radix-text-2"
            >
              <Icon
                className="h-4 w-4 flex-shrink-0 text-radix-gold"
                aria-hidden="true"
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
