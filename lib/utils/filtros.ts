import type { PropiedadPublica, FiltroOpcion } from '@/lib/types/db'

// ─────────────────────────────────────────────────────────────────
// Normalización de valores de filtro.
//
// El CMS guarda los `value` con formato libre (ej. "Venta", "Alquiler"),
// mientras que la URL y la lógica de filtrado trabajan con slugs canónicos.
// Todo lo que entra —value del CMS o query param— pasa por acá antes de
// compararse, así URLs viejas como ?operacion=Venta siguen funcionando.
// ─────────────────────────────────────────────────────────────────

/** trim + lowercase + sin acentos + espacios/guiones → guión bajo. */
export function slugify(raw: string | null | undefined): string {
  if (!raw) return ''
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-/]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

// ─── Operación ────────────────────────────────────────────────

export type Operacion = 'venta' | 'alquiler' | 'venta_alquiler'

const OPERACION_ALIAS: Record<string, Operacion> = {
  venta:               'venta',
  en_venta:            'venta',
  vender:              'venta',
  alquiler:            'alquiler',
  en_alquiler:         'alquiler',
  alquilar:            'alquiler',
  renta:               'alquiler',
  venta_alquiler:      'venta_alquiler',
  venta_y_alquiler:    'venta_alquiler',
  alquiler_venta:      'venta_alquiler',
  venta_o_alquiler:    'venta_alquiler',
  ambas:               'venta_alquiler',
  ambos:               'venta_alquiler',
}

/**
 * Convierte cualquier variante ("Venta", "en-venta", "VENTA Y ALQUILER")
 * al slug canónico. Devuelve '' si no corresponde a ninguna operación
 * conocida (incluye la opción "Todas", cuyo value es '').
 */
export function normalizeOperacion(raw: string | null | undefined): Operacion | '' {
  const slug = slugify(raw)
  if (!slug) return ''
  return OPERACION_ALIAS[slug] ?? ''
}

/** Coerción segura a número: descarta strings, null, NaN y no finitos. */
export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

function hasPrecio(value: unknown): boolean {
  const n = toNumber(value)
  return n !== null && n > 0
}

/**
 * Operación real de una propiedad, derivada SOLO de los precios cargados.
 * Devuelve null si no tiene ningún precio (no participa de estos filtros).
 */
export function getOperacion(p: PropiedadPublica): Operacion | null {
  const venta    = hasPrecio(p.precio_venta)
  const alquiler = hasPrecio(p.precio_alquiler)

  if (venta && alquiler) return 'venta_alquiler'
  if (venta)             return 'venta'
  if (alquiler)          return 'alquiler'
  return null
}

/**
 * ¿La propiedad entra en el filtro de operación seleccionado?
 * - venta          → tiene precio_venta (incluye las que también se alquilan)
 * - alquiler       → tiene precio_alquiler (incluye las que también se venden)
 * - venta_alquiler → únicamente las que tienen ambos precios
 */
export function matchOperacion(p: PropiedadPublica, filtro: Operacion): boolean {
  const operacion = getOperacion(p)
  if (!operacion) return false

  if (filtro === 'venta')    return operacion === 'venta'    || operacion === 'venta_alquiler'
  if (filtro === 'alquiler') return operacion === 'alquiler' || operacion === 'venta_alquiler'
  return operacion === 'venta_alquiler'
}

// ─── Dormitorios ──────────────────────────────────────────────

export interface DormitoriosFiltro {
  /** 'exact' salvo que el value sea explícitamente "N+" / "N-mas" / "N_o_mas". */
  mode: 'exact' | 'min'
  value: number
}

/**
 * Interpreta el value del filtro de dormitorios.
 * Por defecto es coincidencia EXACTA; el modo "o más" solo se activa con un
 * value explícito ("4+", "4-mas", "4_o_mas"), nunca por el label.
 */
