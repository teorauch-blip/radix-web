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
  detail_1_label?: string
  detail_1_sublabel?: string
  detail_2_label?: string
  detail_2_sublabel?: string
  detail_3_label?: string
  detail_3_sublabel?: string
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

export interface SobreRadixDetail {
  label: string
  sub: string
}

export interface SobreRadixConfig {
  label: string
  titleLine1: string
  titleLine2: string
  paragraphs: string[]
  details: SobreRadixDetail[]
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

// ─── Inventario Home ──────────────────────────────────────────

export interface WebConfigInventarioHome {
  label?: string
  title_1?: string
  title_2?: string
  empty_message?: string
  filters_button_label?: string
  filters_button_href?: string
  view_all_label?: string
  view_all_href?: string
  max_display?: number
}

export interface InventarioHomeConfig {
  label: string
  titleLine1: string
  titleLine2: string
  emptyMessage: string
  filtersButtonLabel: string
  filtersButtonHref: string
  viewAllLabel: string
  viewAllHref: string
  maxDisplay: number
}

// ─── Navbar ───────────────────────────────────────────────────

export interface WebConfigNavbar {
  nav_cta_label?: string
  nav_cta_href?: string
  nav_links?: Array<{
    label?: string
    href?: string
    active?: boolean
    order?: number
  }>
}

export interface NavbarLink {
  label: string
  href: string
}

export interface NavbarConfig {
  ctaLabel: string
  ctaHref: string
  navLinks: NavbarLink[]
}

// ─── Footer ───────────────────────────────────────────────────

export interface WebConfigFooter {
  tagline?: string
  servicios_title?: string
  servicios_links?: Array<{
    label?: string
    href?: string
    active?: boolean
    order?: number
  }>
  empresa_title?: string
  empresa_links?: Array<{
    label?: string
    href?: string
    active?: boolean
    order?: number
  }>
  newsletter_title?: string
  newsletter_description?: string
  newsletter_placeholder?: string
  newsletter_button_label?: string
  copyright_entity?: string
  privacy_label?: string
  privacy_href?: string
  terms_label?: string
  terms_href?: string
}

export interface FooterLinkItem {
  label: string
  href: string
}

export interface FooterConfig {
  tagline: string
  serviciosTitle: string
  serviciosLinks: FooterLinkItem[]
  empresaTitle: string
  empresaLinks: FooterLinkItem[]
  newsletterTitle: string
  newsletterDescription: string
  newsletterPlaceholder: string
  newsletterButtonLabel: string
  copyrightEntity: string
  privacyLabel: string
  privacyHref: string
  termsLabel: string
  termsHref: string
}

// ─── Equipo Nosotros ──────────────────────────────────────────

export interface WebConfigEquipoNosotros {
  section_label?: string
  title_line_1?: string
  title_line_2?: string
  items?: Array<{
    nombre?: string
    cargo?: string
    descripcion?: string
    foto_url?: string
    orden?: number
    activo?: boolean
    linkedin_url?: string
    email?: string
  }>
}

export interface EquipoMiembro {
  nombre: string
  cargo: string
  descripcion: string
  fotoUrl: string
  linkedinUrl: string
  email: string
}

export interface EquipoNosotrosConfig {
  sectionLabel: string
  titleLine1: string
  titleLine2: string
  items: EquipoMiembro[]
}

// ─── Filtros Propiedades ──────────────────────────────────────

/** Forma raw que guarda el CMS en web_config */
export interface WebConfigFiltrosPropiedades {
  operaciones?: Array<{ label?: string; value?: string; active?: boolean; order?: number }>
  tipos?:       Array<{ label?: string; value?: string; active?: boolean; order?: number }>
  ubicaciones?: Array<{ label?: string; value?: string; active?: boolean; order?: number }>
  dormitorios?: Array<{ label?: string; value?: string; active?: boolean; order?: number }>
}

/** Opción individual ya procesada (solo activas, ordenadas, lista para usar) */
export interface FiltroOpcion {
  label: string
  value: string
}

/** Config completa de filtros, lista para pasarla al componente */
export interface FiltrosPropiedadesConfig {
  operaciones: FiltroOpcion[]
  tipos:       FiltroOpcion[]
  ubicaciones: FiltroOpcion[]
  dormitorios: FiltroOpcion[]
}
