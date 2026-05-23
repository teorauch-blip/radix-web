'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const FEATURES = [
  {
    title: 'Gestión de cobros y pagos',
    desc: 'Control de alquileres, expensas y gastos operativos con reportes mensuales detallados.',
  },
  {
    title: 'Mantenimiento preventivo',
    desc: 'Red de proveedores verificados. Intervenciones planificadas y respuesta en 24 horas.',
  },
  {
    title: 'Informes de rendimiento',
    desc: 'Dashboard de situación patrimonial, ocupación y rentabilidad histórica.',
  },
  {
    title: 'Gestión de contratos',
    desc: 'Redacción, renovación, indexación y rescisión conforme a la normativa vigente.',
  },
  {
    title: 'Optimización de cartera',
    desc: 'Análisis periódico de mercado con recomendaciones para maximizar el retorno.',
  },
  {
    title: 'Atención a inquilinos',
    desc: 'Canal dedicado de comunicación. Resolución de conflictos y seguimiento.',
  },
]

export function Administration() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-radix-dark" />
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
              Administración
            </motion.div>

            <motion.h2
              className="font-serif text-display-3 text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Tu patrimonio,
              <br />
              <span className="italic text-radix-text-3">en orden.</span>
            </motion.h2>

            <motion.p
              className="text-radix-text-3 text-lg leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Gestionamos carteras inmobiliarias de propietarios que exigen orden, transparencia y retornos optimizados. Sin excusas, sin improvisación.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/administracion" className="btn-primary">
                Más sobre administración
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="/contacto" className="btn-ghost">
                Consultar
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
                  <div className="text-4xl font-light text-white">96%</div>
                  <div className="text-xs text-radix-text-4 mt-1">clientes que renuevan</div>
                </div>
                <div>
                  <div className="text-4xl font-light text-white">48h</div>
                  <div className="text-xs text-radix-text-4 mt-1">tiempo máximo de respuesta</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Feature list */}
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
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
                <p className="text-xs text-radix-text-4 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