export function parseDormitoriosFiltro(
  raw: string | null | undefined,
): DormitoriosFiltro | null {
  if (raw === null || raw === undefined) return null
  const value = String(raw).trim()
  if (!value) return null

  // "4+" | "4 mas" | "4-mas" | "4_o_mas" | "4plus"
  const minMatch = value.match(/^(\d+)\s*(?:\+|[-_\s]*(?:o[-_\s]*)?(?:mas|más|plus))$/i)
  if (minMatch) {
    const n = toNumber(minMatch[1])
    return n === null ? null : { mode: 'min', value: n }
  }

  const exact = toNumber(value)
  if (exact === null) return null
  return { mode: 'exact', value: exact }
}

/**
 * ¿La propiedad cumple el filtro de dormitorios?
 * Sin dato (null/undefined) o 0 se considera "no informado": queda fuera
 * cuando el filtro está activo, sin afectar a terrenos, locales u oficinas
 * mientras no se filtre por dormitorios.
 */
export function matchDormitorios(p: PropiedadPublica, filtro: DormitoriosFiltro): boolean {
  const dormitorios = toNumber(p.dormitorios)
  if (dormitorios === null || dormitorios <= 0) return false

  return filtro.mode === 'min'
    ? dormitorios >= filtro.value
    : dormitorios === filtro.value
}

// ─── Filtrado del listado ─────────────────────────────────────

export interface FiltrosActivos {
  /** Ya normalizada a slug canónico ('' | venta | alquiler | venta_alquiler). */
  operacion: Operacion | ''
  tipo: string
  precioMin: string
  precioMax: string
  dormitorios: string
  ubicacion: string
}

/**
 * Filtra las PropiedadPublica según los parámetros activos.
 * ubicacionOpts se usa para determinar las zonas conocidas en el caso "otros".
 */
export function applyPropiedadesFilters(
  props: PropiedadPublica[],
  f: FiltrosActivos,
  ubicacionOpts: FiltroOpcion[],
): PropiedadPublica[] {
  const dormitoriosFiltro = parseDormitoriosFiltro(f.dormitorios)
  const tipoFiltro        = slugify(f.tipo)
  const precioMin         = toNumber(f.precioMin)
  const precioMax         = toNumber(f.precioMax)

  return props.filter(p => {

    // Operación: derivada de los precios reales de la propiedad.
    if (f.operacion && !matchOperacion(p, f.operacion)) return false

    // Tipo: 'desarrollo' en CMS → 'terreno' en DB (único caso de mapeo especial)
    if (tipoFiltro) {
      const tipoDb = tipoFiltro === 'desarrollo' ? 'terreno' : tipoFiltro
      if (slugify(p.tipo) !== tipoDb) return false
    }

    // Precio efectivo según operación activa
    const precioEfectivo = f.operacion === 'alquiler'
      ? (toNumber(p.precio_alquiler) ?? 0)
      : (toNumber(p.precio_venta) ?? toNumber(p.precio_alquiler) ?? 0)

    if (precioMin !== null && precioEfectivo < precioMin) return false
    if (precioMax !== null && precioEfectivo > precioMax) return false

    // Dormitorios: coincidencia exacta (o '>=' solo si el value es 'N+')
    if (dormitoriosFiltro && !matchDormitorios(p, dormitoriosFiltro)) return false

    // Ubicación: matching genérico contra ciudad + barrio
    if (f.ubicacion) {
      const haystack = `${p.ciudad ?? ''} ${p.barrio ?? ''}`.toLowerCase()
      const val = f.ubicacion.trim().toLowerCase()

      if (val === 'otros') {
        // Excluir propiedades que coincidan con cualquier zona conocida
        const zonasConocidas = ubicacionOpts
          .filter(u => u.value && u.value.trim().toLowerCase() !== 'otros')
          .map(u => u.value.trim().toLowerCase())
        if (zonasConocidas.some(z => haystack.includes(z))) return false
      } else {
        if (!haystack.includes(val)) return false
      }
    }

    return true
  })
}
