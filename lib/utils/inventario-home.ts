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
