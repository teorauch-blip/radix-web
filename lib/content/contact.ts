// ─────────────────────────────────────────────────────────────────
// RADIX — Datos de contacto de respaldo.
//
// IMPORTANTE: el teléfono y el WhatsApp NO se definen acá.
// La única fuente de verdad es el CMS (web_config → contacto), que se lee
// con getContactConfig() en lib/data/web-config.ts. Si el CMS no tiene un
// número válido, los botones caen a /contacto — nunca a un número inventado.
//
// Este archivo solo conserva datos no telefónicos como respaldo y los
// mensajes por defecto de WhatsApp.
// ─────────────────────────────────────────────────────────────────

export const CONTACT = {
  /** Sin respaldo local: si el CMS no trae teléfono, no se muestra ninguno. */
  phone: null,
  phone_href: null,
  email: 'info@radixconsultores.com',
  address: 'Balcarce 1050, Salta Capital',
  hours: 'Lunes a viernes · 9 a 18 hs',
  location: 'Salta · NOA',
  instagram: '',
  facebook: '',
  linkedin: '',
} as const

// ─── Mensajes prellenados de WhatsApp ─────────────────────────

export const WHATSAPP_DEFAULT_MSG =
  'Hola, me comunico desde la web de RADIX. Quisiera obtener más información.'

export const WHATSAPP_MSG_INVERSIONES =
  'Hola, estoy interesado en oportunidades de inversión inmobiliaria en Salta. ¿Podría obtener más información?'

export const WHATSAPP_MSG_ADMINISTRACION =
  'Hola, me interesa el servicio de administración de propiedades de RADIX. ¿Podría obtener más información?'

export const WHATSAPP_MSG_TASACIONES =
  'Hola, quisiera solicitar una tasación de mi propiedad. ¿Podrían asesorarme?'
