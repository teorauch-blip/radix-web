'use client'

import { useCallback, type AnchorHTMLAttributes, type MouseEvent as ReactMouseEvent } from 'react'
import { isWhatsAppUrl } from '@/lib/utils/contacto'
import { reportWhatsAppConversion } from '@/lib/analytics/conversions'

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>

export interface TrackedWhatsAppLinkProps extends AnchorProps {
  /**
   * Destino real del link. Puede ser el fallback interno (`/contacto`):
   * en ese caso el componente se comporta como un `<a>` común y NO registra
   * conversión — el filtro es el destino, no el texto del botón.
   */
  href: string
}

/**
 * `<a>` a WhatsApp que registra la conversión de Google Ads en su propio
 * `onClick`, de forma explícita y verificable.
 *
 * Por qué onClick y no un listener delegado en `document`: el delegado
 * depende de que el clic burbujee hasta `document`, de que el target sea un
 * `<a href]` reconocible y de que nadie haya llamado `preventDefault` antes.
 * Cualquiera de esas tres cosas lo convierte en un no-op silencioso, sin
 * error y sin rastro en Tag Assistant. Acá el handler está atado al elemento
 * que se clickea: si el botón se ve, el handler corre.
 *
 * Regla de oro: Google Ads nunca puede impedir que el usuario llegue a
 * WhatsApp. Ver lib/analytics/conversions.ts.
 */
export function TrackedWhatsAppLink({
  href,
  target,
  rel,
  onClick,
  children,
  ...rest
}: TrackedWhatsAppLinkProps) {
  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      // Primero el handler del llamador: si él decide cancelar el clic
      // (modal, validación), no hubo intención de ir a WhatsApp.
      onClick?.(event)
      if (event.defaultPrevented) return

      // Solo cuenta el destino real. `/contacto`, `tel:` y `mailto:` no.
      if (!isWhatsAppUrl(href)) return

      // ¿El clic abre WhatsApp en otro lado y deja viva esta pestaña?
      // target=_blank, o cmd/ctrl/shift/alt-clic, o botón del medio.
      const opensInNewContext =
        (!!target && target !== '_self') ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0

      if (opensInNewContext) {
        // No se toca el clic: el `<a>` nativo abre la pestaña dentro del
        // gesto del usuario, así que NUNCA lo mata el bloqueador de popups
        // (a diferencia de un window.open diferido), y no hay riesgo de
        // doble apertura. La página actual sigue viva, así que el pixel de
        // conversión sale sin apuro y sin necesidad de esperar callback.
        reportWhatsAppConversion()
        return
      }

      // Misma pestaña: la navegación descarga el documento y puede cortar el
      // envío. Se frena, se registra, y se navega en el callback de Google o
      // al vencer el timeout corto — lo que ocurra primero. Un solo evento y
      // una sola navegación.
      event.preventDefault()
      reportWhatsAppConversion(() => {
        window.location.href = href
      })
    },
    [href, target, onClick],
  )

  return (
    <a
      href={href}
      target={target}
      rel={rel ?? (target && target !== '_self' ? 'noopener noreferrer' : undefined)}
      {...rest}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
