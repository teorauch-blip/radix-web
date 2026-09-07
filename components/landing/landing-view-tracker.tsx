'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics/events'

/**
 * Bandera a nivel de módulo, no un ref del componente.
 *
 * `landing_view` mide "alguien entró a la landing desde un anuncio", y eso
 * ocurre una vez por carga del documento. Un `useRef` se recrea cuando React
 * desmonta y vuelve a montar el componente —lo que Strict Mode hace en cada
 * render de desarrollo—, así que el evento saldría duplicado. El módulo se
 * evalúa una sola vez por carga de página, que es exactamente la vida útil
 * que queremos medir.
 *
 * Efecto secundario buscado: volver a la landing por navegación interna
 * (desde /propiedades, por ejemplo) NO cuenta como una vista nueva. No lo es:
 * no hubo un clic en un anuncio.
 */
let vistaRegistrada = false

/**
 * Registra la vista de la landing. No pinta nada.
 *
 * Es el único componente de la landing que corre un efecto al montar; el resto
 * del contenido es HTML del servidor y no espera a la hidratación para verse.
 */
export function LandingViewTracker({ ruta }: { ruta: string }) {
  useEffect(() => {
    if (vistaRegistrada) return
    vistaRegistrada = true
    trackEvent('landing_view', { ruta })
  }, [ruta])

  return null
}
