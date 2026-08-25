'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'

/** Tiempo que permanece visible cada foto. */
const INTERVALO_MS = 5000
/** Desfase determinista entre tarjetas, para que no cambien todas a la vez.
 *  DESFASES × DESFASE_MS reparte las 6 tarjetas del grid a lo largo del intervalo,
 *  sin que dos caigan en el mismo instante. */
const DESFASE_MS = 800
const DESFASES = 6

interface PropertyCardImageProps {
  /** Portada primero. Con una sola URL la imagen queda estática. */
  images: string[]
  alt: string
  /** Posición de la tarjeta en el grid — define el desfase. */
  index?: number
  sizes?: string
  className?: string
}

/**
 * Imagen de tarjeta con rotación automática por crossfade.
 *
 * El estado vive acá (hoja del árbol) a propósito: al cambiar de foto solo re-renderiza
 * esta imagen, no la tarjeta ni la sección entera.
 *
 * Carga: nunca baja la galería completa de una. Arranca con una sola capa —la portada—
 * y monta la siguiente recién cuando la tarjeta entra en viewport, siempre una por
 * delante de la que se está mostrando. Una tarjeta que el usuario no ve no descarga
 * nada extra, y el timer tampoco corre.
 */
export function PropertyCardImage({
  images,
  alt,
  index = 0,
  sizes,
  className = '',
}: PropertyCardImageProps) {
  const rota = images.length > 1

  const ref = useRef<HTMLDivElement>(null)
  const [activa, setActiva] = useState(0)
  /** Cuántas capas están montadas. Crece de a una; nunca decrece (ya están en caché). */
  const [montadas, setMontadas] = useState(1)
  const [visible, setVisible] = useState(false)
  const [reducirMovimiento, setReducirMovimiento] = useState(false)

  // prefers-reduced-motion: sin rotación ni descargas extra. Se escucha el cambio para
  // reaccionar si el usuario ajusta la preferencia con la página abierta.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducirMovimiento(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Activa solo con la tarjeta en viewport y la pestaña en primer plano.
  useEffect(() => {
    if (!rota) return
    const el = ref.current
    if (!el) return

    let enPantalla = false
    const sync = () => setVisible(enPantalla && document.visibilityState === 'visible')

    const io = new IntersectionObserver(
      ([entry]) => {
        enPantalla = entry.isIntersecting
        sync()
      },
      { rootMargin: '100px' },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', sync)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [rota])

  // Precarga: mantiene montada la capa siguiente a la visible, para que el crossfade
  // encuentre la foto ya descargada y no parpadee.
  useEffect(() => {
    if (!rota || reducirMovimiento || !visible) return
    setMontadas((m) => Math.max(m, Math.min(activa + 2, images.length)))
  }, [rota, reducirMovimiento, visible, activa, images.length])

  // Rotación. El desfase se aplica solo al primer cambio; después el intervalo es parejo.
  useEffect(() => {
    if (!rota || reducirMovimiento || !visible) return

    const avanzar = () => setActiva((i) => (i + 1) % images.length)

    let intervalo: ReturnType<typeof setInterval> | undefined
    const arranque = setTimeout(
      () => {
        avanzar()
        intervalo = setInterval(avanzar, INTERVALO_MS)
      },
      INTERVALO_MS + (index % DESFASES) * DESFASE_MS,
    )

    return () => {
      clearTimeout(arranque)
      if (intervalo) clearInterval(intervalo)
    }
  }, [rota, reducirMovimiento, visible, index, images.length])

  return (
    <div ref={ref} className="absolute inset-0">
      {images.slice(0, montadas).map((src, i) => (
        <ImageWithFallback
          key={src}
          src={src}
          // Solo la portada aporta texto alternativo; el resto son decorativas.
          alt={i === 0 ? alt : ''}
          fill
          sizes={sizes}
          className={`${className} transition-[opacity,transform] duration-700 ease-radix ${
            i === activa ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
