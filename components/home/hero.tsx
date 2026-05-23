'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

const STATS = [
  { value: '+240', label: 'Operaciones concretadas' },
  { value: '12+', label: 'Años de trayectoria' },
  { value: 'USD 180M', label: 'En activos gestionados' },
]

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-radix-void"
    >
      {/* Background layers */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        {/* Deep gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080E] via-[#080C14] to-[#04060A]" />

        {/* Radial glow — center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(1,114,198,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-[800px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(14,27,140,0.15) 0%, transparent 65%)',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(1,114,198,0.07)' }}
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[10%] w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(14,27,140,0.08)' }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 section-container pt-28 pb-16 w-full"
      >
        <div className="max-w-5xl">
          {/* Location label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="label-tag mb-10"
          >
            Salta · Buenos Aires · Argentina
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-serif text-display-1 text-white leading-[0.92]">
                Inmuebles que
              </h1>
            </motion.div>
          </div>

          <div className="overflow-hidden mb-2">
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-serif text-display-1 leading-[0.92]">
                <span className="text-gradient">definen</span>{' '}
                <span className="text-white">el estándar.</span>
              </h1>
            </motion.div>
          </div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-radix-text-3 text-lg lg:text-xl font-light leading-relaxed max-w-xl"
          >
            RADIX opera donde la estrategia y el diseño convergen.
            Capital inmobiliario inteligente en el NOA y Buenos Aires.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/propiedades" className="btn-primary">
              Ver portafolio
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/contacto" className="btn-ghost">
              Hablar con un asesor
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5 }}
            className="mt-20 pt-8 border-t border-radix-border/50 flex flex-wrap gap-10 lg:gap-16"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 + i * 0.12 }}
              >
                <div className="text-3xl lg:text-4xl font-light text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-radix-text-4 text-xs mt-1.5 tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-radix-text-4 text-[0.6rem] tracking-[0.25em] uppercase">Explorar</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-radix-text-4" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-radix-void to-transparent z-10 pointer-events-none" />
    </section>
  )
}
