export type PropertyType = 'venta' | 'alquiler' | 'desarrollo' | 'inversion'
export type PropertyCategory = 'residencial' | 'comercial' | 'oficina' | 'lote' | 'desarrollo' | 'penthouse'
export type PropertyStatus = 'disponible' | 'reservado' | 'vendido' | 'alquilado' | 'en-construccion'
export type Currency = 'USD' | 'ARS'

export interface Property {
  id: string
  slug: string
  title: string
  short_description: string
  description?: string
  type: PropertyType
  category: PropertyCategory
  status: PropertyStatus
  price: number
  currency: Currency
  price_period?: string
  surface_total: number
  surface_covered?: number
  bedrooms?: number
  bathrooms?: number
  parking_spaces?: number
  floor?: number
  total_floors?: number
  address: string
  neighborhood: string
  city: string
  province: string
  lat?: number
  lng?: number
  images: string[]
  cover_image: string
  amenities?: string[]
  featured: boolean
  highlight_label?: string
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  role: string
  photo?: string
  email: string
  phone?: string
  bio?: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  rating: number
}

export interface Inquiry {
  name: string
  email: string
  phone?: string
  message?: string
  property_id?: string
  type: 'contacto' | 'visita' | 'info'
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
