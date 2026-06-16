import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// La DB puede traer monedas en formatos no-ISO ("AR$", "$", "U$S", "US$").
// Intl.NumberFormat solo acepta códigos ISO (ARS, USD), por eso normalizamos.
const CURRENCY_MAP: Record<string, 'ARS' | 'USD'> = {
  'AR$': 'ARS',
  '$':   'ARS',
  'ARS': 'ARS',
  'USD': 'USD',
  'U$S': 'USD',
  'US$': 'USD',
}

export function normalizeCurrency(currency: string | null | undefined): 'ARS' | 'USD' {
  if (!currency) return 'USD'
  return CURRENCY_MAP[currency.trim().toUpperCase()] ?? 'USD'
}

export function formatPrice(price: number, currency?: string | null): string {
  const code = normalizeCurrency(currency)
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    // Red de seguridad: nunca romper la página por una moneda inválida.
    return `${code} ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(price)}`
  }
}

export function formatSurface(m2: number | null | undefined): string {
  if (m2 == null || m2 === 0) return '— m²'
  return `${new Intl.NumberFormat('es-AR').format(m2)} m²`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 },
}

export const STAGGER = {
  animate: { transition: { staggerChildren: 0.1 } },
}
