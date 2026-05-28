import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export function RadixIsotype({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/branding/radix-isotype.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('object-contain select-none', className)}
      style={style}
    />
  )
}

type LogoVariant = 'full' | 'isotype' | 'wordmark'
type LogoSize = 'xs' | 'sm' | 'md' | 'lg'

interface RadixLogoProps {
  variant?: LogoVariant
  size?: LogoSize
  className?: string
  dark?: boolean
}

const isotypeSizeMap: Record<LogoSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-[22px] h-[22px]',
  lg: 'w-7 h-7',
}

const wordmarkSizeMap: Record<LogoSize, string> = {
  xs: 'text-[0.6rem] tracking-[0.22em]',
  sm: 'text-[0.65rem] tracking-[0.25em]',
  md: 'text-[0.7rem] tracking-[0.28em]',
  lg: 'text-sm tracking-[0.3em]',
}

export function RadixLogo({
  variant = 'full',
  size = 'md',
  className,
  dark = false,
}: RadixLogoProps) {
  const imgFilter = dark
    ? { filter: 'brightness(0)' }
    : { filter: 'brightness(0) invert(1)' }

  if (variant === 'isotype') {
    return (
      <RadixIsotype
        className={cn(isotypeSizeMap[size], className)}
        style={imgFilter}
      />
    )
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={cn(
          'font-sans font-normal uppercase leading-none',
          wordmarkSizeMap[size],
          dark ? 'text-radix-void' : 'text-white',
          className
        )}
      >
        RADIX
      </span>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <RadixIsotype className={isotypeSizeMap[size]} style={imgFilter} />
      <div
        className={cn('w-px h-[18px] flex-shrink-0', dark ? 'bg-black/[0.12]' : 'bg-white/[0.15]')}
        aria-hidden="true"
      />
      <span
        className={cn(
          'font-sans font-normal uppercase leading-none',
          wordmarkSizeMap[size],
          dark ? 'text-radix-void' : 'text-white'
        )}
      >
        RADIX
      </span>
    </div>
  )
}
