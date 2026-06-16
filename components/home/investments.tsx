'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, MapPin, Building2, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { INVESTMENT_AREAS } from '@/lib/content/home'
import type { InversionesHomeConfig } from '@/lib/types/db'

const ICON_MAP = {
  MapPin,
  Building2,
  TrendingUp,
}

type IconName = keyof typeof ICON_MAP

interface InvestmentsProps {
  cms?: InversionesHomeConfig
}

export function Investments({ cms }: InvestmentsProps = {}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // Merge CMS text over INVESTMENT_AREAS structure (iconName stays fixed by index)
  const resolvedAreas = (cms?.areas?.length ? cms.areas : INVESTMENT_AREAS).map((area, i) => ({
    iconName:    (INVESTMENT_AREAS[i % INVESTMENT_AREAS.length]?.iconName ?? 'MapPin') as IconName,
    title:       area.title       || INVESTMENT_AREAS[i]?.title       || '',
    description: area.description || INVESTMENT_AREAS[i]?.description || '',
    badge:       area.badge       || INVESTMENT_AREAS[i]?.badge       || '',
    type:        area.type        || INVESTMENT_AREAS[i]?.type        || '',
  }))

  const label          = cms?.label          || 'Inversiones'
  const titleLine1     = cms?.titleLine1     || 'Salta como'
  const titleLine2     = cms?.titleLine2     || 'activo estratégico.'
  const paragraph      = cms?.paragraph      || 'El NOA tiene un mercado en crecimiento sostenido. RADIX acompaña operaciones de inversión con criterio profesional y conocimiento local del mercado salteño.'
  const bannerQuestion = cms?.bannerQuestion || '¿Buscás una oportunidad de inversión?'
  const bannerSub      = cms?.bannerSub      || 'Nuestro equipo analiza tu perfil y te presenta activos que se ajustan a tus objetivos.'
  const bannerCtaLabel = cms?.bannerCtaLabel || 'Ver oportunidades'
  const bannerCtaHref  = cms?.bannerCtaHref  || '/inversiones'

  return (
    <section ref={ref} className="section-padding relative overflow-hidden bg-radix-abyss">
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
          <div className="lg:col-span-6 lg:flex lg:items-end">
            <motion.p
              className="text-radix-text-3 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {paragraph}
            </motion.p>
          </div>
        </div>

        {/* Investment cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {resolvedAreas.map((area, i) => {
            const Icon = ICON_MAP[area.iconName]
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
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                     style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(1,114,198,0.08) 0%, transparent 70%)' }} />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-radix-blue/[0.10] border border-radix-blue/[0.20]
                                  flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-radix-blue" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">{area.title}</h3>
                  <p className="text-sm text-radix-text-3 leading-relaxed mb-6">{area.description}</p>

                  <div className="pt-5 border-t border-radix-border">
                    <div className="flex items-end justify-between">
                      <span className="highlight-badge">{area.badge}</span>
                      <span className="text-xs text-radix-text-4">{area.type}</span>
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
                     bg-gradient-to-r from-radix-blue/[0.10] to-radix-blue-dark/[0.10]
                     border border-radix-blue/[0.20]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <div className="text-white font-medium mb-1">{bannerQuestion}</div>
            <div className="text-radix-text-3 text-sm">{bannerSub}</div>
          </div>
          <Link href={bannerCtaHref} className="btn-primary whitespace-nowrap">
            {bannerCtaLabel}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
