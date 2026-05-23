'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bed, Bath, Square, ArrowUpRight, MapPin } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, formatSurface } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  index?: number
  variant?: 'default' | 'featured'
}

const TYPE_LABEL: Record<string, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
  desarrollo: 'Desarrollo',
  inversion: 'Inversión',
}

export function PropertyCard({ property, index = 0, variant = 'default' }: PropertyCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl bg-radix-surface border border-radix-border
                  transition-all duration-500 ease-radix
                  hover:border-radix-border-2 hover:shadow-[0_0_50px_rgba(1,114,198,0.08)]
                  ${isFeatured ? 'flex flex-col' : ''}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        <Image
          src={property.cover_image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 ease-radix group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-radix-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.highlight_label && (
            <span className="highlight-badge">
              {property.highlight_label}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 text-[0.65rem] font-medium tracking-wide
                           uppercase rounded-full bg-black/40 backdrop-blur-sm text-white/80 border border-white/10">
            {TYPE_LABEL[property.type] || property.type}
          </span>
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
          {property.neighborhood}, {property.city}
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
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5" />
              {property.bedrooms} amb.
            </div>
          )}
          {property.bathrooms && (
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
              {property.type === 'alquiler' ? `Por ${property.price_period || 'mes'}` : 'Precio'}
            </div>
            <div className="text-lg font-light text-white tracking-tight">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>

          <Link
            href={`/propiedades/${property.slug}`}
            className="flex items-center gap-1.5 text-xs text-radix-text-3
                       hover:text-radix-blue transition-colors duration-200 group/link"
          >
            Ver detalle
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
