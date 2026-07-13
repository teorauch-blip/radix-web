'use client'

import { useEffect, useState, type CSSProperties, type ImgHTMLAttributes } from 'react'

// Placeholder compartido con el resto del sitio (adapt-propiedad / property-gallery).
const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'loading'> & {
  src: string
  alt: string
  fallbackSrc?: string
  /** Replica el layout `fill` de next/image: la imagen cubre el contenedor posicionado. */
  fill?: boolean
  /** Carga temprana (sin lazy) para la imagen principal above-the-fold. */
  priority?: boolean
}

/**
 * Imagen resiliente para el Storage público de Supabase, servida con `<img>` nativo.
 *
 * Por qué `<img>` nativo y no `next/image`:
 *  - Las imágenes se suben YA optimizadas como WebP desde la app de gestión, así que
 *    el optimizador de Next/Vercel (`/_next/image`) no aporta beneficio real y, en
 *    producción, es un punto de fallo: cuando su Lambda recibe un timeout/throttle
 *    transitorio de Supabase bajo concurrencia (Home y /propiedades cargan decenas de
 *    imágenes a la vez), devuelve un error y Vercel CACHEA esa respuesta fallida.
 *    Resultado: la imagen queda "rota" aunque la URL pública responda 200 ("algunas
 *    cargan y otras no").
 *  - Un `<img>` nativo trae el archivo directo del CDN de Supabase (Cloudflare), que
 *    responde `Content-Type: image/webp` + `Access-Control-Allow-Origin: *` y es 100%
 *    confiable. Sin optimizador, sin `srcset` defectuoso, sin caché de errores.
 *
 * Se conservan todas las garantías visuales: `fill` (vía CSS), `loading="lazy"` salvo
 * `priority`, `decoding="async"`, `alt`, object-fit y bordes redondeados (por className),
 * responsive, y un fallback elegante SOLO ante un error real de carga.
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  fill = false,
  priority = false,
  className,
  style,
  sizes,
  ...rest
}: Props) {
  const [errored, setErrored] = useState(false)

  // Reinicia el estado de error cuando cambia el src (galería: al cambiar la imagen
  // principal o navegar el lightbox se reutiliza el mismo <img>). Evita quedar
  // bloqueado en el placeholder al pasar de una propiedad/miniatura a otra.
  useEffect(() => setErrored(false), [src])

  const finalSrc = errored ? fallbackSrc : src

  // `fill`: posiciona la imagen para cubrir el contenedor (que ya es relative/absolute
  // en los consumidores), replicando el comportamiento de next/image sin su maquinaria.
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, height: '100%', width: '100%', ...style }
    : style

  return (
    // eslint-disable-next-line @next/next/no-img-element -- intencional: ver doc arriba.
    <img
      {...rest}
      src={finalSrc}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={fillStyle}
      onError={() => {
        if (!errored && process.env.NODE_ENV !== 'production') {
          // Advertencia útil una única vez por imagen (sin loops: al pasar al fallback
          // el src cambia y no volvemos a marcar error sobre el placeholder).
          console.warn(
            `[ImageWithFallback] no se pudo cargar la imagen, usando placeholder:\n  src: ${src}\n  alt: ${alt}`,
          )
        }
        setErrored(true)
      }}
    />
  )
}
