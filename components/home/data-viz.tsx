'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface CounterProps {
  from: number
  to: number
  duration?: number
  format?: (n: number) => string
}

function Counter({ from, to, duration = 2, format }: CounterProps) {
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

const METRICS = [
  {
    value: 240,
    label: 'Operaciones concretadas',
    sub: 'desde 2012',
    prefix: '+',
    suffix: '',
    color: '#0172C6',
  },
  {
    value: 12,
    label: 'Años de trayectoria',
    sub: 'en el mercado NOA',
    prefix: '',
    suffix: '+',
    color: '#0E1B8C',
  },
  {
    value: 180,
    label: 'Millones gestionados',
    sub: 'en activos USD',
    prefix: 'USD ',
    suffix: 'M',
    color: '#0172C6',
  },
  {
    value: 96,
    label: 'Clientes que renuevan',
    sub: 'tasa de retención',
    prefix: '',
    suffix: '%',
    color: '#0E1B8C',
  },
]

const BAR_DATA = [
  { year: '2019', value: 35 },
  { year: '2020', value: 28 },
  { year: '2021', value: 52 },
  { year: '2022', value: 68 },
  { year: '2023', value: 88 },
  { year: '2024', value: 100 },
]

export function DataViz() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden bg-radix-dark">
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: '40px 40px',
        }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <motion.div
            className="label-tag mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Trayectoria
          </motion.div>
          <motion.h2
            className="font-serif text-display-3 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Números que
            <br />
            respaldan.
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Counter metrics */}
          <div className="grid grid-cols-2 gap-5">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 rounded-2xl bg-radix-surface border border-radix-border relative overflow-hidden group"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${m.color}08 0%, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <div className="text-4xl lg:text-5xl font-light text-white mb-2 tracking-tight">
                    <span className="text-xl text-radix-text-3">{m.prefix}</span>
                    {isInView && (
                      <Counter
                        from={0}
                        to={m.value}
                        duration={1.8}
                        format={(n) => Math.round(n).toString()}
                      />
                    )}
                    <span className="text-xl text-radix-text-3">{m.suffix}</span>
                  </div>
                  <div className="text-sm font-medium text-radix-text-2 leading-tight">{m.label}</div>
                  <div className="text-xs text-radix-text-4 mt-1">{m.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 rounded-2xl bg-radix-surface border border-radix-border"
          >
            <div className="mb-6">
              <div className="text-xs text-radix-text-4 uppercase tracking-widest mb-2">
                Volumen operado
              </div>
              <div className="text-sm text-radix-text-3">Índice de crecimiento interanual</div>
            </div>

            <div className="flex items-end gap-3 h-40">
              {BAR_DATA.map((bar, i) => (
                <div key={bar.year} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{
                      background: `linear-gradient(to top, #0172C6, #0E1B8C)`,
                      opacity: 0.7 + (bar.value / 100) * 0.3,
                    }}
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${bar.value}%` } : { height: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.4 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                  <span className="text-[0.6rem] text-radix-text-4">{bar.year}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
