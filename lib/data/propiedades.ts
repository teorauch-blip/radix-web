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

// Re-exportado desde lib/utils/adapt-propiedad para mantener compat con importadores existentes.
export { adaptPropiedad } from '@/lib/utils/adapt-propiedad'
