import type { MetadataRoute } from 'next'
import { getAllPropiedadesPublicas } from '@/lib/data/propiedades'
import { absoluteUrl } from '@/lib/seo/site'

// El sitemap se regenera cada hora: las propiedades nuevas del CMS
// aparecen sin necesidad de redeploy.
export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

/** Rutas estáticas públicas del sitio. */
const STATIC_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: Entry['changeFrequency']
}> = [
  { path: '/',               priority: 1.0,  changeFrequency: 'daily'   },
  { path: '/propiedades',    priority: 0.9,  changeFrequency: 'daily'   },
  { path: '/inversiones',    priority: 0.8,  changeFrequency: 'monthly' },
  { path: '/administracion', priority: 0.8,  changeFrequency: 'monthly' },
  { path: '/nosotros',       priority: 0.7,  changeFrequency: 'monthly' },
  { path: '/contacto',       priority: 0.7,  changeFrequency: 'monthly' },
  { path: '/privacidad',     priority: 0.2,  changeFrequency: 'yearly'  },
  { path: '/terminos',       priority: 0.2,  changeFrequency: 'yearly'  },
]

function parseDate(value: string | null): Date {
  if (!value) return new Date()
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // Si Supabase falla, el sitemap sigue sirviendo las rutas estáticas
  // en lugar de romper el build o devolver un 500.
  let propiedades: Awaited<ReturnType<typeof getAllPropiedadesPublicas>> = []
  try {
    propiedades = await getAllPropiedadesPublicas()
  } catch (error) {
    console.error('[sitemap] no se pudieron obtener las propiedades:', error)
  }

  const propertyEntries: MetadataRoute.Sitemap = propiedades
    .filter((p) => Boolean(p.slug))
    .map((p) => ({
      url: absoluteUrl(`/propiedades/${p.slug}`),
      lastModified: parseDate(p.publicado_en),
      changeFrequency: 'weekly' as const,
      priority: p.destacada ? 0.8 : 0.7,
    }))

  return [...staticEntries, ...propertyEntries]
}
