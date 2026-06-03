import { createClient } from '@supabase/supabase-js'
import type {
  WebConfigContacto,
  WebConfigRedes,
  WebConfigEmpresa,
  WebConfigSeo,
  WebConfigHero,
  WebConfigSobreRadix,
  WebConfigMetricas,
  WebConfigCtaFinal,
  WebConfigTerritorio,
  WebConfigServicios,
  WebConfigAdministracionHome,
  WebConfigInversionesHome,
  HeroConfig,
  SobreRadixConfig,
  MetricaItem,
  CtaFinalConfig,
  TeritorioConfig,
  ServiciosConfig,
  AdministracionHomeConfig,
  InversionesHomeConfig,
} from '@/lib/types/db'
import { CONTACT, WHATSAPP_NUMBER } from '@/lib/content/contact'
import { COMPANY, COMPANY_ABOUT } from '@/lib/content/company'
import {
  HERO_LABEL,
  HOME_METRICS,
  TERRITORY_SUB,
  MAP_LOCATIONS,
  SERVICE_PANELS,
  INVESTMENT_AREAS,
} from '@/lib/content/home'

// Cliente para config.
// Cache alineado con el ISR de la página (revalidate = 300 en page.tsx).
function makeConfigClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate: 300 } } as RequestInit),
      },
    }
  )
}

