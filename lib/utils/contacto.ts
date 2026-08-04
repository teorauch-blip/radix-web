// ─────────────────────────────────────────────────────────────────
// Fuente única para links de contacto (WhatsApp / teléfono).
//
// Regla: el número SIEMPRE viene del CMS (web_config → contacto).
// Si el CMS no tiene un número válido, estas funciones devuelven null
// y el llamador debe caer a /contacto. Nunca se inventa un fallback.
// ─────────────────────────────────────────────────────────────────

/** Deja solo dígitos: quita espacios, guiones, paréntesis, puntos y '+'. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null

  const digits = String(raw).replace(/\D/g, '')
  if (!digits) return null

  // E.164: entre 8 y 15 dígitos. Menos que eso no lleva código de país.
  if (digits.length < 8 || digits.length > 15) return null

  // Descarta placeholders del tipo 5493870000000 / 1111111111.
  if (/(\d)\1{6,}/.test(digits)) return null

  return digits
}

/** ¿Hay un número utilizable para WhatsApp? */
export function hasValidPhone(raw: string | null | undefined): boolean {
  return normalizePhone(raw) !== null
}

export interface WhatsAppUrlInput {
  /** Número tal como lo guarda el CMS; se normaliza acá. */
  phone: string | null | undefined
  /** Mensaje prellenado opcional. */
  message?: string | null
}

/**
 * URL de WhatsApp con el número normalizado (con código de país).
 * Devuelve null si el número del CMS no es válido — el llamador decide
 * el fallback (normalmente /contacto).
 */
export function getWhatsAppUrl({ phone, message }: WhatsAppUrlInput): string | null {
  const number = normalizePhone(phone)
  if (!number) return null

  const text = message?.trim()
  return text
    ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${number}`
}

/**
 * URL `tel:` a partir del valor del CMS.
 * Conserva el '+' inicial si el CMS lo trae (formato internacional).
 */
export function getTelHref(raw: string | null | undefined): string | null {
  const number = normalizePhone(raw)
  if (!number) return null

  // Si el CMS ya venía en formato internacional, se mantiene el prefijo.
  const international = String(raw).trim().startsWith('+') || number.length > 10
  return `tel:${international ? '+' : ''}${number}`
}

/**
 * Href de WhatsApp con fallback seguro: si no hay número válido en el CMS,
 * lleva a /contacto en vez de a un número inexistente.
 */
export function whatsappHrefOrContacto(
  phone: string | null | undefined,
  message?: string | null,
): { href: string; isWhatsApp: boolean } {
  const url = getWhatsAppUrl({ phone, message })
  return url ? { href: url, isWhatsApp: true } : { href: '/contacto', isWhatsApp: false }
}
