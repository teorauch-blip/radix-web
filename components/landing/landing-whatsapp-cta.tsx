'use client'

import type { ReactNode } from 'react'
import { TrackedWhatsAppLink } from '@/components/analytics/tracked-whatsapp-link'
import { trackEvent } from '@/lib/analytics/events'

interface LandingWhatsAppCtaProps {
  /** Ya resuelto con whatsappHrefOrContacto: puede ser wa.me o /contacto. */
  href: string
  /** false cuando el CMS no tiene número válido y el href cayó a /contacto. */
  isWhatsApp: boolean
  /** Dónde está el botón dentro de la landing: 'hero' | 'resultados'. */
  ubicacion: string
  className?: string
  children: ReactNode
}

/**
 * CTA de WhatsApp de la landing.
 *
 * Es un wrapper mínimo sobre TrackedWhatsAppLink —el mismo componente que usan
 * el resto de las páginas— y NO toca la conversión: se limita a pasar un
 * `onClick` con el evento de embudo.
 *
 * Por qué eso no duplica nada: TrackedWhatsAppLink ejecuta primero el onClick
 * del llamador y recién después decide si registra la conversión. `trackEvent`
 * emite un evento común (sin `send_to`), así que un clic sigue produciendo
 * EXACTAMENTE una conversión de Google Ads, más un evento de analítica que Ads
 * no contabiliza. Ver lib/analytics/events.ts.
 *
 * Existe porque el hero y la franja de resultados son Server Components y no
 * pueden pasar un handler; este archivo es la frontera de cliente.
 */
export function LandingWhatsAppCta({
  href,
  isWhatsApp,
  ubicacion,
  className,
  children,
}: LandingWhatsAppCtaProps) {
  return (
    <TrackedWhatsAppLink
      href={href}
      // Mismo criterio que el resto del sitio: WhatsApp abre en pestaña nueva
      // y deja la landing viva detrás; el fallback interno navega normal.
      {...(isWhatsApp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className}
      onClick={() => trackEvent('click_whatsapp', { ubicacion, destino: isWhatsApp ? 'whatsapp' : 'contacto' })}
    >
      {children}
    </TrackedWhatsAppLink>
  )
}
