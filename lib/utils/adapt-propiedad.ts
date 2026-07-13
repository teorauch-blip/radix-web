import type { PropiedadPublica } from '@/lib/types/db'
import type { Property } from '@/types'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'

const CATEGORY_MAP: Record<string, Property['category']> = {
  departamento: 'residencial',
  casa:         'residencial',
  duplex:       'residencial',
  local:        'comercial',
  oficina:      'oficina',
  terreno:      'lote',
  cochera:      'comercial',
  galpon:       'comercial',
  otro:         'residencial',
}

const STATUS_MAP: Record<string, Property['status']> = {
  disponible:    'disponible',
  alquilada:     'alquilado',
  en_venta:      'disponible',
  vendida:       'vendido',
  reservada:     'reservado',
  en_reparacion: 'disponible',
  inactiva:      'disponible',
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function adaptPropiedad(p: PropiedadPublica): Property {
  // Operación: derivada SOLO de los precios cargados, nunca del tipo físico.
  const hasVenta    = !!(p.precio_venta    && p.precio_venta    > 0)
  const hasAlquiler = !!(p.precio_alquiler && p.precio_alquiler > 0)

  let operation: Property['operation'] = null
  if (hasVenta && hasAlquiler)      operation = 'venta_alquiler'
  else if (hasVenta)                operation = 'venta'
  else if (hasAlquiler)             operation = 'alquiler'

  // `type` se conserva solo para los pills de filtro del inventario del home.
  // Refleja la operación (venta/alquiler), jamás el tipo físico (un terreno NO es desarrollo).
  const type: Property['type'] = operation === 'alquiler' ? 'alquiler' : 'venta'

  // Precio/moneda: prioriza venta; si solo hay alquiler, usa alquiler.
  const price    = hasVenta ? (p.precio_venta ?? 0) : (p.precio_alquiler ?? 0)
  const currency = (hasVenta
    ? (p.moneda_venta    ?? 'USD')
    : (p.moneda_alquiler ?? 'ARS')) as Property['currency']

  const amenities: string[] = []
  if (p.tiene_ascensor)   amenities.push('Ascensor')
  if (p.tiene_balcon)     amenities.push('Balcón')
  if (p.tiene_terraza)    amenities.push('Terraza')
  if (p.tiene_piscina)    amenities.push('Piscina')
  if (p.permite_mascotas) amenities.push('Permite mascotas')

  return {
    id:                p.id,
    slug:              p.slug ?? p.codigo,
    title:             p.titulo_web ?? `${capitalize(p.tipo)} en ${p.barrio ?? p.ciudad}`,
    short_description: p.descripcion_web ?? p.direccion,
    type,
    operation,
    kind:              p.tipo,
    category:          CATEGORY_MAP[p.tipo] ?? 'residencial',
    status:            STATUS_MAP[p.estado]  ?? 'disponible',
    price,
    currency,
    surface_total:     p.superficie_total  ?? 0,
    surface_covered:   p.superficie_cubierta ?? undefined,
    bedrooms:          p.dormitorios ?? undefined,
    bathrooms:         p.banos       ?? undefined,
    parking_spaces:    p.cocheras    ?? undefined,
    address:           p.direccion,
    neighborhood:      p.barrio ?? p.ciudad,
    city:              p.ciudad,
    province:          p.provincia,
    lat:               p.latitud   ?? undefined,
    lng:               p.longitud  ?? undefined,
    images:            p.imagen_portada_url ? [p.imagen_portada_url] : [],
    cover_image:       p.imagen_portada_url ?? PLACEHOLDER,
    amenities:         amenities.length > 0 ? amenities : undefined,
    featured:          p.destacada,
    highlight_label:   p.destacada ? 'DESTACADO' : undefined,
    created_at:        p.publicado_en ?? new Date().toISOString(),
    updated_at:        p.publicado_en ?? new Date().toISOString(),
  }
}
