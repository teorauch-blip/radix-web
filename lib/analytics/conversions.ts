// ─────────────────────────────────────────────────────────────────
// Disparo de conversiones de Google Ads desde el cliente.
//
// Único punto del código que llama a `gtag('event', 'conversion', ...)`.
// El `send_to` se importa de ./google — no se escribe literal en ningún
// otro archivo.
//
// Regla de oro: Google Ads NUNCA puede impedir que el usuario llegue a
// WhatsApp. Todo acá está escrito para fallar hacia adelante — si gtag no
// existe, lo bloquea un ad blocker, tira una excepción o tarda demasiado,
// el callback se ejecuta igual y la navegación continúa.
// ─────────────────────────────────────────────────────────────────

import { WHATSAPP_CONVERSION_SEND_TO } from './google'

/**
 * Cuánto se espera como máximo a que gtag confirme el envío antes de
 * navegar igual. Google usa ~1s en su snippet de referencia; acá se corta
 * bastante antes: la conversión viaja por sendBeacon/Image y sobrevive a la
 * navegación en la enorme mayoría de los casos, y un usuario esperando un
 * botón de WhatsApp nota cualquier demora.
 */
export const CONVERSION_TIMEOUT_MS = 300

type Gtag = (...args: unknown[]) => void

function getGtag(): Gtag | null {
  if (typeof window === 'undefined') return null
  const fn = (window as Window & { gtag?: unknown }).gtag
  return typeof fn === 'function' ? (fn as Gtag) : null
}

/**
 * Registra la conversión "clic en WhatsApp". Una llamada = UN solo
 * `gtag('event', 'conversion')`.
 *
 * Lo usa components/analytics/tracked-whatsapp-link.tsx desde el onClick del
 * propio enlace; no hay ningún listener delegado que pueda duplicarlo.
 *
 * @param done Se invoca EXACTAMENTE una vez, pase lo que pase: cuando Google
 *   confirma el envío, cuando vence el timeout, o de inmediato si no hay
 *   gtag disponible. Ahí es donde el llamador navega a WhatsApp.
 */
export function reportWhatsAppConversion(done?: () => void): void {
  let settled = false
  let timer: number | undefined

  const finish = () => {
    if (settled) return
    settled = true
    if (timer !== undefined) window.clearTimeout(timer)
    done?.()
  }

  const gtag = getGtag()

  // Sin gtag (SSR, ad blocker, script que no cargó) o sin conversión
  // configurada: se sigue de largo sin romper nada.
  if (!gtag || !WHATSAPP_CONVERSION_SEND_TO) {
    finish()
    return
  }

  try {
    gtag('event', 'conversion', {
      send_to: WHATSAPP_CONVERSION_SEND_TO,
      event_callback: finish,
    })
  } catch {
    finish()
    return
  }

  // Red de seguridad: si el callback nunca llega, se navega igual.
  timer = window.setTimeout(finish, CONVERSION_TIMEOUT_MS)
}
