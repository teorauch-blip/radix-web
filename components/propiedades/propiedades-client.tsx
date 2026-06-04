'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown, X, Search } from 'lucide-react'
import { PropertyCard } from '@/components/property/property-card'
import { adaptPropiedad } from '@/lib/utils/adapt-propiedad'
import type { PropiedadPublica } from '@/lib/types/db'
import type { FiltrosPropiedadesConfig, FiltroOpcion } from '@/lib/types/db'

// ─── Fallback local (si no llega la prop filtros) ─────────────

const FALLBACK_OPERACIONES: FiltroOpcion[] = [
  { label: 'Todas las operaciones', value: '' },
  { label: 'Venta',                 value: 'venta' },
  { label: 'Alquiler',              value: 'alquiler' },
]

const FALLBACK_TIPOS: FiltroOpcion[] = [
  { label: 'Todos los tipos',  value: '' },
  { label: 'Casa',             value: 'casa' },
  { label: 'Departamento',     value: 'departamento' },
  { label: 'Dúplex',           value: 'duplex' },
  { label: 'Terreno',          value: 'terreno' },
  { label: 'Local Comercial',  value: 'local' },
  { label: 'Oficina',          value: 'oficina' },
  { label: 'Galpón',           value: 'galpon' },
  { label: 'Desarrollo',       value: 'desarrollo' },
]

const FALLBACK_UBICACIONES: FiltroOpcion[] = [
  { label: 'Todas las zonas',   value: '' },
  { label: 'Salta Capital',     value: 'salta' },
  { label: 'San Lorenzo',       value: 'san lorenzo' },
  { label: 'San Lorenzo Chico', value: 'san lorenzo chico' },
  { label: 'Tres Cerritos',     value: 'tres cerritos' },
  { label: 'Valle de Lerma',    value: 'valle de lerma' },
  { label: 'Cafayate',          value: 'cafayate' },
  { label: 'Otras zonas',       value: 'otros' },
]

const FALLBACK_DORMITORIOS: FiltroOpcion[] = [
  { label: 'Dormitorios', value: '' },
  { label: '1+',          value: '1' },
  { label: '2+',          value: '2' },
  { label: '3+',          value: '3' },
  { label: '4+',          value: '4' },
]

// ─── Lógica de filtrado ───────────────────────────────────────

interface Filtros {
  operacion: string
  tipo: string
  precioMin: string
  precioMax: string
  dormitorios: string
  ubicacion: string
}

/**
 * Filtra las PropiedadPublica según los parámetros activos.
 * ubicacionOpts se usa para determinar las zonas conocidas en el caso "otros".
 */
function applyFilters(
  props: PropiedadPublica[],
  f: Filtros,
  ubicacionOpts: FiltroOpcion[],
): PropiedadPublica[] {
  return props.filter(p => {

    // Operación: basado en qué precio está cargado
    if (f.operacion === 'venta'    && !(p.precio_venta    && p.precio_venta    > 0)) return false
    if (f.operacion === 'alquiler' && !(p.precio_alquiler && p.precio_alquiler > 0)) return false

    // Tipo: 'desarrollo' en CMS → 'terreno' en DB (único caso de mapeo especial)
    if (f.tipo) {
      const tipoDb = f.tipo === 'desarrollo' ? 'terreno' : f.tipo
      if (p.tipo !== tipoDb) return false
    }

    // Precio efectivo según operación activa
    const precioEfectivo = f.operacion === 'alquiler'
      ? (p.precio_alquiler ?? 0)
      : (p.precio_venta ?? p.precio_alquiler ?? 0)

    if (f.precioMin && precioEfectivo < Number(f.precioMin)) return false
    if (f.precioMax && precioEfectivo > Number(f.precioMax)) return false

    // Dormitorios: mínimo requerido
    if (f.dormitorios) {
      const min = Number(f.dormitorios)
      if (!p.dormitorios || p.dormitorios < min) return false
    }

    // Ubicación: matching genérico contra ciudad + barrio
    if (f.ubicacion) {
      const haystack = `${p.ciudad ?? ''} ${p.barrio ?? ''}`.toLowerCase()
      const val = f.ubicacion.toLowerCase()

      if (val === 'otros') {
        // Excluir propiedades que coincidan con cualquier zona conocida
        const zonasConocidas = ubicacionOpts
          .filter(u => u.value && u.value !== 'otros')
          .map(u => u.value.toLowerCase())
        if (zonasConocidas.some(z => haystack.includes(z))) return false
      } else {
        if (!haystack.includes(val)) return false
      }
    }

    return true
  })
}

// ─── Sub-componente: select con flecha custom ─────────────────

