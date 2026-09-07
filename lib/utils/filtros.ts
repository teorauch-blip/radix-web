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

// ─────────────────────────────────────────────────────────────────
// Lectura y serialización de los filtros
//
// Los mismos seis filtros se leen desde tres lugares distintos: la URL del
// listado (/propiedades, client-side con useSearchParams), los `searchParams`
// del server component de la landing, y el link "Ver todas las propiedades"
// que traslada el estado de una pantalla a la otra. Centralizar acá el nombre
// de cada param y su normalización es lo que evita que las tres copias se
// desincronicen: si mañana se agrega un filtro, se agrega una sola vez.
// ─────────────────────────────────────────────────────────────────

/** Nombre de cada filtro en la query string. Es también la lista que borra "Limpiar". */
export const FILTER_PARAM_KEYS = [
  'operacion',
  'tipo',
  'dormitorios',
  'ubicacion',
  'precio_min',
  'precio_max',
] as const

/** Estado sin ningún filtro aplicado. */
export const FILTROS_VACIOS: FiltrosActivos = {
  operacion:   '',
  tipo:        '',
  dormitorios: '',
  ubicacion:   '',
  precioMin:   '',
  precioMax:   '',
}

/**
 * Lee los seis filtros desde cualquier fuente de query params.
 *
 * `get` abstrae la única diferencia entre las dos fuentes: `URLSearchParams`
 * (y el ReadonlyURLSearchParams de Next) exponen `.get(key)`, mientras que el
 * `searchParams` de un Server Component es un objeto plano. Ver `firstParam`.
 *
 * `operacion` se normaliza al leerse, así una URL vieja o escrita a mano
 * (?operacion=Venta) filtra igual que la canónica.
 */
export function readFiltrosActivos(
  get: (key: string) => string | null | undefined,
): FiltrosActivos {
  const val = (key: string) => (get(key) ?? '').toString().trim()

  return {
    operacion:   normalizeOperacion(val('operacion')),
    tipo:        val('tipo'),
    dormitorios: val('dormitorios'),
    ubicacion:   val('ubicacion'),
    precioMin:   val('precio_min'),
    precioMax:   val('precio_max'),
  }
}

/**
 * Adapta un valor del `searchParams` de un Server Component (donde un param
 * repetido llega como array) al string único que espera `readFiltrosActivos`.
 */
export function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

/**
 * Serializa los filtros a query params, omitiendo los vacíos.
 * Solo emite los seis params de filtro: lo que arma no arrastra `gclid` ni
 * `utm_*` de la landing hacia una navegación interna.
 */
export function filtrosToSearchParams(f: FiltrosActivos): URLSearchParams {
  const params = new URLSearchParams()

  if (f.operacion)   params.set('operacion',   f.operacion)
  if (f.tipo)        params.set('tipo',        f.tipo)
  if (f.dormitorios) params.set('dormitorios', f.dormitorios)
  if (f.ubicacion)   params.set('ubicacion',   f.ubicacion)
  if (f.precioMin)   params.set('precio_min',  f.precioMin)
  if (f.precioMax)   params.set('precio_max',  f.precioMax)

  return params
}

/** Cuántos de los seis filtros están activos. */
export function countFiltrosActivos(f: FiltrosActivos): number {
  return [
    f.operacion,
    f.tipo,
    f.dormitorios,
    f.ubicacion,
    f.precioMin,
    f.precioMax,
  ].filter(Boolean).length
}

/**
 * Ordena el inventario para un listado comercial: destacadas primero y, dentro
 * de cada grupo, las publicadas más recientemente.
 *
 * Se aplica UNA vez sobre el inventario completo. Como `Array.prototype.filter`
 * preserva el orden, cualquier subconjunto filtrado después hereda esta
 * prioridad sin volver a ordenar.
 */
export function ordenarParaListado(props: PropiedadPublica[]): PropiedadPublica[] {
  const ts = (p: PropiedadPublica): number => {
    if (!p.publicado_en) return 0
    const t = new Date(p.publicado_en).getTime()
    return Number.isFinite(t) ? t : 0
  }

  return [...props].sort(
    (a, b) => Number(Boolean(b.destacada)) - Number(Boolean(a.destacada)) || ts(b) - ts(a),
  )
}
