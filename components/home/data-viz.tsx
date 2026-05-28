'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, animate } from 'framer-motion'
import { HOME_METRICS } from '@/lib/content/home'

interface CounterProps {
  from: number
  to: number
  duration?: number
  format?: (n: number) => string
}

function Counter({ from, to, duration = 2.2, format }: CounterProps) {
  const motionVal = useMotionValue(from)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionVal, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = format ? format(v) : Math.round(v).toString()
        }
      },
    })
    return controls.stop
  }, [isInView, motionVal, to, duration, format])

  return <span ref={ref}>{format ? format(from) : from}</span>
}

export function DataViz() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden bg-radix-navy">
      {/* Ambient top glow */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(20,120,204,0.25), transparent)' }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <motion.div
            className="label-tag mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Trayectoria
          </motion.div>
          <motion.h2
            className="font-serif text-display-3 text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Experiencia
            <br />
            acumulada.
          </motion.h2>
        </div>

        {/* 4-stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-radix-border/40 rounded-2xl overflow-hidden">
          {HOME_METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-radix-surface px-8 py-12 lg:px-10 lg:py-14"
            >
              <div className="text-5xl lg:text-6xl font-light text-white tracking-tight">
                {m.prefix && (
                  <span className="text-xl lg:text-2xl text-radix-text-3 mr-0.5">{m.prefix}</span>
                )}
                {isInView && (
                  <Counter
                    from={0}
                    to={m.value}
                    duration={m.value <= 20 ? 1.2 : 2}
                    format={(n) => Math.round(n).toString()}
                  />
                )}
                {m.suffix && (
                  <span className="text-xl lg:text-2xl text-radix-text-3 ml-0.5">{m.suffix}</span>
                )}
              </div>
              <div className="text-sm font-medium text-radix-text-2 mt-4 leading-snug">{m.label}</div>
              <div className="text-xs text-radix-text-4 mt-1.5">{m.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ambient bottom glow */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(20,120,204,0.15), transparent)' }}
      />
    </section>
  )
}
