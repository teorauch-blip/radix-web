'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { PropertyCard } from '@/components/property/property-card'
import { Property, PropertyType } from '@/types'
import type { InventarioHomeConfig } from '@/lib/types/db'

interface InventoryProps {
  properties: Property[]
  cms?: InventarioHomeConfig
}

const FILTERS: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Venta', value: 'venta' },
  { label: 'Alquiler', value: 'alquiler' },
  { label: 'Inversión', value: 'inversion' },
  { label: 'Desarrollos', value: 'desarrollo' },
]

export function Inventory({ properties, cms }: InventoryProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [activeFilter, setActiveFilter] = useState<PropertyType | 'all'>('all')

  const label              = cms?.label              || 'Inventario'
  const titleLine1         = cms?.titleLine1         || 'Propiedades'
  const titleLine2         = cms?.titleLine2         || 'disponibles.'
  const emptyMessage       = cms?.emptyMessage       || 'No hay propiedades en esta categoría por el momento.'
  const filtersButtonLabel = cms?.filtersButtonLabel || 'Buscar con filtros'
  const filtersButtonHref  = cms?.filtersButtonHref  || '/propiedades'
  const viewAllHref        = cms?.viewAllHref        || '/propiedades'
  const maxDisplay         = cms?.maxDisplay         ?? 6

  const filtered =
    activeFilter === 'all'
      ? properties
      : properties.filter((p) => p.type === activeFilter)

  return (
    <section ref={ref} className="pb-28 lg:pb-40 relative overflow-hidden">

      {/* ── Base — radial: bright navy center, dark edges ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 32%, #2C4A78 0%, #162C4E 55%, #0C1E36 100%)',
        }}
      />

      {/* ── Central bloom — main light source ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 28%, rgba(20,100,190,0.40) 0%, transparent 62%)',
        }}
      />

      {/* ── Top ceiling light ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 55% 22% at 50% 0%, rgba(30,120,210,0.22) 0%, transparent 70%)',
        }}
      />

      {/* ── Left ambient halo ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 50% 65% at 0% 42%, rgba(0,80,175,0.18) 0%, transparent 60%)',
        }}
      />

      {/* ── Right ambient halo ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 44% 55% at 100% 36%, rgba(8,24,110,0.20) 0%, transparent 56%)',
        }}
      />

      {/* ── Warm accent ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 50% 35% at 50% 22%, rgba(175,135,80,0.055) 0%, transparent 50%)',
        }}
      />

      {/* ── Grid arquitectónico ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="section-container relative z-10 pt-10 lg:pt-14">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <motion.div
              className="label-tag mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {label}
            </motion.div>
            <motion.h2
              className="font-serif text-display-3 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {titleLine1}
              <br />
              {titleLine2}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={filtersButtonHref} className="btn-ghost text-sm group">
              <SlidersHorizontal className="w-4 h-4" />
              {filtersButtonLabel}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Filter pills */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                activeFilter === f.value
                  ? 'bg-radix-blue text-white shadow-[0_0_20px_rgba(1,114,198,0.3)]'
                  : 'bg-radix-surface border border-radix-border text-radix-text-3 hover:border-radix-border-2 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(0, maxDisplay).map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-radix-text-4 text-sm">{emptyMessage}</div>
            <button
              onClick={() => setActiveFilter('all')}
              className="btn-ghost mt-4 text-sm"
            >
              Ver todas
            </button>
          </div>
        )}

        {filtered.length > maxDisplay && (
          <div className="text-center mt-10">
            <Link href={viewAllHref} className="btn-outline">
              Ver las {filtered.length} propiedades
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
