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
