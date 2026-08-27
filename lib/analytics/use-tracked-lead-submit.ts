'use client'

import { useCallback, useRef } from 'react'
import { submitLead, type LeadInput, type LeadResult } from '@/app/actions/leads'
import { reportFormConsultaConversion } from './conversions'

/**
 * Envía un lead y registra la conversión "Formulario | Consulta" SOLO si el
 * Server Action devolvió éxito real.
 *
 * Único lugar del código que ata el resultado del envío a la conversión. Los
 * formularios (LeadForm, TasacionForm) llaman a este hook en vez de a
 * `submitLead` directamente, así la regla no se repite ni se desincroniza
 * entre páginas.
 *
 * ─── Por qué acá y no en un useEffect ───
 * La conversión se dispara en la misma rama `res.ok` que decide el éxito,
 * dentro del flujo del envío. Un `useEffect([success])` corre dos veces en
 * React Strict Mode y vuelve a correr si el componente se remonta con el
 * estado de éxito ya puesto: los dos casos inflarían la cuenta. Un handler de
 * envío corre una vez por envío, incluso en Strict Mode.
 *
 * ─── Anti-duplicados ───
 * `reported` es un ref por instancia montada del formulario. Cubre el único
 * hueco que queda: dos envíos disparados casi a la vez (doble click antes de
 * que el botón se deshabilite) que terminan ambos en ok — eso es un lead
 * duplicado, no dos consultas, y cuenta como UNA conversión.
 *
 * No bloquea consultas nuevas legítimas: el ref vive lo que vive el
 * formulario. Al cerrar y reabrir el modal de la propiedad, o al recargar /
 * volver a /contacto, se monta un formulario nuevo con el ref en `false` y esa
 * segunda consulta exitosa suma su propia conversión.
 */
export function useTrackedLeadSubmit() {
  const reported = useRef(false)

  return useCallback(async (input: LeadInput): Promise<LeadResult> => {
    const res = await submitLead(input)

    // Campos inválidos, rechazo de Supabase, error de red -> res.ok es false
    // (o submitLead lanza y ni llegamos acá): no se registra nada.
    if (res.ok && !reported.current) {
      reported.current = true
      reportFormConsultaConversion()
    }

    return res
  }, [])
}
