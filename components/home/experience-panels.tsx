'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { SERVICE_PANELS } from '@/lib/content/home'
import type { ServiciosConfig } from '@/lib/types/db'

interface ExperiencePanelsProps {
  cms?: ServiciosConfig
}

export function ExperiencePanels({ cms }: ExperiencePanelsProps = {}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activePanel, setActivePanel] = useState<string | null>(null)

  // Merge CMS text over SERVICE_PANELS structure (id, number, accent stay fixed)
  const resolvedPanels = SERVICE_PANELS.map((panel, i) => ({
    ...panel,
    title:       cms?.panels?.[i]?.title       || panel.title,
    description: cms?.panels?.[i]?.description || panel.description,
    metric:      cms?.panels?.[i]?.metric      || panel.metric,
    subMetric:   cms?.panels?.[i]?.subMetric   || panel.subMetric,
    href:        cms?.panels?.[i]?.href        || panel.href,
  }))

  const label     = cms?.label     || 'Servicios'
  const titleLine1 = cms?.titleLine1 || 'Cada dimensión'
  const titleLine2 = cms?.titleLine2 || 'del mercado.'
  const subtitle  = cms?.subtitle  || 'Operamos en todos los segmentos del mercado inmobiliario con la misma exigencia y criterio profesional.'

  return (
    <section ref={ref} className="section-padding bg-radix-navy">
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
          <motion.p
            className="text-radix-text-3 text-lg leading-relaxed self-end"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Panel grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {resolvedPanels.map((panel, i) => (
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
                {/* Number */}
                <div className="mb-8">
                  <span className="text-xs text-radix-text-4 font-mono tracking-widest">
                    {panel.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-display-3 text-white mb-5 leading-none">
                  {panel.title}
                </h3>

                {/* Description */}
                <p className="text-radix-text-3 text-sm leading-relaxed mb-8">
                  {panel.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-light text-radix-text-2">{panel.metric}</div>
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