// Lee una clave de web_config directamente desde la tabla.
// Usa .limit(1) en lugar de .single() para no fallar si la fila no existe.
async function fetchConfig<T>(clave: string): Promise<T | null> {
  try {
    const supabase = makeConfigClient()
    const { data, error } = await supabase
      .from('web_config')
      .select('valor')
      .eq('clave', clave)
      .limit(1)

    if (error) {
      console.error(`[web-config] '${clave}' error ${error.code}: ${error.message}`)
      return null
    }

    const valor = (data?.[0]?.valor ?? null) as T | null
    if (!valor) console.warn(`[web-config] '${clave}' sin datos → fallback activo`)
    return valor
  } catch (err) {
    console.error(`[web-config] '${clave}' exception:`, err)
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

// ─── Hero ─────────────────────────────────────────────────────

export type { HeroConfig }

export async function getHeroConfig(): Promise<HeroConfig> {
  const db = await fetchConfig<WebConfigHero>('hero')
  return {
    label:             db?.hero_label               ?? HERO_LABEL,
    titleLine1:        db?.hero_title_line_1        ?? 'Inmuebles que',
    titleLine2:        db?.hero_title_line_2        ?? 'definen el estándar.',
    subtitle:          db?.hero_subtitle            ?? 'RADIX opera donde la estrategia y el diseño convergen. Capital inmobiliario inteligente en el NOA.',
    primaryCtaLabel:   db?.hero_primary_cta_label   ?? 'Ver portafolio',
    primaryCtaHref:    db?.hero_primary_cta_href    ?? '/propiedades',
    secondaryCtaLabel: db?.hero_secondary_cta_label ?? 'Hablar con un asesor',
    secondaryCtaHref:  db?.hero_secondary_cta_href  ?? '/contacto',
  }
}

// ─── Sobre RADIX ──────────────────────────────────────────────

export type { SobreRadixConfig }

export async function getSobreRadixConfig(): Promise<SobreRadixConfig> {
  const db = await fetchConfig<WebConfigSobreRadix>('sobre_radix')
  return {
    label:      db?.intro_label        ?? COMPANY_ABOUT.label,
    titleLine1: db?.intro_title_line_1 ?? COMPANY_ABOUT.headlineLines[0],
    titleLine2: db?.intro_title_line_2 ?? COMPANY_ABOUT.headlineLines[1],
    paragraphs: db
      ? [db.intro_paragraph_1, db.intro_paragraph_2, db.intro_paragraph_3].filter(Boolean) as string[]
      : [...COMPANY_ABOUT.paragraphs],
  }
}

// ─── Métricas ─────────────────────────────────────────────────

export type { MetricaItem }

export async function getMetricasConfig(): Promise<MetricaItem[]> {
  const db = await fetchConfig<WebConfigMetricas>('metricas')
  if (db?.items?.length) {
    return db.items.map((item, i) => ({
      value:  (parseInt(item.value  ?? '', 10) || 0) || (HOME_METRICS[i]?.value ?? 0),
      prefix: item.prefix   ?? HOME_METRICS[i]?.prefix ?? '',
      suffix: item.suffix   ?? HOME_METRICS[i]?.suffix ?? '',
      label:  item.label    ?? HOME_METRICS[i]?.label  ?? '',
      sub:    item.sublabel ?? HOME_METRICS[i]?.sub    ?? '',
    }))
  }
  return HOME_METRICS.map((m) => ({
    value:  m.value,
    prefix: m.prefix,
    suffix: m.suffix,
    label:  m.label,
    sub:    m.sub,
  }))
}

// ─── CTA Final ────────────────────────────────────────────────

export type { CtaFinalConfig }

export async function getCtaFinalConfig(): Promise<CtaFinalConfig> {
  const db = await fetchConfig<WebConfigCtaFinal>('cta_final')
  return {
    ctaLabel:        db?.cta_label         ?? 'Contacto',
    headline1:       db?.cta_headline_1    ?? 'El primer paso es',
    headline2:       db?.cta_headline_2    ?? 'una conversación.',
    subtitle:        db?.cta_subtitle      ?? 'Contanos qué buscás. Nuestro equipo analiza tu situación y te presenta opciones concretas, sin rodeos.',
    primaryCtaLabel: db?.cta_primary_label ?? 'Escribir a RADIX',
    primaryCtaHref:  db?.cta_primary_href  ?? '/contacto',
    locationLine:    db?.cta_location_line ?? 'Salta · NOA',
  }
}

// ─── Territorio ───────────────────────────────────────────────

export type { TeritorioConfig }

export async function getTeritorioConfig(): Promise<TeritorioConfig> {
  const db = await fetchConfig<WebConfigTerritorio>('territorio')

  const cmsLocations = db?.locations?.filter(l => l.active !== false) ?? []
  const locations = cmsLocations.length
    ? cmsLocations.map((l, i) => ({
        name:        l.name        || MAP_LOCATIONS[i]?.name        || '',
        badge:       l.badge       || MAP_LOCATIONS[i]?.badge       || '',
        address:     l.address     || MAP_LOCATIONS[i]?.address     || '',
        description: l.description || MAP_LOCATIONS[i]?.description || '',
      }))
    : MAP_LOCATIONS.map(l => ({
        name:        l.name,
        badge:       l.badge,
        address:     l.address,
        description: l.description,
      }))

  return {
    label:            db?.territory_label    || 'Territorio',
    titleLine1:       db?.territory_title_1  || 'Presencia donde',
    titleLine2:       db?.territory_title_2  || 'importa.',
    subtitle:         db?.territory_subtitle || TERRITORY_SUB,
    comingSoonText:   db?.coming_soon_text   || 'Próximamente ampliando cobertura a',
    comingSoonCities: db?.coming_soon_cities?.filter(Boolean) ?? ['San Agustín', 'Cerrillos', 'Chicoana'],
    locations,
  }
}

// ─── Servicios ────────────────────────────────────────────────

export type { ServiciosConfig }

export async function getServiciosConfig(): Promise<ServiciosConfig> {
  const db = await fetchConfig<WebConfigServicios>('servicios')

  const cmsPanels = db?.panels?.filter(p => p.active !== false) ?? []
  const panels = cmsPanels.length
    ? cmsPanels.map((p, i) => ({
        title:       p.title       || SERVICE_PANELS[i]?.title       || '',
        description: p.description || SERVICE_PANELS[i]?.description || '',
        metric:      p.metric      || SERVICE_PANELS[i]?.metric      || '',
        subMetric:   p.subMetric   || SERVICE_PANELS[i]?.subMetric   || '',
        href:        p.href        || SERVICE_PANELS[i]?.href        || '',
      }))
    : SERVICE_PANELS.map(p => ({
        title:       p.title,
        description: p.description,
        metric:      p.metric,
        subMetric:   p.subMetric,
        href:        p.href,
      }))

  return {
    label:     db?.section_label    || 'Servicios',
    titleLine1: db?.section_title_1 || 'Cada dimensión',
    titleLine2: db?.section_title_2 || 'del mercado.',
    subtitle:  db?.section_subtitle || 'Operamos en todos los segmentos del mercado inmobiliario con la misma exigencia y criterio profesional.',
    panels,
  }
}

// ─── Administración Home ──────────────────────────────────────

export type { AdministracionHomeConfig }

const ADMIN_FEATURES_FALLBACK: Array<{ title: string; description: string }> = [
  { title: 'Gestión de cobros y pagos',   description: 'Control de alquileres, expensas y gastos operativos con reportes mensuales detallados.' },
  { title: 'Mantenimiento preventivo',    description: 'Red de proveedores verificados. Intervenciones planificadas y respuesta en 24 horas.' },
  { title: 'Informes de rendimiento',     description: 'Dashboard de situación patrimonial, ocupación y rentabilidad histórica.' },
  { title: 'Gestión de contratos',        description: 'Redacción, renovación, indexación y rescisión conforme a la normativa vigente.' },
  { title: 'Optimización de cartera',     description: 'Análisis periódico de mercado con recomendaciones para maximizar el retorno.' },
  { title: 'Atención a inquilinos',       description: 'Canal dedicado de comunicación. Resolución de conflictos y seguimiento.' },
]

export async function getAdministracionHomeConfig(): Promise<AdministracionHomeConfig> {
  const db = await fetchConfig<WebConfigAdministracionHome>('administracion_home')

  const cmsFeatures = db?.features?.filter(f => f.active !== false) ?? []
  const features = cmsFeatures.length
    ? cmsFeatures.map((f, i) => ({
        title:       f.title       || ADMIN_FEATURES_FALLBACK[i]?.title       || '',
        description: f.description || ADMIN_FEATURES_FALLBACK[i]?.description || '',
      }))
    : ADMIN_FEATURES_FALLBACK

  return {
    label:             db?.label               || 'Administración',
    titleLine1:        db?.title_1             || 'Tu patrimonio,',
    titleLine2:        db?.title_2             || 'en orden.',
    paragraph:         db?.paragraph           || 'Gestionamos carteras inmobiliarias de propietarios que exigen orden, transparencia y retornos optimizados. Sin excusas, sin improvisación.',
    ctaPrimaryLabel:   db?.cta_primary_label   || 'Más sobre administración',
    ctaPrimaryHref:    db?.cta_primary_href    || '/administracion',
    ctaSecondaryLabel: db?.cta_secondary_label || 'Consultar',
    ctaSecondaryHref:  db?.cta_secondary_href  || '/contacto',
    metric1Value:      db?.metric_1_value      || '96%',
    metric1Label:      db?.metric_1_label      || 'clientes que renuevan',
    metric2Value:      db?.metric_2_value      || '48h',
    metric2Label:      db?.metric_2_label      || 'tiempo máximo de respuesta',
    features,
  }
}

// ─── Inversiones Home ─────────────────────────────────────────

export type { InversionesHomeConfig }

export async function getInversionesHomeConfig(): Promise<InversionesHomeConfig> {
  const db = await fetchConfig<WebConfigInversionesHome>('inversiones_home')

  const cmsAreas = db?.areas?.filter(a => a.active !== false) ?? []
  const areas = cmsAreas.length
    ? cmsAreas.map((a, i) => ({
        title:       a.title       || INVESTMENT_AREAS[i]?.title       || '',
        description: a.description || INVESTMENT_AREAS[i]?.description || '',
        badge:       a.badge       || INVESTMENT_AREAS[i]?.badge       || '',
        type:        a.type        || INVESTMENT_AREAS[i]?.type        || '',
      }))
    : INVESTMENT_AREAS.map(a => ({
        title:       a.title,
        description: a.description,
        badge:       a.badge,
        type:        a.type,
      }))

  return {
    label:          db?.label            || 'Inversiones',
    titleLine1:     db?.title_1          || 'Salta como',
    titleLine2:     db?.title_2          || 'activo estratégico.',
    paragraph:      db?.paragraph        || 'El NOA tiene un mercado en crecimiento sostenido. RADIX acompaña operaciones de inversión con criterio profesional y conocimiento local del mercado salteño.',
    bannerQuestion: db?.banner_question  || '¿Buscás una oportunidad de inversión?',
    bannerSub:      db?.banner_sub       || 'Nuestro equipo analiza tu perfil y te presenta activos que se ajustan a tus objetivos.',
    bannerCtaLabel: db?.banner_cta_label || 'Ver oportunidades',
    bannerCtaHref:  db?.banner_cta_href  || '/inversiones',
    areas,
  }
}
