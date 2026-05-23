'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, MapPin, Building2, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const INVESTMENT_AREAS = [
  {
    icon: MapPin,
    title: 'Salta Capital',
    description: 'Centro histórico en revalorización, corredor de Av. Tavella y desarrollo residencial en Tres Ceibos.',
    yield: '8–12% USD',
    type: 'Renta + plusvalía',
  },
  {
    icon: Building2,
    title: 'NOA en expansión',
    description: 'Jujuy, San Salvador y Valle de Lerma: mercados sub-penetrados con alto potencial de apreciación capital.',
    yield: '10–15% USD',
    type: 'Plusvalía',
  },
  {
    icon: TrendingUp,
    title: 'Buenos Aires',
    description: 'Reposicionamiento de activos comerciales en microcentro y desarrollos residenciales en Palermo y Belgrano.',
    yield: '6–9% USD',
    type: 'Renta corporativa',
  },
]

export function Investments() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden bg-radix-void">
      {/* Background accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(1,114,198,0.3), transparent)',
        }}
      />

      <div className="section-container">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-6">
            <motion.div
              className="label-tag mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Inversiones
            </motion.div>

            <motion.h2
              className="font-serif text-display-3 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Salta como
              <br />
              activo estratégico.
            </motion.h2>
          </div>
          <div className="lg:col-span-6 lg:flex lg:items-end">
            <motion.p
              className="text-radix-text-3 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              El NOA está posicionándose como uno de los mercados de mayor proyección en Argentina. RADIX identifica, estructura y ejecuta las oportunidades antes de que sean obvias.
            </motion.p>
          </div>
        </div>

        {/* Investment cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {INVESTMENT_AREAS.map((area, i) => {
            const Icon = area.icon
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group p-7 rounded-2xl bg-radix-surface border border-radix-border
                           hover:border-radix-border-2 hover:bg-radix-surface-2
                           transition-all duration-500 ease-radix relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                     style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(1,114,198,0.08) 0%, transparent 70%)' }} />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-radix-blue/10 border border-radix-blue/20
                                  flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-radix-blue" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">{area.title}</h3>
                  <p className="text-sm text-radix-text-3 leading-relaxed mb-6">{area.description}</p>

                  <div className="pt-5 border-t border-radix-border">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-radix-text-4 mb-1">Retorno estimado</div>
                        <div className="text-xl font-light text-white">{area.yield}</div>
                      </div>
                      <span className="highlight-badge">{area.type}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA row */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl
                     bg-gradient-to-r from-radix-blue/10 to-radix-blue-dark/10
                     border border-radix-blue/20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <div className="text-white font-medium mb-1">¿Buscás una oportunidad de inversión?</div>
            <div className="text-radix-text-3 text-sm">Nuestro equipo analiza tu perfil y te presenta activos que matchean con tus objetivos.</div>
          </div>
          <Link href="/inversiones" className="btn-primary whitespace-nowrap">
            Ver oportunidades
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
