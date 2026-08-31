import type { Property, PropertyType } from '@/types'

export type InventarioFiltro = PropertyType | 'all'

/** Pills de filtro del inventario del Home. Fuente única: las usa <Inventory/> para
 *  renderizar y `idsVisiblesInventario` para saber qué galerías pedir. */
export const INVENTARIO_FILTROS: { label: string; value: InventarioFiltro }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Venta', value: 'venta' },
  { label: 'Alquiler', value: 'alquiler' },
  { label: 'Inversión', value: 'inversion' },
  { label: 'Desarrollos', value: 'desarrollo' },
]

export function filtrarInventario(properties: Property[], filtro: InventarioFiltro): Property[] {
  return filtro === 'all' ? properties : properties.filter((p) => p.type === filtro)
}

/** Máximo de fotos que rota cada tarjeta del Home (ver PropertyCardImage). */
export const ROTACION_MAX_IMAGENES = 4

/**
 * Cuántas propiedades pide el Home a la base.
 *
 * No alcanza con pedir `maxDisplay`: el grid filtra client-side por operación y
 * muestra hasta `maxDisplay` por pill, así que hay que traer suficientes para que
 * el pill más escaso pueda llenarse. Hoy alquiler es ~23% del inventario (12 de 53)
 * y completar 6 tarjetas de alquiler obliga a llegar hasta la propiedad 13.
 *
 * 30 deja más del doble de margen sobre ese peor caso sin arrastrar el inventario
 * completo al payload del Home. Es un techo acoplado a `max_display` del CMS
 * (default 6): si alguien lo sube por encima de ~10, revisar este número.
 */
export const HOME_FETCH_LIMIT = 30

/**
 * Ids que el inventario del Home puede llegar a renderizar con CUALQUIER filtro.
 *
 * El filtrado es client-side sobre las ~50 propiedades, pero el grid solo muestra
 * `maxDisplay` por filtro: pedir las galerías de las 50 sería traer datos que nunca
 * se pintan. Deriva de las mismas constantes que consume <Inventory/>, así la lista
 * no puede desincronizarse de lo que realmente se muestra.
 */
export function idsVisiblesInventario(properties: Property[], maxDisplay: number): string[] {
  const ids = new Set<string>()
  for (const { value } of INVENTARIO_FILTROS) {
    for (const p of filtrarInventario(properties, value).slice(0, maxDisplay)) {
      ids.add(p.id)
    }
  }
  return [...ids]
}
