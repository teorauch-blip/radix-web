'use client'

import Link from 'next/link'
import { PropertyCardImage } from '@/components/property/property-card-image'
import { motion } from 'framer-motion'
import { Bed, Bath, Square, ArrowUpRight, MapPin } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, formatSurface } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  index?: number
  variant?: 'default' | 'featured'
  /** Clases extra sobre la tarjeta. /propiedades la usa para ocultar el excedente
   *  de "Cargar más" con `hidden`, sin envolverla en un div que rompería el
   *  estirado del grid ni sacarla del HTML. */
  className?: string
  /**
   * Se invoca cuando el usuario abre la propiedad, en el onClick del propio
   * link. Opcional y sin default: quien no la pasa (Home, /propiedades) se
   * comporta exactamente igual que antes.
   *
   * Va acá y no en un listener delegado por el mismo motivo que en
   * TrackedWhatsAppLink: atado al elemento que se clickea, el handler corre
   * siempre que el link se vea, sin depender de que el evento burbujee.
   * Nunca cancela la navegación.
   */
  onOpen?: () => void
  /**
   * Entrada animada al entrar en viewport (Framer Motion). Por defecto `true`:
   * es lo que hacen el Home y /propiedades desde siempre.
   *
   * En `false` la tarjeta se pinta directamente en su estado final. Existe por
   * la landing de Ads: con la animación puesta, el HTML del servidor sale con
   * `opacity: 0` inline y las tarjetas recién se ven cuando bajó, parseó e
   * hidrató Framer Motion. En una landing donde el usuario llega desde un
   * anuncio, eso es una pantalla vacía durante el peor momento posible. Es el
   * mismo razonamiento que llevó a reescribir la entrada del hero en CSS puro
   * (ver app/globals.css).
   */
  animate?: boolean
}

// Badge de operación — derivado de los precios (ver adaptPropiedad).
const OPERATION_LABEL: Record<string, string> = {
  venta:          'Venta',
  alquiler:       'Alquiler',
  venta_alquiler: 'Venta / Alquiler',
}

// Badge de tipo físico — un terreno es "Terreno", nunca "Desarrollo".
const KIND_LABEL: Record<string, string> = {
  casa:         'Casa',
  departamento: 'Departamento',
  duplex:       'Dúplex',
  local:        'Local',
  oficina:      'Oficina',
  galpon:       'Galpón',
  terreno:      'Terreno',
  cochera:      'Cochera',
  desarrollo:   'Desarrollo',
  otro:         'Propiedad',
}

const badgeClass =
  'inline-flex items-center px-2.5 py-1 text-[0.65rem] font-medium tracking-wide ' +
  'uppercase rounded-full bg-black/40 backdrop-blur-sm text-white/80 border border-white/10'

/** Tarjetas por fila en el breakpoint más ancho del grid (lg:grid-cols-3 × 2 filas). */
const STAGGER_CICLO = 6

export function PropertyCard({
  property,
  index = 0,
  variant = 'default',
  className = '',
  onOpen,
  animate = true,
}: PropertyCardProps) {
  const isFeatured = variant === 'featured'

  // El desfase se reinicia cada STAGGER_CICLO tarjetas. Con `index * 0.1` plano, la
  // tarjeta 48 esperaba 4,8s desde que entraba en viewport antes de aparecer: en un
  // listado largo se lee como que la página se colgó, y con "Cargar más" el lote
  // recién revelado tardaba segundos en pintarse. Para el Home (índices 0-5) el
  // resultado es idéntico al anterior.
  const delay = (index % STAGGER_CICLO) * 0.1

  // Barrio + ciudad, salteando los vacíos. `adaptPropiedad` resuelve el barrio
  // con `p.barrio ?? p.ciudad`, y `??` no atrapa el string vacío: cuando el CRM
  // trae el barrio en blanco, `{neighborhood}, {city}` arrancaba con una coma
  // colgada (", Salta Centro").
  const ubicacion = [property.neighborhood, property.city]
    .map((parte) => (parte ?? '').trim())
    .filter(Boolean)
    .join(', ')

  const cardClass = `group relative overflow-hidden rounded-2xl bg-radix-surface border border-radix-border
                  transition-all duration-500 ease-radix cursor-pointer
                  hover:border-radix-border-2 hover:shadow-[0_0_50px_rgba(1,114,198,0.08)]
                  ${isFeatured ? 'flex flex-col' : ''} ${className}`

  const contenido = (
    <>
      {/* Stretched link — toda la card es clickeable (imagen, título y contenido)
          sin anidar <a> inválidos: un único link cubre la card vía overlay. */}
      <Link
        href={`/propiedades/${property.slug}`}
        aria-label={`Ver detalle de ${property.title}`}
        onClick={onOpen}
        className="absolute inset-0 z-20 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-radix-blue"
      />

      {/* Image */}
      <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        {/* Rota sola si la propiedad trae varias fotos en `images` (hoy: solo el
            inventario del Home las carga). Con una sola, queda estática como siempre. */}
        <PropertyCardImage
          images={property.images.length > 1 ? property.images : [property.cover_image]}
          alt={property.title}
          index={index}
          className="object-cover group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-radix-black/60 via-transparent to-transparent" />

        {/* Badges: destacado (independiente) · operación · tipo */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.highlight_label && (
            <span className="highlight-badge">
              {property.highlight_label}
            </span>
          )}
          {property.operation && (
            <span className={badgeClass}>
              {OPERATION_LABEL[property.operation]}
            </span>
          )}
          {property.kind && (
            <span className={badgeClass}>
              {KIND_LABEL[property.kind] || property.kind}
            </span>
          )}
        </div>

        {/* Status badge */}
        {property.status !== 'disponible' && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-2.5 py-1 text-[0.65rem] font-medium tracking-wide
                             uppercase rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {property.status}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-radix-text-4 mb-3">
          <MapPin className="w-3 h-3" />
          {ubicacion}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-base leading-snug mb-2 group-hover:text-radix-blue-light transition-colors duration-200">
          {property.title}
        </h3>

        {/* Description */}
        <p className="text-radix-text-3 text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
          {property.short_description}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-radix-text-4 mb-5 pb-5 border-b border-radix-border">
          <div className="flex items-center gap-1.5">
            <Square className="w-3.5 h-3.5" />
            {formatSurface(property.surface_total)}
          </div>
          {/* `> 0` y no solo el valor: en JSX `{0 && <div/>}` no renderiza el div
              pero SÍ imprime el 0, así que una propiedad con 0 dormitorios o 0
              baños mostraba un "0" suelto entre los metros y el resto. */}
          {(property.bedrooms ?? 0) > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5" />
              {property.bedrooms} amb.
            </div>
          )}
          {(property.bathrooms ?? 0) > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5" />
              {property.bathrooms} baños
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-radix-text-4 mb-0.5">
              {property.operation === 'alquiler' ? `Por ${property.price_period || 'mes'}` : 'Precio'}
            </div>
            <div className="text-lg font-light text-white tracking-tight">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>

          {/* Visual únicamente — la navegación la maneja el stretched link de arriba.
              No es un <a> para evitar links anidados inválidos. */}
          <span
            className="flex items-center gap-1.5 text-xs text-radix-text-3
                       transition-colors duration-200 group-hover:text-radix-blue"
          >
            Ver detalle
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </>
  )

  // Sin animación: la tarjeta ya está en su estado final en el HTML del
  // servidor, así que se ve antes de que llegue una sola línea de JavaScript.
  if (!animate) {
    return <article className={cardClass}>{contenido}</article>
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cardClass}
    >
      {contenido}
    </motion.article>
  )
}
