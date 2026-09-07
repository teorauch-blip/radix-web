'use client'

import { useRef, useState, useTransition } from 'react'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { useTrackedLeadSubmit } from '@/lib/analytics/use-tracked-lead-submit'
import { trackEvent } from '@/lib/analytics/events'

const inputClass =
  'w-full px-4 py-3 text-sm bg-radix-surface border border-radix-border rounded-xl ' +
  'text-radix-text-2 placeholder:text-radix-text-4 ' +
  'focus:outline-none focus:border-radix-blue/50 transition-colors'

/**
 * Formulario corto de la landing de Ads.
 *
 * Diferencias con LeadForm (components/property/lead-form.tsx), que es el
 * formulario largo del detalle de propiedad: acá hay tres campos requeridos y
 * uno opcional, sin asunto ni mensaje prellenado. La idea es que se complete
 * en una pantalla de móvil.
 *
 * ─── Conversión ───
 * Usa `useTrackedLeadSubmit`, el MISMO hook que el resto de los formularios del
 * sitio. Ahí vive la única regla que importa: la conversión "Formulario |
 * Consulta" se dispara dentro de la rama en la que `submitLead` YA devolvió
 * `ok: true`. Este componente no llama a `submitLead` ni a
 * `reportFormConsultaConversion` por su cuenta, así que no puede adelantar ni
 * duplicar la conversión.
 *
 * `form_submit_success` es otra cosa: un evento de embudo, sin `send_to`, que
 * viaja en el mismo punto del flujo pero no cuenta para Google Ads.
 *
 * ─── Sobre el campo de contacto ───
 * `submitLead` valida email obligatorio del lado del servidor (y así lo
 * esperan las consultas que llegan al CRM), por eso el email es requerido y el
 * WhatsApp va como campo opcional al lado. Unificarlos en un solo input
 * "WhatsApp o email" obligaría a relajar esa validación, que hoy comparten
 * todos los formularios del sitio.
 */
export function LandingLeadForm() {
  const submitConsulta = useTrackedLeadSubmit()
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [buscando, setBuscando] = useState('')

  /** `form_start` mide "empezó a completar", así que sale una sola vez. */
  const inicioRegistrado = useRef(false)
  function marcarInicio() {
    if (inicioRegistrado.current) return
    inicioRegistrado.current = true
    trackEvent('form_start')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const res = await submitConsulta({
        nombre,
        email,
        telefono,
        mensaje: buscando,
        servicio: 'Propiedades en Salta (landing Ads)',
      })

      if (res.ok) {
        setDone(true)
        // Mismo instante que la conversión, pero como evento común: el embudo
        // y la conversión de Ads cuentan lo mismo sin pisarse.
        trackEvent('form_submit_success')
      } else {
        setError(res.error)
      }
    })
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full border border-radix-blue/30 bg-radix-blue/15">
          <Check className="h-5 w-5 text-radix-blue" />
        </div>
        <p className="mb-1 text-lg font-light text-white">¡Consulta enviada!</p>
        <p className="max-w-xs text-sm text-radix-text-4">
          Nuestro equipo en Salta se va a contactar a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} onFocus={marcarInicio} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre y apellido"
          autoComplete="name"
          aria-label="Nombre y apellido"
          className={inputClass}
        />
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="WhatsApp (opcional)"
          autoComplete="tel"
          aria-label="WhatsApp"
          className={inputClass}
        />
      </div>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        autoComplete="email"
        aria-label="Email"
        className={inputClass}
      />

      <input
        type="text"
        required
        value={buscando}
        onChange={(e) => setBuscando(e.target.value)}
        placeholder="¿Qué estás buscando? Ej: casa 3 dormitorios en Tres Cerritos"
        aria-label="Qué estás buscando"
        className={inputClass}
      />

      {error && <p className="text-sm text-amber-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            Enviar consulta
            <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-[0.7rem] text-radix-text-4">
        Al enviar aceptás ser contactado por RADIX. No compartimos tus datos.
      </p>
    </form>
  )
}
