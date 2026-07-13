'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

// Placeholder compartido con el resto del sitio (adapt-propiedad / property-gallery).
const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'

type Props = ImageProps & { fallbackSrc?: string }

/**
 * next/image con degradación elegante: si la URL real falla en runtime
 * (p. ej. un objeto de storage reemplazado que dejó la página cacheada
 * apuntando a un archivo ya inexistente → 404), reemplaza el src por el
 * placeholder en lugar de mostrar el ícono de imagen rota + alt text.
 *
 * No cambia el diseño: usa el mismo placeholder que ya se muestra cuando
 * una propiedad no tiene imágenes.
 */
export function ImageWithFallback({ src, fallbackSrc = DEFAULT_FALLBACK, ...props }: Props) {
  const [errored, setErrored] = useState(false)

  // Reinicia el estado de error cuando cambia el src (galería: al cambiar
  // la imagen principal o navegar el lightbox se reutiliza el mismo <Image>).
  useEffect(() => setErrored(false), [src])

  return (
    <Image
      {...props}
      src={errored ? fallbackSrc : src}
      onError={() => setErrored(true)}
    />
  )
}
