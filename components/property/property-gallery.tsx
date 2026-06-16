'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'

export interface GalleryImage {
  id: string
  url: string
  alt: string
}

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'

interface PropertyGalleryProps {
  images: GalleryImage[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  // Garantiza al menos una imagen para no romper el layout con pocas/0 imágenes.
  const imgs: GalleryImage[] =
    images.length > 0 ? images : [{ id: 'placeholder', url: PLACEHOLDER, alt: title }]

  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const safeActive = Math.min(active, imgs.length - 1)
  const main = imgs[safeActive]
  const side = imgs.slice(1, 3) // hasta 2 imágenes medianas apiladas (desktop)
  const hasSide = side.length > 0

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + imgs.length) % imgs.length)),
    [imgs.length],
  )
  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % imgs.length)),
    [imgs.length],
  )

  // Navegación por teclado + bloqueo de scroll de fondo mientras el lightbox está abierto.
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, closeLightbox, prev, next])

  return (
    <div className="mb-10">
      {/* ── Mosaico ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:aspect-[16/9]">
        {/* Imagen principal */}
        <button
          type="button"
          onClick={() => setLightbox(safeActive)}
          aria-label="Ampliar imagen principal"
          className={`group relative overflow-hidden rounded-2xl bg-radix-surface aspect-[4/3] lg:aspect-auto ${
            hasSide ? 'lg:col-span-2' : 'lg:col-span-3'
          }`}
        >
          <Image
            src={main.url}
            alt={main.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full
                       bg-black/45 backdrop-blur-sm px-3 py-1.5 text-xs text-white/90 border border-white/10
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Expand className="w-3.5 h-3.5" /> Ampliar
          </span>
        </button>

        {/* Columna derecha: 2 imágenes medianas apiladas (solo desktop) */}
        {hasSide && (
          <div className="hidden lg:flex flex-col gap-2">
            {side.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setLightbox(i + 1)}
                aria-label={`Ampliar imagen ${i + 2}`}
                className="group relative flex-1 overflow-hidden rounded-2xl bg-radix-surface"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Miniaturas: cambian la imagen principal al clickear ── */}
      {imgs.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {imgs.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === safeActive}
              className={`relative h-16 w-20 sm:h-20 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg bg-radix-surface transition-all duration-300 ${
                i === safeActive
                  ? 'ring-2 ring-radix-blue ring-offset-2 ring-offset-radix-abyss'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt={img.alt} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes"
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {imgs.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Imagen anterior"
                className="absolute left-3 sm:left-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Imagen siguiente"
                className="absolute right-3 sm:right-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div onClick={(e) => e.stopPropagation()} className="relative h-full w-full max-w-5xl">
            <Image
              src={imgs[lightbox].url}
              alt={imgs[lightbox].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/70">
            {lightbox + 1} / {imgs.length}
          </div>
        </div>
      )}
    </div>
  )
}
