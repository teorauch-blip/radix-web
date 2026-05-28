'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, Menu, ArrowUpRight } from 'lucide-react'
import { RadixIsotype } from '@/components/ui/radix-logo'

const NAV_LINKS = [
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Inversiones', href: '/inversiones' },
  { label: 'Administración', href: '/administracion' },
  { label: 'Nosotros', href: '/nosotros' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
          scrolled
            ? 'bg-[rgba(5,8,16,0.94)] backdrop-blur-2xl border-b border-white/[0.055] py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="section-container flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="group transition-opacity duration-300 hover:opacity-75"
            aria-label="RADIX — Inicio"
          >
            <RadixIsotype
              className="h-10 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-9" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[0.65rem] uppercase tracking-[0.18em] text-radix-text-3 hover:text-white transition-colors duration-300 group/nav py-1"
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-px w-0 bg-white/35 transition-all duration-400 ease-radix group-hover/nav:w-full"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contacto"
              className="btn-nav"
            >
              Hablar con un asesor
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            className="lg:hidden p-2 -mr-2 text-radix-text-3 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[60] bg-radix-void/80 backdrop-blur-xl"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[min(360px,92vw)] bg-radix-dark border-l border-white/[0.06] flex flex-col"
              role="dialog"
              aria-label="Menú de navegación"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
                <RadixIsotype
                  className="h-8 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 -mr-2 text-radix-text-3 hover:text-white transition-colors duration-200"
                  aria-label="Cerrar menú"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col px-7 pt-6 flex-1" aria-label="Menú móvil">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.06 + i * 0.07,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-5 text-base font-light text-radix-text-2 hover:text-white border-b border-white/[0.06] transition-colors duration-200 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-25 group-hover:opacity-60 transition-opacity duration-200" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Panel CTA */}
              <div className="px-7 py-7 border-t border-white/[0.06]">
                <Link
                  href="/contacto"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 text-[0.65rem] uppercase tracking-[0.15em] text-white border border-white/15 rounded-full hover:border-white/30 hover:bg-white/[0.04] transition-all duration-400 ease-radix"
                >
                  Hablar con un asesor
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
