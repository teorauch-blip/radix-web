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

export interface PropiedadesQuery {
  tipo?: string
  ciudad?: string
  uso?: string
  /**
   * Obligatorio y explícito. Antes acá había un `?? 50` que capaba el listado
   * público sin que ningún llamador lo pidiera: /propiedades mostraba 50 de 53.
   * Si lo que querés es el inventario completo, usá getAllPropiedadesPublicas()
   * en lugar de pasar un número grande a ojo.
   */
  limit: number
  offset?: number
}

export async function getPropiedadesPublicas(
  params: PropiedadesQuery,
): Promise<PropiedadPublica[]> {
  const supabase = makeClient(300)

  const { data, error } = await supabase.rpc('get_propiedades_publicas', {
    p_tipo:   params.tipo   ?? null,
    p_ciudad: params.ciudad ?? null,
    p_uso:    params.uso    ?? null,
    p_limit:  params.limit,
    p_offset: params.offset ?? 0,
  })

  if (error) {
    console.error('[propiedades] getPropiedadesPublicas:', error.message)
    return []
  }

  return (data ?? []) as PropiedadPublica[]
}

/**
 * Trae TODAS las propiedades publicadas paginando la RPC.
 * Usada por el listado /propiedades, el sitemap y generateStaticParams — donde un
 * límite fijo dejaría propiedades fuera de la web y del índice de Google.
 *
 * El barrido avanza por `all.length` (lo efectivamente recibido) y solo corta con
 * una página vacía. Parece redundante y no lo es: la versión anterior avanzaba por
 * `page * pageSize` y cortaba con `batch.length < pageSize`, mientras la RPC tenía
 * un `LIMIT LEAST(p_limit, 100)` interno. Con pageSize=200 eso devolvía 100 filas,
 * `100 < 200` daba el barrido por terminado, y todo lo que viniera después se perdía
 * en silencio —sitemap incluido— apenas el inventario pasara las 100 propiedades.
 * Avanzando por lo recibido, el barrido queda correcto aunque la RPC devuelva menos
 * de lo pedido, hoy o en el futuro.
 */
export async function getAllPropiedadesPublicas(pageSize = 200): Promise<PropiedadPublica[]> {
  const all: PropiedadPublica[] = []
  const vistos = new Set<string>()
  const MAX_REQUESTS = 100 // techo de seguridad: 20.000 propiedades con pageSize=200

  for (let i = 0; i < MAX_REQUESTS; i++) {
    const batch = await getPropiedadesPublicas({ limit: pageSize, offset: all.length })
    if (batch.length === 0) break

    // Si una página no aporta ningún id nuevo, el offset no está avanzando:
    // cortamos en vez de acumular duplicados hasta MAX_REQUESTS.
    const nuevos = batch.filter((p) => !vistos.has(p.id))
    if (nuevos.length === 0) break

    for (const p of nuevos) vistos.add(p.id)
    all.push(...nuevos)
  }

  return all
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

/**
 * Galerías reducidas para la rotación automática de las tarjetas del Home.
 *
 * Por qué N llamadas y no una sola: la tabla `propiedad_imagenes` no es legible con la
 * anon key (RLS devuelve 0 filas), y la única vía pública es la RPC por propiedad. No
 * duele: el Home es ISR (`revalidate = 300`), así que esto corre en build/revalidación
 * —no por visitante— y las llamadas van en paralelo (~370ms para 50 propiedades).
 *
 * El costo que sí importa es el del navegador (cada WebP pesa ~300KB), y se controla en
 * dos lugares: acá recortando a `maxPorPropiedad` URLs, y en PropertyCardImage montando
 * las capas de a una y solo cuando la tarjeta está en viewport.
 *
 * Devuelve SOLO las propiedades con 2+ imágenes: las de una sola foto quedan fuera del
 * mapa y la tarjeta se renderiza estática, como hasta ahora.
 */
export async function getGaleriasRotacionHome(
  propiedades: Array<{ id: string; portadaUrl: string | null }>,
  maxPorPropiedad = 4,
): Promise<Record<string, string[]>> {
  const pares = await Promise.all(
    propiedades.map(async ({ id, portadaUrl }) => {
      const imgs = await getPropiedadImagenes(id)

      // Misma prioridad que el detalle: la marcada es_portada primero, luego por orden.
      const ordenadas = [...imgs].sort(
        (a, b) => Number(b.es_portada) - Number(a.es_portada) || a.orden - b.orden,
      )

      // La portada que la tarjeta YA muestra va primera y sin duplicarse: el primer
      // frame de la rotación es idéntico a lo que se ve hoy.
      const urls = [
        ...new Set([...(portadaUrl ? [portadaUrl] : []), ...ordenadas.map((i) => i.url)]),
      ]

      return [id, urls.slice(0, maxPorPropiedad)] as const
    }),
  )

  return Object.fromEntries(pares.filter(([, urls]) => urls.length > 1))
}

// Re-exportado desde lib/utils/adapt-propiedad para mantener compat con importadores existentes.
export { adaptPropiedad } from '@/lib/utils/adapt-propiedad'
