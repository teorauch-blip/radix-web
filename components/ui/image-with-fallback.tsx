'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

// Placeholder compartido con el resto del sitio (adapt-propiedad / property-gallery).
const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'

type Props = ImageProps & { fallbackSrc?: string }

/**
 * Detecta si el src apunta al Storage público de Supabase.
 *
 * Estas imágenes se suben YA optimizadas como WebP desde la app de gestión,
 * por lo que el optimizador de Next/Vercel (`/_next/image`) no aporta beneficio
 * real y, en producción, es un punto de fallo: cuando la Lambda del optimizador
 * recibe un timeout/throttle transitorio de Supabase bajo concurrencia (Home y
 * /propiedades cargan decenas de imágenes a la vez), devuelve un error y Vercel
 * CACHEA esa respuesta fallida por su TTL. Resultado: la imagen queda "rota"
 * aunque la URL pública directa responda 200 perfectamente ("algunas cargan y
 * otras no"). Servirlas sin optimizar las trae directo del CDN de Supabase,
 * que es 100% confiable, eliminando por completo ese caché roto.
 */
function isSupabaseStorage(src: ImageProps['src']): boolean {
  return typeof src === 'string' && src.includes('.supabase.co/storage/')
}

/**
 * next/image con degradación elegante y resiliente para imágenes remotas.
 *
 * - Para URLs de Supabase Storage usa `unoptimized`: se sirven directo desde el
 *   CDN de Supabase (sin pasar por `/_next/image`), evitando el caché de errores
 *   del optimizador de Vercel. Se conservan lazy loading, `sizes`, `fill`, `alt`,
 *   object-cover, bordes redondeados y responsive: `unoptimized` solo cambia de
 *   dónde sale el archivo, no cómo se renderiza.
 * - Si aun así el archivo real falla en runtime (p. ej. un objeto reemplazado que
 *   dejó una página cacheada apuntando a un archivo inexistente → 404), reemplaza
 *   el src por un placeholder elegante en lugar de mostrar el ícono de imagen rota.
 *
 * No cambia el diseño: usa el mismo placeholder que ya se muestra cuando una
 * propiedad no tiene imágenes.
 */
export function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  unoptimized,
  alt,
  ...props
}: Props) {
  const [errored, setErrored] = useState(false)

  // Reinicia el estado de error cuando cambia el src (galería: al cambiar la
  // imagen principal o navegar el lightbox se reutiliza el mismo <Image>).
  useEffect(() => setErrored(false), [src])

  // El modo se decide por el src ORIGINAL, no por el estado de error: así tanto
  // la imagen de Supabase como su placeholder de fallback (Unsplash) se sirven
  // sin pasar por el optimizador, sin ningún caché roto de por medio.
  const skipOptimizer = unoptimized ?? isSupabaseStorage(src)

  return (
    <Image
      {...props}
      alt={alt}
      src={errored ? fallbackSrc : src}
      unoptimized={skipOptimizer}
      onError={() => {
        if (process.env.NODE_ENV !== 'production') {
          // Advertencia útil una sola vez por imagen (no en loop: al pasar al
          // fallback el src cambia y onError no se vuelve a disparar).
          console.warn(
            `[ImageWithFallback] no se pudo cargar la imagen, usando placeholder:\n  src: ${String(src)}\n  alt: ${String(alt)}`,
          )
        }
        setErrored(true)
      }}
    />
  )
}
