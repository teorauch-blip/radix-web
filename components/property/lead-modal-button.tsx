'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { LeadForm, type LeadFormProperty } from '@/components/property/lead-form'

interface LeadModalButtonProps {
  propiedad: LeadFormProperty
}

export function LeadModalButton({ propiedad }: LeadModalButtonProps) {
  const [open, setOpen] = useState(false)

  // Cierre con Esc + bloqueo de scroll de fondo mientras está abierto.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-outline w-full justify-center mb-3"
      >
        <MessageSquare className="w-4 h-4" />
        Solicitar más información
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Solicitar más información"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-[#162B49] border border-radix-border p-7 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10 text-radix-text-3 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-xs text-radix-blue uppercase tracking-[0.15em] mb-2">Consulta</div>
            <h3 className="font-serif text-2xl text-white mb-1">Solicitar más información</h3>
            <p className="text-radix-text-4 text-sm mb-6 line-clamp-1">{propiedad.titulo}</p>

            <LeadForm propiedad={propiedad} />
          </div>
        </div>
      )}
    </>
  )
}
