// ─────────────────────────────────────────────────────────────────
// Configuración central de Google tag (gtag.js) — única fuente de
// verdad para los IDs de medición. Ningún ID se repite fuera de acá.
// ─────────────────────────────────────────────────────────────────

/**
 * ID de Google Ads. Se puede sobreescribir con NEXT_PUBLIC_GOOGLE_ADS_ID.
 * Mismo criterio que SITE_URL en lib/seo/site.ts: default de producción
 * hardcodeado para que la tag no desaparezca si falta la env var.
 */
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18381666105'

/**
 * ID de GA4. Todavía no hay propiedad creada, así que por defecto va vacío.
 * Cuando exista, alcanza con definir NEXT_PUBLIC_GA4_ID: se agrega un
 * `gtag('config', 'G-XXXX')` a la misma tag, sin cargar gtag.js dos veces.
 */
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || ''

/**
 * IDs a configurar, en orden. El primero es el que carga gtag.js; el resto
 * se suman como `config` adicionales sobre esa misma librería.
 */
export const GOOGLE_TAG_IDS: string[] = [GOOGLE_ADS_ID, GA4_ID].filter(Boolean)

/** ID que se usa en el `src` del loader de gtag.js. */
export const GOOGLE_TAG_LOADER_ID: string | undefined = GOOGLE_TAG_IDS[0]

// ─── Conversiones de Google Ads ───────────────────────────────────

/**
 * Etiqueta de la conversión "clic en WhatsApp" generada en Google Ads.
 * El `send_to` completo es `<ID de Ads>/<etiqueta>`; se arma acá para que el
 * ID de Ads siga teniendo una sola fuente de verdad (GOOGLE_ADS_ID).
 */
const WHATSAPP_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL || 'pVQkCJmgvOgcELnuh71E'

/**
 * Valor exacto de `send_to` para la conversión de WhatsApp.
 * Vacío = conversión desactivada (no se dispara ningún evento).
 */
export const WHATSAPP_CONVERSION_SEND_TO: string =
  GOOGLE_ADS_ID && WHATSAPP_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${WHATSAPP_CONVERSION_LABEL}`
    : ''

/**
 * Etiqueta de la conversión "Formulario | Consulta" generada en Google Ads.
 * Se dispara cuando un formulario de consulta comercial llega a éxito real
 * (el Server Action `submitLead` devolvió ok), nunca al clickear el botón.
 *
 * Es una conversión DISTINTA de la de WhatsApp: cada una tiene su propia
 * etiqueta y no se comparten entre sí.
 */
const FORM_CONSULTA_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_FORM_CONSULTA_LABEL || 'D2NPCO7a8ugcELnuh71E'

/**
 * Valor exacto de `send_to` para la conversión de formulario de consulta.
 * Vacío = conversión desactivada (no se dispara ningún evento).
 */
export const FORM_CONSULTA_CONVERSION_SEND_TO: string =
  GOOGLE_ADS_ID && FORM_CONSULTA_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${FORM_CONSULTA_CONVERSION_LABEL}`
    : ''
