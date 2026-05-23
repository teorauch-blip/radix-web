'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const PANELS = [
  {
    id: 'residencial',
    number: '01',
    label: 'Residencial',
    title: 'Vivir con criterio',
    description:
      'Casas, apartamentos y desarrollos premium en las mejores ubicaciones de Salta y Buenos Aires. Arquitectura contemporánea, entornos curados.',
    href: '/propiedades?categoria=residencial',
    accent: '#0172C6',
    metric: '+140 propiedades',
    subMetric: 'activos residenciales',
  },
  {
    id: 'comercial',
    number: '02',
    label: 'Comercial',
    title: 'Espacios que producen',
    description:
      'Locales comerciales, oficinas y plantas industriales. Análisis de rentabilidad, due diligence jurídico y gestión integral del activo.',
    href: '/propiedades?categoria=comercial',
    accent: '#0E1B8C',
    metric: '+60 propiedades',
    subMetric: 'activos comerciales',
  },
  {
    id: 'desarrollo',
    number: '03',
    label: 'Desarrollos',
    title: 'Capital en movimiento',
    description:
      'Lotes estratégicos, proyectos en pozo y oportunidades de desarrollo. Identificamos el activo, estructuramos la operación, acompañamos el retorno.',
    href: '/inversiones',
    accent: '#0172C6',
    metric: '+12 proyectos',
    subMetric: 'en desarrollo activo',
  },
  {
    id: 'administracion',
    number: '04',
    label: 'Administración',
    title: 'Tu patrimonio, en orden',
    description:
      'Gestión profesional de carteras inmobiliarias. Cobranzas, mantenimiento, informes de rendimiento y optimización continua.',
    href: '/administracion',
    accent: '#0E1B8C',
    metric: '96%',
    subMetric: 'tasa de retención',
  },
]

export function ExperiencePanels() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activePanel, setActivePanel] = useState<string | null>(null)

  return (
    <section ref={ref} className="section-padding bg-radix-dark">
      <div className="section-container">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div>
            <motion.div
              className="label-tag mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Servicios
            </motion.div>
            <motion.h2
              className="font-serif text-display-3 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Cada dimensión
              <br />
              del mercado.
            </motion.h2>
          </div>
          <motion.p
            className="text-radix-text-3 text-lg leading-relaxed self-end"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Operamos en todos los segmentos del mercado inmobiliario con la misma exigencia. Cuatro áreas de práctica, una sola vara de calidad.
          </motion.p>
        </div>

        {/* Panel grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {PANELS.map((panel, i) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActivePanel(panel.id)}
              onMouseLeave={() => setActivePanel(null)}
              className="group relative overflow-hidden rounded-2xl bg-radix-surface border border-radix-border
                         cursor-pointer transition-all duration-500 ease-radix
                         hover:border-radix-border-2 hover:bg-radix-surface-2"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse at 30% 50%, ${panel.accent}10 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10 p-8">
                {/* Number + label */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-radix-text-4 font-mono tracking-widest">
                    {panel.number}
                  </span>
                  <span className="highlight-badge">{panel.label}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-heading-1 text-white mb-4 group-hover:text-white transition-colors">
                  {panel.title}
                </h3>

                {/* Description */}
                <p className="text-radix-text-3 text-sm leading-relaxed mb-8">
                  {panel.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-light text-white">{panel.metric}</div>
                    <div className="text-xs text-radix-text-4 mt-1">{panel.subMetric}</div>
                  </div>

                  <Link
                    href={panel.href}
                    className="flex items-center gap-2 text-xs text-radix-text-3 group-hover:text-radix-blue
                               transition-colors duration-200"
                  >
                    Ver más
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${panel.accent}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
