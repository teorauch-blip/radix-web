'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { AdministracionHomeConfig } from '@/lib/types/db'

const FEATURES_FALLBACK = [
  { title: 'Gestión de cobros y pagos',   description: 'Control de alquileres, expensas y gastos operativos con reportes mensuales detallados.' },
  { title: 'Mantenimiento preventivo',    description: 'Red de proveedores verificados. Intervenciones planificadas y respuesta en 24 horas.' },
  { title: 'Informes de rendimiento',     description: 'Dashboard de situación patrimonial, ocupación y rentabilidad histórica.' },
  { title: 'Gestión de contratos',        description: 'Redacción, renovación, indexación y rescisión conforme a la normativa vigente.' },
  { title: 'Optimización de cartera',     description: 'Análisis periódico de mercado con recomendaciones para maximizar el retorno.' },
  { title: 'Atención a inquilinos',       description: 'Canal dedicado de comunicación. Resolución de conflictos y seguimiento.' },
]

interface AdministrationProps {
  cms?: AdministracionHomeConfig
}

export function Administration({ cms }: AdministrationProps = {}) {
  const label              = cms?.label              || 'Administración'
  const titleLine1         = cms?.titleLine1         || 'Tu patrimonio,'
  const titleLine2         = cms?.titleLine2         || 'en orden.'
  const paragraph          = cms?.paragraph          || 'Gestionamos carteras inmobiliarias de propietarios que exigen orden, transparencia y retornos optimizados. Sin excusas, sin improvisación.'
  const ctaPrimaryLabel    = cms?.ctaPrimaryLabel    || 'Más sobre administración'
  const ctaPrimaryHref     = cms?.ctaPrimaryHref     || '/administracion'
  const ctaSecondaryLabel  = cms?.ctaSecondaryLabel  || 'Consultar'
  const ctaSecondaryHref   = cms?.ctaSecondaryHref   || '/contacto'
  const metric1Value       = cms?.metric1Value       || '96%'
  const metric1Label       = cms?.metric1Label       || 'clientes que renuevan'
  const metric2Value       = cms?.metric2Value       || '48h'
  const metric2Label       = cms?.metric2Label       || 'tiempo máximo de respuesta'
  const features           = cms?.features?.length ? cms.features : FEATURES_FALLBACK
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-radix-abyss" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(14,27,140,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              className="label-tag mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {label}
            </motion.div>

            <motion.h2
              className="font-serif text-display-3 text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {titleLine1}
              <br />
              <span className="italic text-radix-text-3">{titleLine2}</span>
            </motion.h2>

            <motion.p
              className="text-radix-text-3 text-lg leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {paragraph}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Link href={ctaPrimaryHref} className="btn-primary">
                {ctaPrimaryLabel}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href={ctaSecondaryHref} className="btn-ghost">
                {ctaSecondaryLabel}
              </Link>
            </motion.div>

            {/* Trust metric */}
            <motion.div
              className="mt-12 pt-8 border-t border-radix-border"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex gap-10">
                <div>
                  <div className="text-4xl font-light text-white">{metric1Value}</div>
                  <div className="text-xs text-radix-text-4 mt-1">{metric1Label}</div>
                </div>
                <div>
                  <div className="text-4xl font-light text-white">{metric2Value}</div>
                  <div className="text-xs text-radix-text-4 mt-1">{metric2Label}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Feature list */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="p-5 rounded-xl bg-radix-surface border border-radix-border
                           hover:border-radix-border-2 transition-colors duration-300"
              >
                <CheckCircle2 className="w-4 h-4 text-radix-blue mb-3" />
                <h4 className="text-sm font-medium text-white mb-2">{feature.title}</h4>
                <p className="text-xs text-radix-text-4 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
