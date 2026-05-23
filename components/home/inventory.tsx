'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { PropertyCard } from '@/components/property/property-card'
import { Property, PropertyType } from '@/types'

interface InventoryProps {
  properties: Property[]
}

const FILTERS: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Venta', value: 'venta' },
  { label: 'Alquiler', value: 'alquiler' },
  { label: 'Inversión', value: 'inversion' },
  { label: 'Desarrollos', value: 'desarrollo' },
]

export function Inventory({ properties }: InventoryProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [activeFilter, setActiveFilter] = useState<PropertyType | 'all'>('all')

  const filtered =
    activeFilter === 'all'
      ? properties
      : properties.filter((p) => p.type === activeFilter)

  return (
    <section ref={ref} className="section-padding bg-radix-void">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <motion.div
              className="label-tag mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Inventario
            </motion.div>
            <motion.h2
              className="font-serif text-display-3 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Propiedades
              <br />
              disponibles.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/propiedades" className="btn-ghost text-sm group">
              <SlidersHorizontal className="w-4 h-4" />
              Buscar con filtros
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
            {filtered.slice(0, 6).map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-radix-text-4 text-sm">No hay propiedades en esta categoría por el momento.</div>
            <button
              onClick={() => setActiveFilter('all')}
              className="btn-ghost mt-4 text-sm"
            >
              Ver todas
            </button>
          </div>
        )}

        {filtered.length > 6 && (
          <div className="text-center mt-10">
            <Link href="/propiedades" className="btn-outline">
              Ver las {filtered.length} propiedades
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
