'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Phone, Mail } from 'lucide-react'

export function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-32 lg:py-44 overflow-hidden bg-radix-dark">
      {/* Background layers */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(1,114,198,0.12) 0%, rgba(14,27,140,0.08) 40%, transparent 70%)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top / bottom border lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(1,114,198,0.4), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(1,114,198,0.2), transparent)' }}
      />

      <div className="section-container relative z-10 text-center">
        <motion.div
          className="inline-flex label-tag mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          Contacto
        </motion.div>

        <motion.h2
          className="font-serif text-display-2 text-white max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          El primer paso es
          <br />
          <span className="text-gradient">una conversación.</span>
        </motion.h2>

        <motion.p
          className="text-radix-text-3 text-lg leading-relaxed mt-6 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Contanos qué buscás. Nuestro equipo analiza tu situación y te presenta opciones concretas, sin rodeos.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/contacto" className="btn-primary text-base px-8 py-4">
            Escribir a RADIX
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <a href="tel:+5438712345678" className="btn-ghost text-base px-8 py-4">
            <Phone className="w-4 h-4" />
            +54 387 123-4567
          </a>
        </motion.div>

        {/* Contact methods */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-radix-border/50"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <a
            href="mailto:info@radixconsultores.com"
            className="flex items-center gap-3 text-sm text-radix-text-3 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4 text-radix-text-4" />
            info@radixconsultores.com
          </a>
          <div className="hidden sm:block w-px h-4 bg-radix-border" />
          <span className="text-sm text-radix-text-4">
            Lunes a viernes · 9 a 18 hs
          </span>
          <div className="hidden sm:block w-px h-4 bg-radix-border" />
          <span className="text-sm text-radix-text-4">
            Salta Capital · Buenos Aires
          </span>
        </motion.div>
      </div>
    </section>
  )
}
