import { createClient } from '@supabase/supabase-js'
import type { PropiedadPublica, ImagenPublica } from '@/lib/types/db'
import type { Property } from '@/types'

// Cliente ligero solo lectura — sin cookies ni sesión (sitio público)
function makeClient(revalidate = 300) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        // Inyecta la directiva de revalidación ISR de Next.js en cada fetch
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate } } as RequestInit),
      },
    }
  )
}

// ─── Queries ──────────────────────────────────────────────────

export async function getPropiedadesPublicas(params?: {
  tipo?: string
  ciudad?: string
  uso?: string
  limit?: number
  offset?: number
}): Promise<PropiedadPublica[]> {
  const supabase = makeClient(300)

  const { data, error } = await supabase.rpc('get_propiedades_publicas', {
    p_tipo:   params?.tipo   ?? null,
    p_ciudad: params?.ciudad ?? null,
    p_uso:    params?.uso    ?? null,
    p_limit:  params?.limit  ?? 50,
    p_offset: params?.offset ?? 0,
  })

  if (error) {
    console.error('[propiedades] getPropiedadesPublicas:', error.message)
    return []
  }

  return (data ?? []) as PropiedadPublica[]
}

export async function getPropiedadPublica(slug: string): Promise<PropiedadPublica | null> {
  const supabase = makeClient(300)

  const { data, error } = await supabase.rpc('get_propiedad_publica', {
    p_slug: slug,
  })

  if (error) {
    console.error('[propiedades] getPropiedadPublica:', error.message)
    return null
  }

  const rows = (data ?? []) as PropiedadPublica[]
  return rows[0] ?? null
}

export async function getPropiedadImagenes(propiedadId: string): Promise<ImagenPublica[]> {
  const supabase = makeClient(300)

  const { data, error } = await supabase.rpc('get_propiedad_imagenes_publicas', {
    p_propiedad_id: propiedadId,
  })

  if (error) {
    console.error('[propiedades] getPropiedadImagenes:', error.message)
    return []
  }

  return (data ?? []) as ImagenPublica[]
}

// ─── Adaptador PropiedadPublica → Property ────────────────────
// Convierte el tipo DB al tipo que usan los componentes existentes.
// Toda la lógica de mapeo está acá — los componentes no saben de la DB.

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

export function adaptPropiedad(p: PropiedadPublica): Property {
  // Derivar tipo de operación a partir de los precios disponibles
  let type: Property['type'] = 'venta'
  if (p.precio_alquiler && p.precio_alquiler > 0 && !p.precio_venta) {
    type = 'alquiler'
  } else if (p.tipo === 'terreno') {
    type = 'desarrollo'
  }

  const price    = type === 'alquiler' ? (p.precio_alquiler ?? 0) : (p.precio_venta ?? 0)
  const currency = (type === 'alquiler'
    ? (p.moneda_alquiler ?? 'ARS')
    : (p.moneda_venta    ?? 'USD')) as Property['currency']

  // Derivar amenities de los campos booleanos de la DB
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

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
