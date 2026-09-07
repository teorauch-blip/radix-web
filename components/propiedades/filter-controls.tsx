'use client'

import { ChevronDown } from 'lucide-react'
import type { FiltroOpcion } from '@/lib/types/db'

// ─────────────────────────────────────────────────────────────────
// Controles de filtro compartidos.
//
// Los usan el listado completo (/propiedades) y la landing de Ads
// (/propiedades-en-salta). Viven acá para que ambas pantallas tengan
// exactamente el mismo control —mismo alto, mismo foco, misma flecha— sin
// dos copias que se vayan separando con el tiempo.
//
// Ninguno de los dos maneja ancho: se estiran al 100% de la celda que los
// contenga, así cada pantalla decide su propio layout (flex-wrap en el
// listado, grid en la landing, columna en el bottom sheet mobile).
// ─────────────────────────────────────────────────────────────────

const controlClass =
  'w-full bg-radix-dark border border-radix-border text-sm text-radix-text-2 rounded-xl ' +
  'py-2.5 focus:outline-none focus:border-radix-blue/50 transition-colors duration-200'

const labelClass =
  'text-[0.6rem] uppercase tracking-[0.15em] text-radix-text-4 font-medium'

export interface FilterSelectProps {
  label: string
  value: string
  options: FiltroOpcion[]
  onChange: (v: string) => void
}

/** Select con flecha custom (el nativo no se puede estilar de forma consistente). */
export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label={label}
          // colorScheme dark: sin esto el desplegable nativo se abre en blanco
          // sobre una UI oscura en Windows y Android.
          style={{ colorScheme: 'dark' }}
          className={`${controlClass} pl-3 pr-8 appearance-none cursor-pointer`}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-radix-text-4 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export interface FilterNumberProps {
  label: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  /** Se dispara con Enter o al perder el foco: es cuando el valor se aplica. */
  onCommit: () => void
}

/**
 * Input numérico de precio. El valor se aplica en `onCommit` (Enter o blur),
 * nunca en cada tecla: filtrar mientras se escribe "150000" haría seis pasadas
 * sobre el inventario, cinco de ellas con un número sin sentido.
 */
export function FilterNumber({
  label,
  placeholder,
  value,
  onChange,
  onCommit,
}: FilterNumberProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        placeholder={placeholder}
        aria-label={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onCommit()
          }
        }}
        className={`${controlClass} px-3 placeholder:text-radix-text-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />
    </div>
  )
}
