/**
 * Tipos que reflejan exactamente lo que devuelven las RPCs públicas de Supabase.
 * NO modificar — son el contrato con la DB.
 */

export interface PropiedadPublica {
  id: string
  codigo: string
  slug: string | null
  tipo: string      // departamento | casa | duplex | local | oficina | terreno | cochera | galpon | otro
  uso: string       // residencial | comercial | mixto | industrial
  estado: string    // disponible | alquilada | en_venta | vendida | reservada | en_reparacion | inactiva
  titulo_web: string | null
  descripcion_web: string | null
  seo_title: string | null
  seo_description: string | null
  video_url: string | null
  imagen_portada_url: string | null
  destacada: boolean
  orden_web: number
  publicado_en: string | null
  // Ubicación pública
  direccion: string
  barrio: string | null
  ciudad: string
  provincia: string
  latitud: number | null
  longitud: number | null
  // Características
  superficie_total: number | null
  superficie_cubierta: number | null
  ambientes: number | null
  dormitorios: number | null
  banos: number | null
  cocheras: number | null
  antiguedad_anos: number | null
  tiene_ascensor: boolean
  tiene_balcon: boolean
  tiene_terraza: boolean
  tiene_piscina: boolean
  permite_mascotas: boolean
  // Precios
  precio_alquiler: number | null
  moneda_alquiler: string | null
  precio_venta: number | null
  moneda_venta: string | null
  expensas_monto: number | null
}

export interface ImagenPublica {
  id: string
  storage_path: string
  url: string
  es_portada: boolean
  orden: number
  alt_text: string | null
}

// ─── web_config typed shapes ──────────────────────────────────

export interface WebConfigContacto {
  whatsapp_number?: string
  telefono_visible?: string
  email_contacto?: string
  direccion?: string
  horario?: string
}

export interface WebConfigRedes {
  instagram_url?: string
  facebook_url?: string
  linkedin_url?: string
}

export interface WebConfigEmpresa {
  nombre?: string
  matriculas?: string
  tagline?: string
}

export interface WebConfigSeo {
  seo_default_title?: string
  seo_default_description?: string
  seo_og_title?: string
  seo_og_description?: string
  seo_og_image?: string
}

// ─── Home sections ────────────────────────────────────────────

export interface WebConfigHero {
  hero_label?: string
  hero_title_line_1?: string
  hero_title_line_2?: string
  hero_subtitle?: string
  hero_primary_cta_label?: string
  hero_primary_cta_href?: string
  hero_secondary_cta_label?: string
  hero_secondary_cta_href?: string
}

export interface WebConfigSobreRadix {
  intro_label?: string
  intro_title_line_1?: string
  intro_title_line_2?: string
  intro_paragraph_1?: string
  intro_paragraph_2?: string
  intro_paragraph_3?: string
  founder_name?: string
  founder_role?: string
  years_active?: string
}

export interface WebConfigMetricaItem {
  value?: string
  prefix?: string
  suffix?: string
  label?: string
  sublabel?: string
}

export interface WebConfigMetricas {
  items?: WebConfigMetricaItem[]
}

export interface WebConfigCtaFinal {
  cta_label?: string
  cta_headline_1?: string
  cta_headline_2?: string
  cta_subtitle?: string
  cta_primary_label?: string
  cta_primary_href?: string
  cta_location_line?: string
}

// ─── Component-facing config shapes ──────────────────────────

export interface HeroConfig {
  label: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export interface SobreRadixConfig {
  label: string
  titleLine1: string
  titleLine2: string
  paragraphs: string[]
}

export interface MetricaItem {
  value: number
  prefix: string
  suffix: string
  label: string
  sub: string
}

export interface CtaFinalConfig {
  ctaLabel: string
  headline1: string
  headline2: string
  subtitle: string
  primaryCtaLabel: string
  primaryCtaHref: string
  locationLine: string
}

// ─── Territorio ───────────────────────────────────────────────

export interface WebConfigTerritorio {
  territory_label?: string
  territory_title_1?: string
  territory_title_2?: string
  territory_subtitle?: string
  coming_soon_text?: string
  coming_soon_cities?: string[]
  locations?: Array<{
    name?: string
    badge?: string
    address?: string
    description?: string
    active?: boolean
    order?: number
  }>
}

export interface TeritorioLocation {
  name: string
  badge: string
  address: string
  description: string
}

export interface TeritorioConfig {
  label: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  comingSoonText: string
  comingSoonCities: string[]
  locations: TeritorioLocation[]
}

// ─── Servicios ────────────────────────────────────────────────

export interface WebConfigServicios {
  section_label?: string
  section_title_1?: string
  section_title_2?: string
  section_subtitle?: string
  panels?: Array<{
    title?: string
    description?: string
    metric?: string
    subMetric?: string
    href?: string
    active?: boolean
    order?: number
  }>
}

export interface ServiciosPanel {
  title: string
  description: string
  metric: string
  subMetric: string
  href: string
}

export interface ServiciosConfig {
  label: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  panels: ServiciosPanel[]
}

// ─── Administración Home ──────────────────────────────────────

export interface WebConfigAdministracionHome {
  label?: string
  title_1?: string
  title_2?: string
  paragraph?: string
  cta_primary_label?: string
  cta_primary_href?: string
  cta_secondary_label?: string
  cta_secondary_href?: string
  metric_1_value?: string
  metric_1_label?: string
  metric_2_value?: string
  metric_2_label?: string
  features?: Array<{
    title?: string
    description?: string
    active?: boolean
    order?: number
  }>
}

export interface AdministracionFeature {
  title: string
  description: string
}

export interface AdministracionHomeConfig {
  label: string
  titleLine1: string
  titleLine2: string
  paragraph: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
  metric1Value: string
  metric1Label: string
  metric2Value: string
  metric2Label: string
  features: AdministracionFeature[]
}

// ─── Inversiones Home ─────────────────────────────────────────

export interface WebConfigInversionesHome {
  label?: string
  title_1?: string
  title_2?: string
  paragraph?: string
  banner_question?: string
  banner_sub?: string
  banner_cta_label?: string
  banner_cta_href?: string
  areas?: Array<{
    title?: string
    description?: string
    badge?: string
    type?: string
    active?: boolean
    order?: number
  }>
}

export interface InversionesArea {
  title: string
  description: string
  badge: string
  type: string
}

export interface InversionesHomeConfig {
  label: string
  titleLine1: string
  titleLine2: string
  paragraph: string
  bannerQuestion: string
  bannerSub: string
  bannerCtaLabel: string
  bannerCtaHref: string
  areas: InversionesArea[]
}

// ─── Testimonios ──────────────────────────────────────────────

export interface WebConfigTestimonios {
  section_label?: string
  title_line_1?: string
  title_line_2?: string
  items?: Array<{
    name?: string
    role?: string
    company?: string
    content?: string
    rating?: number
    active?: boolean
    order?: number
  }>
}

export interface TestimonioItem {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
}

export interface TestimoniosConfig {
  label: string
  titleLine1: string
  titleLine2: string
  items: TestimonioItem[]
}
