'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Phone, Mail } from 'lucide-react'
import { CONTACT } from '@/lib/content/contact'

interface CtaSectionProps {
  phone?: string
  phoneHref?: string
  email?: string
  hours?: string
}

export function CtaSection({ phone, phoneHref, email, hours }: CtaSectionProps = {}) {
  const displayPhone    = phone     ?? CONTACT.phone
  const displayHref     = phoneHref ?? CONTACT.phone_href
  const displayEmail    = email     ?? CONTACT.email
  const displayHours    = hours     ?? CONTACT.hours
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-32 lg:py-44 overflow-hidden bg-radix-champagne">
      {/* Background layers */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(1,114,198,0.07) 0%, rgba(196,168,112,0.05) 50%, transparent 70%)',
        }}
      />

      {/* Grid — subtle warm lines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,50,100,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(10,50,100,0.8) 1px, transparent 1px)",
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── I. Bridge primario desde abyss — radiales irregulares ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none h-[300px] lg:h-[400px]"
        style={{
          background: [
            'radial-gradient(ellipse 110% 75% at 28% -8%, rgba(5,12,22,0.97) 0%, rgba(5,12,22,0) 60%)',
            'radial-gradient(ellipse 82% 62% at 74% -4%, rgba(8,18,32,0.88) 0%, rgba(8,18,32,0) 56%)',
            'radial-gradient(ellipse 150% 42% at 50% -14%, rgba(10,21,37,0.82) 0%, rgba(10,21,37,0) 46%)',
          ].join(', '),
          zIndex: 2,
        }}
      />

      {/* ── II. Halos laterales ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none h-[250px] lg:h-[340px]"
        style={{
          background: [
            'radial-gradient(ellipse 42% 50% at -4% 40%, rgba(14,30,50,0.34) 0%, transparent 64%)',
            'radial-gradient(ellipse 36% 42% at 104% 32%, rgba(16,36,58,0.24) 0%, transparent 58%)',
          ].join(', '),
          zIndex: 2,
        }}
      />

      {/* ── III. Viñeta de esquinas ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none h-[200px] lg:h-[260px]"
        style={{
          background: [
            'radial-gradient(ellipse 32% 28% at 0% 0%, rgba(2,6,12,0.60) 0%, transparent 70%)',
            'radial-gradient(ellipse 32% 28% at 100% 0%, rgba(2,6,12,0.60) 0%, transparent 70%)',
          ].join(', '),
          zIndex: 2,
        }}
      />

      {/* Bottom border line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,168,112,0.35), transparent)' }}
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
          className="font-serif text-display-2 text-[#0C1929] max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          El primer paso es
          <br />
          <span className="text-gradient">una conversación.</span>
        </motion.h2>

        <motion.p
          className="text-[#3A5A78] text-lg leading-relaxed mt-6 mb-12 max-w-xl mx-auto"
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
          <a href={displayHref} className="btn-ghost-dark text-base px-8 py-4">
            <Phone className="w-4 h-4" />
            {displayPhone}
          </a>
        </motion.div>

        {/* Contact methods */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-[#1E3550]/20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <a
            href={`mailto:${displayEmail}`}
            className="flex items-center gap-3 text-sm text-[#3A5A78] hover:text-[#0C1929] transition-colors"
          >
            <Mail className="w-4 h-4 text-[#7A9AB8]" />
            {displayEmail}
          </a>
          <div className="hidden sm:block w-px h-4 bg-[#1E3550]/20" />
          <span className="text-sm text-[#7A9AB8]">
            {displayHours}
          </span>
          <div className="hidden sm:block w-px h-4 bg-[#1E3550]/20" />
          <span className="text-sm text-[#7A9AB8]">
            Salta · NOA
          </span>
        </motion.div>
      </div>
    </section>
  )
}
