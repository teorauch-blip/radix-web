'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { HERO_LABEL, HERO_STATS } from '@/lib/content/home'
import type { HeroConfig } from '@/lib/types/db'

interface HeroProps {
  cms?: HeroConfig
}

export function Hero({ cms }: HeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const label             = cms?.label             ?? HERO_LABEL
  // || en lugar de ?? para que strings vacíos ("") también activen el fallback
  const titleLine1        = cms?.titleLine1        || 'Inmuebles que'
  const titleLine2        = cms?.titleLine2        || 'definen el estándar.'
  const subtitle          = cms?.subtitle          ?? 'RADIX opera donde la estrategia y el diseño convergen. Capital inmobiliario inteligente en el NOA.'
  const primaryCtaLabel   = cms?.primaryCtaLabel   ?? 'Ver portafolio'
  const primaryCtaHref    = cms?.primaryCtaHref    ?? '/propiedades'
  const secondaryCtaLabel = cms?.secondaryCtaLabel ?? 'Hablar con un asesor'
  const secondaryCtaHref  = cms?.secondaryCtaHref  ?? '/contacto'

  // La primera palabra de la línea 2 siempre recibe el tratamiento italic/serif.
  // Con el fallback garantizado arriba, titleLine2 nunca es vacío.
  const spaceIdx       = titleLine2.indexOf(' ')
  const titleLine2First = spaceIdx === -1 ? titleLine2 : titleLine2.slice(0, spaceIdx)
  const titleLine2Tail  = spaceIdx === -1 ? ''         : titleLine2.slice(spaceIdx + 1)

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.07])
  const isotopeOpacity = useTransform(scrollYProgress, [0, 0.35], [0.012, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-radix-midnight"
    >

      {/* ── Atmospheric background ── */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 z-0">

        {/* Base — midnight blue más claro */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#18283E] to-[#142236]" />

        {/* Primary cinematic glow — center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 85% 65% at 46% 38%, rgba(12,90,155,0.16) 0%, transparent 62%)',
          }}
        />

        {/* Warm ambient — luz central suave */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 42% at 50% 44%, rgba(175,135,80,0.048) 0%, transparent 54%)',
          }}
        />

        {/* Upper-right depth */}
        <div
          className="absolute top-0 right-0 w-[1000px] h-[650px]"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(9,26,76,0.30) 0%, transparent 55%)',
          }}
        />

        {/* Lower-left counter-light */}
        <div
          className="absolute bottom-0 left-0 w-[650px] h-[420px]"
          style={{
            background:
              'radial-gradient(ellipse at bottom left, rgba(12,72,145,0.05) 0%, transparent 58%)',
          }}
        />

        {/* Architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating orbs — slow, cinematic */}
        <motion.div
          className="absolute top-[16%] left-[10%] w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(0,88,175,0.09)' }}
          animate={{ x: [0, 30, 0], y: [0, -16, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[6%] w-[480px] h-[480px] rounded-full blur-3xl"
          style={{ background: 'rgba(10,22,110,0.10)' }}
          animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[42%] right-[30%] w-52 h-52 rounded-full blur-2xl"
          style={{ background: 'rgba(155,115,45,0.042)' }}
          animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </motion.div>

      {/* ── Isotipo watermark ── ghost texture, atmospheric depth ── */}
      <motion.div
        style={{ opacity: isotopeOpacity, filter: 'blur(5px) brightness(0) invert(1)' }}
        className="absolute right-[-4%] lg:right-[2%] xl:right-[8%]
                   top-1/2 -translate-y-[46%]
                   w-[380px] h-[380px] sm:w-[500px] sm:h-[500px]
                   lg:w-[620px] lg:h-[620px]
                   pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/branding/radix-isotype.png"
          alt=""
          draggable={false}
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* ── Hero content ── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 section-container pt-32 pb-20 w-full"
      >
        <div className="max-w-[56rem]">

          {/* Location label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="label-tag mb-12"
          >
            {label}
          </motion.div>

          {/* Headline — line 1 */}
          <div className="overflow-hidden mb-1">
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-display-1 text-white font-light leading-[0.92]">
                {titleLine1}
              </h1>
            </motion.div>
          </div>

          {/* Headline — line 2 with editorial italic serif */}
          <div className="overflow-hidden mb-3">
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-display-1 font-light text-white leading-[0.92]">
                <span className="font-serif italic font-normal">{titleLine2First}</span>
                {titleLine2Tail && <>{' '}<span>{titleLine2Tail}</span></>}
              </h1>
            </motion.div>
          </div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 text-radix-text-3 text-lg lg:text-[1.15rem] font-light leading-relaxed max-w-[34rem]"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <Link href={primaryCtaHref} className="btn-primary">
              {primaryCtaLabel}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href={secondaryCtaHref} className="btn-ghost">
              {secondaryCtaLabel}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.5 }}
            className="mt-24 pt-7 border-t border-white/[0.07] flex flex-wrap gap-12 lg:gap-20"
          >
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.6 + i * 0.12 }}
              >
                <div className="text-3xl lg:text-[2.25rem] font-light text-white tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-radix-text-4 text-[0.6rem] mt-2 tracking-[0.1em] uppercase font-normal">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator — animated line ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
      >
        <span className="text-radix-text-4 text-[0.55rem] tracking-[0.3em] uppercase font-normal">
          Scroll
        </span>
        <div className="relative w-px h-10 overflow-hidden bg-white/[0.08]">
          <motion.div
            className="absolute inset-x-0 top-0 h-full"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)',
            }}
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-radix-midnight to-transparent z-10 pointer-events-none" />
    </section>
  )
}
