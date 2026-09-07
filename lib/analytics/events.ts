// ─────────────────────────────────────────────────────────────────
// Eventos de embudo (NO conversiones).
//
// Diferencia clave con lib/analytics/conversions.ts: acá NUNCA se emite
// `gtag('event', 'conversion', { send_to: … })`. Estos son eventos comunes
// —landing_view, filter_use, view_property…— para poder leer el embudo de la
// landing. Google Ads solo contabiliza como conversión lo que llega con un
// `send_to` apuntando a una etiqueta de conversión, así que nada de lo que
// sale de este archivo puede crear una conversión nueva ni duplicar las dos
// que ya existen (WhatsApp y Formulario | Consulta).
//
// ─── Nota operativa ───
// Hoy la Google tag global solo lleva el ID de Google Ads: NEXT_PUBLIC_GA4_ID
// está vacío (ver lib/analytics/google.ts). Estos eventos se envían igual y
// no molestan, pero recién se van a poder LEER cuando exista la propiedad de
// GA4 y se defina esa env var. No hace falta tocar nada más: la tag ya está
// preparada para sumar el segundo ID sobre la misma librería.
// ─────────────────────────────────────────────────────────────────

/**
 * Eventos del embudo de la landing de Ads, en el orden en que ocurren.
 * El tipo cerrado es a propósito: obliga a que el nombre del evento se
 * escriba una sola vez, acá, y no como string suelto en cada componente.
 */
export type FunnelEvent =
  | 'landing_view'
  | 'filter_use'
  | 'view_property'
  | 'click_whatsapp'
  | 'form_start'
  | 'form_submit_success'
  | 'view_all_properties'

type Gtag = (...args: unknown[]) => void
type EventParams = Record<string, string | number | boolean | null | undefined>

function getGtag(): Gtag | null {
  if (typeof window === 'undefined') return null
  const fn = (window as Window & { gtag?: unknown }).gtag
  return typeof fn === 'function' ? (fn as Gtag) : null
}

// ─── Cola de arranque ─────────────────────────────────────────
//
// La Google tag se monta con `strategy="afterInteractive"` (ver
// components/analytics/google-tag.tsx), así que `window.gtag` NO existe
// todavía cuando React termina de hidratar. Los eventos disparados por el
// usuario no tienen problema —para cuando alguien hace clic, la tag ya cargó—,
// pero `landing_view` sale en el mismo instante de la hidratación y se perdía
// en silencio. Medido en producción: dataLayer llegaba a tener solo `js` y
// `config`, sin un solo evento.
//
// Por qué una cola y no empujar directo a `window.dataLayer`: gtag.js procesa
// la cola EN ORDEN, y un `event` que quede antes del `config` se descarta por
// no tener destino configurado. Esperando a que `window.gtag` exista nos
// garantizamos estar después del `config` que emite el propio snippet.

/** Cuánto se espera a la Google tag antes de dar los eventos por perdidos. */
const ESPERA_MAX_MS = 8000
const ESPERA_INTERVALO_MS = 200

let pendientes: Array<[FunnelEvent, EventParams | undefined]> = []
let esperando = false

function emitir(gtag: Gtag, name: FunnelEvent, params?: EventParams): void {
  try {
    gtag('event', name, {
      // Agrupa todo el embudo bajo una misma categoría en GA4, para poder
      // aislarlo del resto del sitio sin depender del nombre de cada evento.
      event_category: 'landing_ads',
      ...params,
    })
  } catch {
    // Silencio deliberado: medir nunca puede romper una interacción.
  }
}

function esperarGtag(): void {
  if (esperando || typeof window === 'undefined') return
  esperando = true

  const inicio = Date.now()
  const id = window.setInterval(() => {
    const gtag = getGtag()

    if (gtag) {
      window.clearInterval(id)
      esperando = false
      const cola = pendientes
      pendientes = []
      for (const [name, params] of cola) emitir(gtag, name, params)
      return
    }

    // Un ad blocker puede hacer que la tag no llegue nunca. Se abandona en vez
    // de dejar un intervalo vivo y una cola que crece sola.
    if (Date.now() - inicio > ESPERA_MAX_MS) {
      window.clearInterval(id)
      esperando = false
      pendientes = []
    }
  }, ESPERA_INTERVALO_MS)
}

/**
 * Registra un evento de embudo.
 *
 * Si la Google tag todavía no cargó, el evento queda en cola y se emite apenas
 * aparezca (ver arriba). En SSR es un no-op. Nunca lanza.
 */
export function trackEvent(name: FunnelEvent, params?: EventParams): void {
  const gtag = getGtag()

  if (gtag) {
    emitir(gtag, name, params)
    return
  }

  if (typeof window === 'undefined') return

  pendientes.push([name, params])
  esperarGtag()
}
