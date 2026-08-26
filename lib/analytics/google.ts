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
