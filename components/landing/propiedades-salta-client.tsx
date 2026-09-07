'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { PropertyCard } from '@/components/property/property-card'
import { FilterNumber, FilterSelect } from '@/components/propiedades/filter-controls'
import { LandingWhatsAppCta } from '@/components/landing/landing-whatsapp-cta'
import { LandingLeadForm } from '@/components/landing/landing-lead-form'
// Módulo sin 'use client' a propósito: el Server Component necesita el mismo
// número y no puede leerlo desde acá. Ver components/landing/constants.ts.
import { LANDING_MAX_RESULTADOS } from '@/components/landing/constants'
import { adaptPropiedad } from '@/lib/utils/adapt-propiedad'
import { trackEvent } from '@/lib/analytics/events'
import {
  applyPropiedadesFilters,
  countFiltrosActivos,
  filtrosToSearchParams,
  normalizeOperacion,
  FILTER_PARAM_KEYS,
  FILTROS_VACIOS,
  type FiltrosActivos,
} from '@/lib/utils/filtros'
import type {
  FiltroOpcion,
  FiltrosPropiedadesConfig,
  PropiedadPublica,
} from '@/lib/types/db'


// ─── Sub-componentes ──────────────────────────────────────────

interface CamposProps {
  valores: FiltrosActivos
  minDraft: string
  maxDraft: string
  operacionOpts: FiltroOpcion[]
  tipoOpts: FiltroOpcion[]
  ubicacionOpts: FiltroOpcion[]
  dormitorioOpts: FiltroOpcion[]
  onSelect: (campo: keyof FiltrosActivos, valor: string) => void
  onMinDraft: (v: string) => void
  onMaxDraft: (v: string) => void
  onCommitPrecio: () => void
}

/**
 * Los seis campos, sin layout propio: el contenedor decide si van en una fila
 * (desktop) o en una columna (bottom sheet). Una sola definición para las dos
 * presentaciones, así no hay riesgo de que una se actualice y la otra no.
 */
function CamposFiltro({
  valores,
  minDraft,
  maxDraft,
  operacionOpts,
  tipoOpts,
  ubicacionOpts,
  dormitorioOpts,
  onSelect,
  onMinDraft,
  onMaxDraft,
  onCommitPrecio,
}: CamposProps) {
  return (
    <>
      <FilterSelect
        label="Operación"
        value={valores.operacion}
        options={operacionOpts}
        onChange={(v) => onSelect('operacion', v)}
      />
      <FilterSelect
        label="Tipo"
        value={valores.tipo}
        options={tipoOpts}
        onChange={(v) => onSelect('tipo', v)}
      />
      <FilterSelect
        label="Zona"
        value={valores.ubicacion}
        options={ubicacionOpts}
        onChange={(v) => onSelect('ubicacion', v)}
      />
      <FilterSelect
        label="Dormitorios"
        value={valores.dormitorios}
        options={dormitorioOpts}
        onChange={(v) => onSelect('dormitorios', v)}
      />
      <FilterNumber
        label="Precio desde"
        placeholder="Mínimo"
        value={minDraft}
        onChange={onMinDraft}
        onCommit={onCommitPrecio}
      />
      <FilterNumber
        label="Precio hasta"
        placeholder="Máximo"
        value={maxDraft}
        onChange={onMaxDraft}
        onCommit={onCommitPrecio}
      />
    </>
  )
}

