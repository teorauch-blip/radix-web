import { createClient } from '@supabase/supabase-js'
import type {
  WebConfigContacto,
  WebConfigRedes,
  WebConfigEmpresa,
  WebConfigSeo,
} from '@/lib/types/db'
import { CONTACT, WHATSAPP_NUMBER } from '@/lib/content/contact'
import { COMPANY } from '@/lib/content/company'

// Cliente para config — revalidación larga (cambia poco)
function makeConfigClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate: 3600 } } as RequestInit),
      },
    }
  )
}

async function fetchConfig<T>(clave: string): Promise<T | null> {
  try {
    const supabase = makeConfigClient()
    const { data, error } = await supabase
      .from('web_config')
      .select('valor')
      .eq('clave', clave)
      .single()

    if (error) return null
    return (data?.valor as T) ?? null
  } catch {
    return null
  }
}

// ─── Contacto ────────────────────────────────────────────────

export interface ContactConfig {
  phone: string
  phone_href: string
  whatsapp_number: string
  email: string
  address: string
  hours: string
}

export async function getContactConfig(): Promise<ContactConfig> {
  const db = await fetchConfig<WebConfigContacto>('contacto')

  const phone = db?.telefono_visible ?? CONTACT.phone
  const phone_href = db?.telefono_visible
    ? `tel:${db.telefono_visible.replace(/[\s\-()]/g, '')}`
    : CONTACT.phone_href

  return {
    phone,
    phone_href,
    whatsapp_number: db?.whatsapp_number ?? WHATSAPP_NUMBER,
    email:           db?.email_contacto  ?? CONTACT.email,
    address:         db?.direccion       ?? CONTACT.address,
    hours:           db?.horario         ?? CONTACT.hours,
  }
}

// ─── Redes sociales ──────────────────────────────────────────

export interface RedesConfig {
  instagram: string
  facebook: string
  linkedin: string
}

export async function getRedesConfig(): Promise<RedesConfig> {
  const db = await fetchConfig<WebConfigRedes>('redes')
  return {
    instagram: db?.instagram_url ?? CONTACT.instagram ?? '',
    facebook:  db?.facebook_url  ?? CONTACT.facebook  ?? '',
    linkedin:  db?.linkedin_url  ?? CONTACT.linkedin  ?? '',
  }
}

// ─── Empresa ─────────────────────────────────────────────────

export interface EmpresaConfig {
  nombre: string
  matriculas: string
  tagline: string
}

export async function getEmpresaConfig(): Promise<EmpresaConfig> {
  const db = await fetchConfig<WebConfigEmpresa>('empresa')
  return {
    nombre:     db?.nombre     ?? COMPANY.name,
    matriculas: db?.matriculas ?? COMPANY.license,
    tagline:    db?.tagline    ?? 'Firma premium de real estate en Salta y el NOA.',
  }
}

// ─── SEO global ──────────────────────────────────────────────

export interface SeoConfig {
  defaultTitle: string
  defaultDescription: string
  ogTitle: string
  ogDescription: string
  ogImage: string | null
}

export async function getSeoConfig(): Promise<SeoConfig> {
  const db = await fetchConfig<WebConfigSeo>('seo_global')
  return {
    defaultTitle:       db?.seo_default_title       ?? 'RADIX Consultores Inmobiliarios',
    defaultDescription: db?.seo_default_description ?? 'Firma premium de real estate en Salta y el NOA.',
    ogTitle:            db?.seo_og_title            ?? 'RADIX Consultores Inmobiliarios',
    ogDescription:      db?.seo_og_description      ?? 'Firma premium de real estate. Salta · NOA · Argentina.',
    ogImage:            db?.seo_og_image            ?? null,
  }
}
