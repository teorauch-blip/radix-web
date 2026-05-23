'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, Menu, ArrowUpRight } from 'lucide-react'

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
    const onScroll = () => setScrolled(window.scrollY > 60)
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
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-radix-black/90 backdrop-blur-xl border-b border-radix-border/50 py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-radix-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm tracking-tight">R</span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-radix-blue opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
            </div>
            <span className="font-semibold text-white tracking-[-0.02em]">
              RADIX
            </span>
            <span className="hidden sm:block text-radix-text-4 text-xs tracking-widest uppercase mt-0.5">
              Consultores
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-radix-text-3 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/contacto"
              className="btn-primary text-xs py-2.5 px-5"
            >
              Hablar con un asesor
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="lg:hidden p-2 text-radix-text-3 hover:text-white transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-radix-void/90 backdrop-blur-xl"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-80 bg-radix-black border-l border-radix-border flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-radix-border">
                <span className="font-semibold text-white tracking-tight">RADIX</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-radix-text-3 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col p-6 gap-1 flex-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-4 text-radix-text-2 hover:text-white border-b border-radix-border/50 transition-colors duration-200"
                    >
                      {link.label}
                      <ArrowUpRight className="w-4 h-4 opacity-40" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-6 border-t border-radix-border">
                <Link
                  href="/contacto"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center"
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