interface FilterSelectProps {
  label: string
  value: string
  options: FiltroOpcion[]
  onChange: (v: string) => void
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[0.6rem] uppercase tracking-[0.15em] text-radix-text-4 font-medium">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ colorScheme: 'dark' }}
          className="w-full bg-radix-dark border border-radix-border text-sm text-radix-text-2 rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:border-radix-blue/50 transition-colors duration-200 cursor-pointer"
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

// ─── Estado vacío ─────────────────────────────────────────────

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-14 h-14 rounded-full bg-radix-surface border border-radix-border flex items-center justify-center mb-6">
        <Search className="w-5 h-5 text-radix-text-4" />
      </div>
      <p className="text-white text-lg font-light mb-2">
        {hasFilters ? 'Sin resultados' : 'Estamos actualizando el portafolio.'}
      </p>
      <p className="text-radix-text-4 text-sm max-w-xs leading-relaxed">
        {hasFilters
          ? 'No hay propiedades con esos criterios. Probá con otros filtros o ampliá la búsqueda.'
          : 'Volvé pronto para ver nuevas propiedades.'}
      </p>
      {hasFilters && (
        <button onClick={onClear} className="btn-ghost mt-6 text-sm">
          Ver todas las propiedades
        </button>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────

interface PropiedadesClientProps {
  propiedades: PropiedadPublica[]
  filtros?: FiltrosPropiedadesConfig
}

export function PropiedadesClient({ propiedades, filtros }: PropiedadesClientProps) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  // Opciones dinámicas con fallback local
  const operacionOpts  = filtros?.operaciones ?? FALLBACK_OPERACIONES
  const tipoOpts       = filtros?.tipos       ?? FALLBACK_TIPOS
  const dormitorioOpts = filtros?.dormitorios  ?? FALLBACK_DORMITORIOS
  const ubicacionOpts  = filtros?.ubicaciones  ?? FALLBACK_UBICACIONES

  // Leer filtros activos desde la URL
  const operacion   = searchParams.get('operacion')   ?? ''
  const tipo        = searchParams.get('tipo')        ?? ''
  const dormitorios = searchParams.get('dormitorios') ?? ''
  const ubicacion   = searchParams.get('ubicacion')   ?? ''
  const precioMin   = searchParams.get('precio_min')  ?? ''
  const precioMax   = searchParams.get('precio_max')  ?? ''

  // Estado local para precio: se confirma con Enter o blur (no en cada tecla)
  const [localMin, setLocalMin] = useState(precioMin)
  const [localMax, setLocalMax] = useState(precioMax)

  // Sincronizar estado local si la URL cambia (back/forward del browser)
  useEffect(() => { setLocalMin(searchParams.get('precio_min') ?? '') }, [searchParams])
  useEffect(() => { setLocalMax(searchParams.get('precio_max') ?? '') }, [searchParams])

  const activeCount = [operacion, tipo, precioMin, precioMax, dormitorios, ubicacion]
    .filter(Boolean).length

  // Actualizar un param en la URL sin scroll
  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Confirmar precio en URL (blur / Enter)
  const commitPrecio = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (localMin) params.set('precio_min', localMin)
    else params.delete('precio_min')
    if (localMax) params.set('precio_max', localMax)
    else params.delete('precio_max')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams, localMin, localMax])

  // Limpiar todos los filtros
  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [router, pathname])

  // Filtrar + adaptar (memoizado)
  const filtered = useMemo(() =>
    applyFilters(
      propiedades,
      { operacion, tipo, precioMin, precioMax, dormitorios, ubicacion },
      ubicacionOpts,
    ),
    [propiedades, operacion, tipo, precioMin, precioMax, dormitorios, ubicacion, ubicacionOpts]
  )

  const adapted = useMemo(() => filtered.map(adaptPropiedad), [filtered])

  return (
    <div>
      {/* ── Barra de filtros ── */}
      <div className="mb-8 p-4 lg:p-5 bg-radix-surface/50 border border-radix-border rounded-2xl backdrop-blur-sm">
        <div className="flex flex-wrap items-end gap-3">

          <FilterSelect
            label="Operación"
            value={operacion}
            options={operacionOpts}
            onChange={v => setParam('operacion', v)}
          />

          <FilterSelect
            label="Tipo"
            value={tipo}
            options={tipoOpts}
            onChange={v => setParam('tipo', v)}
          />

          <FilterSelect
            label="Dormitorios"
            value={dormitorios}
            options={dormitorioOpts}
            onChange={v => setParam('dormitorios', v)}
          />

          <FilterSelect
            label="Zona"
            value={ubicacion}
            options={ubicacionOpts}
            onChange={v => setParam('ubicacion', v)}
          />

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-radix-text-4 font-medium">
              Precio
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Mínimo"
                value={localMin}
                onChange={e => setLocalMin(e.target.value)}
                onBlur={commitPrecio}
                onKeyDown={e => e.key === 'Enter' && commitPrecio()}
                className="w-28 bg-radix-dark border border-radix-border text-sm text-radix-text-2 rounded-xl px-3 py-2.5 placeholder:text-radix-text-4 focus:outline-none focus:border-radix-blue/50 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-radix-text-4 text-xs leading-none select-none">—</span>
              <input
                type="number"
                min={0}
                placeholder="Máximo"
                value={localMax}
                onChange={e => setLocalMax(e.target.value)}
                onBlur={commitPrecio}
                onKeyDown={e => e.key === 'Enter' && commitPrecio()}
                className="w-28 bg-radix-dark border border-radix-border text-sm text-radix-text-2 rounded-xl px-3 py-2.5 placeholder:text-radix-text-4 focus:outline-none focus:border-radix-blue/50 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Limpiar filtros — solo si hay filtros activos */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-radix-text-4 hover:text-white transition-colors duration-200 py-2.5 self-end whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* ── Conteo de resultados ── */}
      <p className="text-radix-text-4 text-sm mb-6">
        <span className="text-radix-text-3">{adapted.length}</span>{' '}
        {adapted.length === 1 ? 'propiedad' : 'propiedades'}
        {activeCount > 0 && ' encontradas'}
      </p>

      {/* ── Grid ── */}
      {adapted.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {adapted.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState onClear={clearAll} hasFilters={activeCount > 0} />
      )}
    </div>
  )
}
