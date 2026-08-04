'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { TasacionesHomeConfig } from '@/lib/types/db'

interface ValuationsProps {
  cms?: TasacionesHomeConfig
}

const FEATURES_FALLBACK = [
  { title: 'Análisis de mercado', description: 'Estudiamos oferta comparable, antecedentes y condiciones actuales.' },
  { title: 'Conocimiento local',  description: 'Interpretamos ubicación, entorno, tipología y potencial comercial.' },
  { title: 'Criterio profesional', description: 'Definimos un rango de valor con fundamentos y una estrategia clara.' },
  { title: 'Acompañamiento',      description: 'Te ayudamos a decidir cómo vender, alquilar o administrar el inmueble.' },
]

/**
 * Sección de Tasaciones de la Home.
 *
 * Composición deliberadamente distinta a Inventory (grilla de fichas) y a
 * Administration (grilla de tarjetas 2×2): acá el peso lo lleva un índice
 * numerado con hairlines, sin contenedores cerrados ni imágenes.
 */
export function Valuations({ cms }: ValuationsProps = {}) {
  const label             = cms?.label             || 'Tasaciones'
  const titleLine1        = cms?.titleLine1        || 'El valor correcto'
  const titleLine2        = cms?.titleLine2        || 'cambia la decisión.'
  const paragraph         = cms?.paragraph         || 'Una tasación profesional combina análisis de mercado, conocimiento local y criterio comercial para definir un valor serio, competitivo y defendible.'
  const ctaPrimaryLabel   = cms?.ctaPrimaryLabel   || 'Solicitar una tasación'
  const ctaPrimaryHref    = cms?.ctaPrimaryHref    || '/tasaciones'
  const ctaSecondaryLabel = cms?.ctaSecondaryLabel || 'Hablar con un asesor'
  const ctaSecondaryHref  = cms?.ctaSecondaryHref  || '/contacto'
  const features          = cms?.features?.length ? cms.features : FEATURES_FALLBACK

  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden bg-radix-abyss">
      {/* Halo frío desplazado a la izquierda — invierte el de Administración */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 12% 35%, rgba(14,96,175,0.13) 0%, transparent 68%)',
        }}
      />
      {/* Acento champagne muy contenido, sobre el índice */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'radial-gradient(ellipse 34% 42% at 88% 60%, rgba(196,168,112,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 lg:gap-20 items-start">

          {/* ── Columna editorial ── */}
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
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={ctaPrimaryHref} className="btn-primary">
                {ctaPrimaryLabel}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href={ctaSecondaryHref} className="btn-ghost">
                {ctaSecondaryLabel}
              </Link>
            </motion.div>
          </div>

          {/* ── Índice numerado ── */}
          <ol className="relative">
            {/* Riel vertical del índice */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px hidden sm:block"
              style={{
                background:
                  'linear-gradient(180deg, transparent, rgba(196,168,112,0.28) 12%, rgba(196,168,112,0.28) 88%, transparent)',
              }}
              aria-hidden="true"
            />

            {features.map((feature, i) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.2 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
                className="group relative sm:pl-10 py-7 first:pt-0 border-b border-radix-border last:border-b-0"
              >
                {/* Marca sobre el riel */}
                <span
                  className="absolute left-0 top-8 hidden sm:block h-px w-5 bg-radix-gold/40
                             transition-all duration-500 ease-radix group-hover:w-8 group-hover:bg-radix-gold/70"
                  aria-hidden="true"
                />

                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-radix-gold/85 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-white text-xl lg:text-2xl font-light tracking-tight">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-radix-text-4 text-sm leading-relaxed mt-3 sm:pl-[3.1rem] max-w-md">
                  {feature.description}
                </p>
              </motion.li>
            ))}
          </ol>

        </div>
      </div>
    </section>
  )
}
