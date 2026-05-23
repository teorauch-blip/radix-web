'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function Intro() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-radix-void">
      <div className="section-container">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="label-tag mb-8"
            >
              Sobre RADIX
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-display-3 text-white"
            >
              No somos una
              <br />
              inmobiliaria.
              <br />
              <span className="text-radix-text-3 italic">Somos una firma.</span>
            </motion.h2>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 lg:pt-16 space-y-6">
            {[
              'RADIX es una firma moderna de real estate con foco en el NOA y expansión nacional. Operamos en el segmento premium del mercado con un enfoque que combina análisis estratégico, conocimiento territorial profundo y criterio de diseño.',
              'Cada activo que gestionamos es seleccionado con rigor. Cada operación, estructurada con precisión. Trabajamos con inversores, familias y empresas que valoran el tiempo, la calidad y la claridad por encima de todo.',
              'Salta es nuestro origen. Buenos Aires es nuestra proyección. Argentina es nuestro mercado.',
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`text-base lg:text-lg leading-relaxed ${
                  i === 0 ? 'text-radix-text-2' : 'text-radix-text-3'
                }`}
              >
                {text}
              </motion.p>
            ))}

            {/* Divider line animated */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="divider" />
              <div className="flex flex-wrap gap-8 mt-8">
                {[
                  { label: 'Salta Capital', sub: 'Sede principal' },
                  { label: 'Buenos Aires', sub: 'Operaciones nacionales' },
                  { label: 'Matrícula CMCPRA', sub: 'Habilitación profesional' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-sm font-medium text-radix-text-2">{item.label}</div>
                    <div className="text-xs text-radix-text-4 mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