function EstadoVacio({ onLimpiar }: { onLimpiar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-radix-border bg-radix-surface/40 py-16 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-radix-border bg-radix-surface">
        <Search className="h-4 w-4 text-radix-text-4" aria-hidden="true" />
      </div>
      <p className="mb-2 text-lg font-light text-white">Sin resultados</p>
      <p className="max-w-xs text-sm leading-relaxed text-radix-text-4">
        No hay propiedades con esos criterios. Probá ampliando la búsqueda, o
        escribinos y la buscamos por vos.
      </p>
      <button type="button" onClick={onLimpiar} className="btn-ghost mt-6 text-sm">
        Ver todas las propiedades
      </button>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────

interface PropiedadesSaltaClientProps {
  /** Inventario completo, ya ordenado en el servidor (destacadas primero). */
  propiedades: PropiedadPublica[]
  filtros?: FiltrosPropiedadesConfig
  /** Filtros leídos de la URL por el Server Component. Ver el comentario abajo. */
  initialFiltros: FiltrosActivos
  whatsappHref: string
  whatsappIsReal: boolean
}

/**
 * Filtros + resultados + cierre de la landing de Ads.
 *
 * ─── Por qué el estado NO vive en la URL ───
 * /propiedades guarda sus filtros en la query string con `router.replace`, y
 * cada cambio dispara una navegación del App Router (ida al servidor por el
 * payload RSC). Para el listado completo está bien. Acá no: la landing tiene
 * que sentirse instantánea, así que el estado vive en React —filtrar es un
 * `.filter()` sobre un array que ya está en memoria, cero red— y la URL se
 * mantiene al día con `history.replaceState`, que actualiza la barra de
 * direcciones sin navegar ni volver a renderizar el árbol del servidor.
 *
 * Consecuencia buscada: recargar conserva los filtros, y "Ver todas las
 * propiedades" arrastra exactamente los mismos params a /propiedades, donde sí
 * se leen desde la URL.
 *
 * ─── Por qué `initialFiltros` llega como prop ───
 * El valor inicial lo lee el Server Component desde sus `searchParams`, no este
 * componente con `useSearchParams`. Así el HTML que sale del servidor ya viene
 * filtrado —una URL de anuncio tipo ?operacion=alquiler muestra sus resultados
 * de entrada, sin parpadeo— y no hace falta envolver nada en Suspense.
 */
export function PropiedadesSaltaClient({
  propiedades,
  filtros,
  initialFiltros,
  whatsappHref,
  whatsappIsReal,
}: PropiedadesSaltaClientProps) {
  // Opciones del CMS. `operacion` se normaliza a slug canónico igual que en
  // /propiedades: el value del select, el query param y el filtrado tienen que
  // hablar el mismo idioma.
  const operacionOpts = useMemo(
    () =>
      (filtros?.operaciones ?? []).map((o) => ({
        label: o.label,
        value: normalizeOperacion(o.value),
      })),
    [filtros?.operaciones],
  )
  const tipoOpts = filtros?.tipos ?? []
  const ubicacionOpts = filtros?.ubicaciones ?? []
  const dormitorioOpts = filtros?.dormitorios ?? []

  const [valores, setValores] = useState<FiltrosActivos>(initialFiltros)
  const [minDraft, setMinDraft] = useState(initialFiltros.precioMin)
  const [maxDraft, setMaxDraft] = useState(initialFiltros.precioMax)
  const [sheetAbierto, setSheetAbierto] = useState(false)

  /**
   * Refleja el estado en la barra de direcciones sin navegar.
   *
   * Conserva cualquier param ajeno: una visita desde Google Ads llega con
   * `gclid` y `utm_*`, y perderlos al tocar un filtro rompería la atribución.
   * Solo se reescriben las seis claves de filtro.
   */
  const sincronizarUrl = useCallback((f: FiltrosActivos) => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    for (const key of FILTER_PARAM_KEYS) params.delete(key)
    for (const [key, value] of filtrosToSearchParams(f)) params.set(key, value)

    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    )
  }, [])

  const aplicar = useCallback(
    (siguiente: FiltrosActivos, campo: string, valor: string) => {
      setValores(siguiente)
      sincronizarUrl(siguiente)
      trackEvent('filter_use', {
        campo,
        valor: valor || '(todos)',
        filtros_activos: countFiltrosActivos(siguiente),
      })
    },
    [sincronizarUrl],
  )

  const onSelect = useCallback(
    (campo: keyof FiltrosActivos, valor: string) => {
      aplicar({ ...valores, [campo]: valor }, campo, valor)
    },
    [aplicar, valores],
  )

  const onCommitPrecio = useCallback(() => {
    // Blur sin haber tocado nada: no cambió el estado, no se registra evento.
    if (minDraft === valores.precioMin && maxDraft === valores.precioMax) return
    aplicar(
      { ...valores, precioMin: minDraft, precioMax: maxDraft },
      'precio',
      `${minDraft || '*'}-${maxDraft || '*'}`,
    )
  }, [aplicar, valores, minDraft, maxDraft])

  const limpiar = useCallback(() => {
    setMinDraft('')
    setMaxDraft('')
    aplicar(FILTROS_VACIOS, 'limpiar', '')
  }, [aplicar])

  // ── Resultados ──
  const resultados = useMemo(
    () => applyPropiedadesFilters(propiedades, valores, ubicacionOpts),
    [propiedades, valores, ubicacionOpts],
  )

  // `propiedades` llega ordenado del servidor (destacadas primero, después las
  // más recientes) y `.filter()` preserva el orden, así que el recorte a 6 se
  // queda con lo mejor del inventario sin volver a ordenar nada acá.
  const visibles = useMemo(
    () => resultados.slice(0, LANDING_MAX_RESULTADOS).map(adaptPropiedad),
    [resultados],
  )

  const activos = countFiltrosActivos(valores)
  const hayMas = resultados.length > LANDING_MAX_RESULTADOS

  // El sustantivo y su adjetivo se eligen juntos: armarlos por separado deja
  // frases como "1 propiedad encontradas".
  const singular = resultados.length === 1
  const resumenResultados = activos > 0
    ? (singular ? 'propiedad encontrada' : 'propiedades encontradas')
    : (singular ? 'propiedad disponible en Salta' : 'propiedades disponibles en Salta')

  const queryListado = filtrosToSearchParams(valores).toString()
  const hrefListado = queryListado ? `/propiedades?${queryListado}` : '/propiedades'

  // ── Bloqueo de scroll del fondo mientras el bottom sheet está abierto ──
  useEffect(() => {
    if (!sheetAbierto) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previo
    }
  }, [sheetAbierto])

  // Escape cierra el sheet.
  useEffect(() => {
    if (!sheetAbierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetAbierto(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sheetAbierto])

  const irAResultados = useCallback(() => {
    document.getElementById('propiedades')?.scrollIntoView({ block: 'start' })
  }, [])

  const camposProps: CamposProps = {
    valores,
    minDraft,
    maxDraft,
    operacionOpts,
    tipoOpts,
    ubicacionOpts,
    dormitorioOpts,
    onSelect,
    onMinDraft: setMinDraft,
    onMaxDraft: setMaxDraft,
    onCommitPrecio,
  }

  return (
    <>
      {/* ══ Filtros ══ */}
      <div className="rounded-2xl border border-radix-border bg-radix-surface/50 p-4 backdrop-blur-sm lg:p-5">
        {/* Desktop: los seis campos + Buscar, siempre a la vista */}
        <div className="hidden items-end gap-3 lg:grid lg:grid-cols-3 xl:grid-cols-7">
          <CamposFiltro {...camposProps} />
          <button
            type="button"
            onClick={() => {
              onCommitPrecio()
              irAResultados()
            }}
            className="btn-primary h-[42px] w-full justify-center px-4 py-0 text-sm"
          >
            Buscar
          </button>
        </div>

        {/* Mobile: un solo control. Los seis campos no entran en 360 px sin
            apilarse en una columna larguísima que empujaría los resultados
            fuera de la pantalla, así que van a un bottom sheet. */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSheetAbierto(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-radix-border bg-radix-dark px-4 py-3 text-sm text-radix-text-2 transition-colors duration-200 active:border-radix-blue/50"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtrar propiedades
            {activos > 0 && (
              <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-radix-blue px-1.5 text-[0.65rem] font-medium text-white">
                {activos}
              </span>
            )}
          </button>
          {activos > 0 && (
            <button
              type="button"
              onClick={limpiar}
              className="flex items-center gap-1.5 whitespace-nowrap px-1 text-xs text-radix-text-4 transition-colors duration-200 active:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Limpiar
            </button>
          )}
        </div>

        {/* Limpiar en desktop */}
        {activos > 0 && (
          <div className="hidden justify-end lg:flex">
            <button
              type="button"
              onClick={limpiar}
              className="mt-3 flex items-center gap-1.5 text-xs text-radix-text-4 transition-colors duration-200 hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* ══ Resultados ══ */}
      <p className="mb-6 mt-6 text-sm text-radix-text-4" aria-live="polite">
        <span className="text-radix-text-3">{resultados.length}</span>{' '}
        {resumenResultados}
        {hayMas && <span> · mostrando {LANDING_MAX_RESULTADOS}</span>}
      </p>

      {visibles.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((property, i) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={i}
              // Sin entrada animada: en una landing de Ads las tarjetas tienen
              // que estar pintadas antes de que hidrate el JavaScript.
              animate={false}
              onOpen={() =>
                trackEvent('view_property', { slug: property.slug, posicion: i + 1 })
              }
            />
          ))}
        </div>
      ) : (
        <EstadoVacio onLimpiar={limpiar} />
      )}

      {/* ══ Cierre: ver todas + WhatsApp + consulta corta ══ */}
      <div className="mt-10 rounded-2xl border border-radix-border bg-radix-surface/40 p-6 lg:p-8">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {hayMas && (
            <Link
              href={hrefListado}
              onClick={() =>
                trackEvent('view_all_properties', {
                  filtros_activos: activos,
                  resultados: resultados.length,
                })
              }
              className="btn-primary w-full justify-center sm:w-auto"
            >
              Ver todas las propiedades
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <LandingWhatsAppCta
            href={whatsappHref}
            isWhatsApp={whatsappIsReal}
            ubicacion="resultados"
            className="btn-ghost w-full justify-center sm:w-auto"
          >
            Consultar por WhatsApp
          </LandingWhatsAppCta>
        </div>

        <div className="mx-auto mt-8 max-w-xl border-t border-white/[0.06] pt-8">
          <p className="mb-4 text-center text-sm text-radix-text-3">
            ¿No encontrás lo que buscás? Contanos y la buscamos por vos.
          </p>
          <LandingLeadForm />
        </div>
      </div>

      {/* ══ Bottom sheet de filtros (mobile) ══
          Va en un portal a <body>: el header del sitio es `fixed z-50`, así que
          cualquier z-index declarado dentro del árbol de la página queda por
          debajo suyo. Mismo criterio que el lightbox de la galería. */}
      {sheetAbierto &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="lg:hidden">
            <div
              className="fixed inset-0 z-[80] bg-radix-void/80 backdrop-blur-sm"
              onClick={() => setSheetAbierto(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filtrar propiedades"
              className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[88vh] flex-col rounded-t-3xl border-t border-white/[0.08] bg-radix-dark"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <span className="text-sm font-medium text-white">Filtrar propiedades</span>
                <button
                  type="button"
                  onClick={() => setSheetAbierto(false)}
                  aria-label="Cerrar filtros"
                  className="-mr-2 p-2 text-radix-text-3"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
                <CamposFiltro {...camposProps} />
              </div>

              <div className="flex items-center gap-3 border-t border-white/[0.06] px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={limpiar}
                  className="px-2 text-xs text-radix-text-4"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // El precio se aplica con Enter o blur; si el usuario toca
                    // el botón con el input todavía enfocado, se confirma acá.
                    onCommitPrecio()
                    setSheetAbierto(false)
                    irAResultados()
                  }}
                  className="btn-primary flex-1 justify-center"
                >
                  Ver {resultados.length}{' '}
                  {resultados.length === 1 ? 'propiedad' : 'propiedades'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
