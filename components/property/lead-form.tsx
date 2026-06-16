'use client'

import { useState, useTransition } from 'react'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { submitLead } from '@/app/actions/leads'

export interface LeadFormProperty {
  id: string
  codigo: string
  titulo: string
}

interface LeadFormProps {
  propiedad?: LeadFormProperty | null
  onSuccess?: () => void
}

const inputClass =
  'w-full px-4 py-3 text-sm bg-radix-surface border border-radix-border rounded-xl ' +
  'text-radix-text-2 placeholder:text-radix-text-4 ' +
  'focus:outline-none focus:border-radix-blue/50 transition-colors'

export function LeadForm({ propiedad, onSuccess }: LeadFormProps) {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState(
    propiedad ? `Hola, me interesa la propiedad "${propiedad.titulo}". Quisiera recibir más información.` : '',
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await submitLead({
        nombre,
        email,
        telefono,
        mensaje,
        propiedad_id: propiedad?.id ?? null,
        propiedad_codigo: propiedad?.codigo ?? null,
        propiedad_titulo: propiedad?.titulo ?? null,
      })
      if (res.ok) {
        setDone(true)
        onSuccess?.()
      } else {
        setError(res.error)
      }
    })
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-radix-blue/15 border border-radix-blue/30 mb-5">
          <Check className="h-6 w-6 text-radix-blue" />
        </div>
        <div className="text-white text-lg font-light mb-2">¡Consulta enviada!</div>
        <p className="text-radix-text-4 text-sm max-w-xs">
          Recibimos tu mensaje. Nuestro equipo se va a contactar a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre y apellido"
          autoComplete="name"
          className={inputClass}
        />
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono (opcional)"
          autoComplete="tel"
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
        className={inputClass}
      />

      <textarea
        required
        rows={4}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Contanos qué estás buscando…"
        className={`${inputClass} resize-none`}
      />

      {error && <p className="text-sm text-amber-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            Enviar consulta
            <ArrowUpRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-[0.7rem] text-radix-text-4 text-center">
        Al enviar aceptás ser contactado por RADIX. No compartimos tus datos.
      </p>
    </form>
  )
}
