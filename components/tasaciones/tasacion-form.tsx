'use client'

import { useId, useState, useTransition } from 'react'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { useTrackedLeadSubmit } from '@/lib/analytics/use-tracked-lead-submit'

/** Etiqueta con la que el lead queda identificado en el CRM. */
export const SERVICIO_TASACION = 'Tasación inmobiliaria'

const TIPOS_PROPIEDAD = [
  'Casa',
  'Departamento',
  'Dúplex',
  'Terreno',
  'Local comercial',
  'Oficina',
  'Galpón',
  'Cochera',
  'Otro',
] as const

const OPERACIONES = [
  { value: 'Venta',              label: 'Venta' },
  { value: 'Alquiler',           label: 'Alquiler' },
  { value: 'Ambas',              label: 'Ambas' },
  { value: 'Todavía no definido', label: 'Todavía no definido' },
] as const

const fieldClass =
  'w-full px-4 py-3 text-sm bg-radix-surface border border-radix-border rounded-xl ' +
  'text-radix-text-2 placeholder:text-radix-text-4 ' +
  'focus:outline-none focus:border-radix-blue/50 transition-colors'

const labelClass =
  'block text-[0.65rem] uppercase tracking-[0.15em] text-radix-text-4 mb-2'

export function TasacionForm() {
  const submitConsulta = useTrackedLeadSubmit()
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const id = useId()
  const fid = (name: string) => `${id}-${name}`

  const [nombre, setNombre]         = useState('')
  const [telefono, setTelefono]     = useState('')
  const [email, setEmail]           = useState('')
  const [tipo, setTipo]             = useState('')
  const [operacion, setOperacion]   = useState('')
  const [ubicacion, setUbicacion]   = useState('')
  const [direccion, setDireccion]   = useState('')
  const [superficie, setSuperficie] = useState('')
  const [mensaje, setMensaje]       = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const res = await submitConsulta({
        nombre,
        email,
        telefono,
        mensaje,
        servicio: SERVICIO_TASACION,
        detalles: [
          { label: 'Tipo de propiedad',  value: tipo },
          { label: 'Operación estimada', value: operacion },
          { label: 'Ubicación / barrio', value: ubicacion },
          { label: 'Dirección',          value: direccion },
          { label: 'Superficie aprox.',  value: superficie ? `${superficie} m²` : '' },
        ],
      })

      if (res.ok) setDone(true)
      else setError(res.error)
    })
  }

  if (done) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center py-12"
        role="status"
        aria-live="polite"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-radix-blue/15 border border-radix-blue/30 mb-5">
          <Check className="h-6 w-6 text-radix-blue" />
        </div>
        <div className="text-white text-lg font-light mb-2">Solicitud enviada</div>
        <p className="text-radix-text-4 text-sm max-w-sm leading-relaxed">
          Recibimos tu pedido de tasación. Un asesor de RADIX se va a contactar
          para coordinar el relevamiento de la propiedad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate={false}>
      {/* Datos de contacto */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fid('nombre')} className={labelClass}>
            Nombre y apellido *
          </label>
          <input
            id={fid('nombre')}
            type="text"
            required
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={fid('telefono')} className={labelClass}>
            Teléfono
          </label>
          <input
            id={fid('telefono')}
            type="tel"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            placeholder="Para coordinar la visita"
            autoComplete="tel"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={fid('email')} className={labelClass}>
          Email *
        </label>
        <input
          id={fid('email')}
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          className={fieldClass}
        />
      </div>

      {/* Datos de la propiedad */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fid('tipo')} className={labelClass}>
            Tipo de propiedad *
          </label>
          <select
            id={fid('tipo')}
            required
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className={`${fieldClass} cursor-pointer`}
          >
            <option value="">Seleccioná una opción</option>
            {TIPOS_PROPIEDAD.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={fid('operacion')} className={labelClass}>
            Operación estimada *
          </label>
          <select
            id={fid('operacion')}
            required
            value={operacion}
            onChange={e => setOperacion(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className={`${fieldClass} cursor-pointer`}
          >
            <option value="">Seleccioná una opción</option>
            {OPERACIONES.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fid('ubicacion')} className={labelClass}>
            Ubicación o barrio *
          </label>
          <input
            id={fid('ubicacion')}
            type="text"
            required
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            placeholder="Ej. Tres Cerritos, Salta"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={fid('superficie')} className={labelClass}>
            Superficie aproximada <span className="normal-case tracking-normal">(m², opcional)</span>
          </label>
          <input
            id={fid('superficie')}
            type="number"
            min={0}
            inputMode="numeric"
            value={superficie}
            onChange={e => setSuperficie(e.target.value)}
            placeholder="Ej. 120"
            className={`${fieldClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      </div>

      <div>
        <label htmlFor={fid('direccion')} className={labelClass}>
          Dirección <span className="normal-case tracking-normal">(opcional)</span>
        </label>
        <input
          id={fid('direccion')}
          type="text"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          placeholder="Calle y numeración"
          autoComplete="street-address"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={fid('mensaje')} className={labelClass}>
          Mensaje
        </label>
        <textarea
          id={fid('mensaje')}
          rows={4}
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          placeholder="Contanos sobre la propiedad: estado, antigüedad, o cualquier dato que ayude a la tasación."
          className={`${fieldClass} resize-none`}
        />
      </div>

      {error && (
        <p className="text-sm text-amber-400" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          <>
            Solicitar tasación
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="text-[0.7rem] text-radix-text-4 text-center">
        Al enviar aceptás ser contactado por RADIX. No compartimos tus datos.
      </p>
    </form>
  )
}
