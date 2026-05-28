// ─────────────────────────────────────────────────────────────────
// RADIX — Información de contacto central
// Editar este archivo para actualizar datos en toda la web.
// ─────────────────────────────────────────────────────────────────

// WhatsApp: formato internacional sin '+' ni espacios
// Ejemplo Salta: 54 (Argentina) + 9 + 387 (área sin 0) + número 8 dígitos
export const WHATSAPP_NUMBER = '5493870000000' // ← reemplazar con número real

export const CONTACT = {
  phone: '+54 387 XXX-XXXX',          // ← reemplazar
  phone_href: 'tel:+54387XXXXXXXX',    // ← reemplazar (formato tel:)
  email: 'info@radixconsultores.com',
  address: 'Balcarce 1050, Salta Capital',
  hours: 'Lunes a viernes · 9 a 18 hs',
  location: 'Salta · NOA',
  instagram: '', // ← agregar: 'https://instagram.com/radixconsultores'
  facebook: '',  // ← agregar
  linkedin: '',  // ← agregar
} as const

export const WHATSAPP_DEFAULT_MSG =
  'Hola, me comunico desde la web de RADIX. Quisiera obtener más información.'

export function whatsappUrl(message: string = WHATSAPP_DEFAULT_MSG): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
