'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, ExternalLink } from 'lucide-react'

const LOCATIONS = [
  {
    id: 'salta-capital',
    name: 'Salta Capital',
    address: 'Balcarce 1050, Salta Capital',
    description: 'Sede principal. Atención personalizada de lunes a viernes.',
    x: 34,
    y: 52,
    properties: 140,
    type: 'Sede',
  },
  {
    id: 'san-lorenzo',
    name: 'San Lorenzo',
    address: 'San Lorenzo, Salta',
    description: 'Zona residencial de alto estándar con acceso a country clubs.',
    x: 28,
    y: 64,
    properties: 28,
    type: 'Zona activa',
  },
  {
    id: 'tres-ceibos',
    name: 'Tres Ceibos',
    address: 'Tres Ceibos, Salta Capital',
    description: 'Barrio privado en expansión. Mayor demanda del NOA.',
    x: 44,
    y: 42,
    properties: 35,
    type: 'Zona activa',
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    address: 'Av. del Libertador 1000, CABA',
    description: 'Operaciones corporativas y activos premium en Palermo y Belgrano.',
    x: 52,
    y: 78,
    properties: 60,
    type: 'Oficina',
  },
]

export function MapSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activeLocation, setActiveLocation] = useState<string | null>('salta-capital')

  const active = LOCATIONS.find((l) => l.id === activeLocation)

  return (
    <section ref={ref} className="section-padding bg-radix-dark overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14">
          <div>
            <motion.div
              className="label-tag mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Zonas de operación
            </motion.div>
            <motion.h2
              className="font-serif text-display-3 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Presencia donde
              <br />
              importa.
            </motion.h2>
          </div>
          <motion.p
            className="text-radix-text-3 text-lg leading-relaxed self-end"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Conocimiento territorial profundo en cada zona donde operamos. No gestionamos lo que no conocemos.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map placeholder with interactive dots */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square lg:aspect-auto lg:min-h-[480px] rounded-2xl overflow-hidden
                       bg-radix-surface border border-radix-border"
          >
            {/* Map background pattern */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 40% 40%, rgba(1,114,198,0.08) 0%, transparent 60%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: '30px 30px',
              }}
            />

            {/* Location markers */}
            {LOCATIONS.map((location) => (
              <button
                key={location.id}
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
                onClick={() => setActiveLocation(location.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
              >
                {/* Pulse ring */}
                {activeLocation === location.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-radix-blue/30"
                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div
                  className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    activeLocation === location.id
                      ? 'bg-radix-blue border-radix-blue-light scale-125 shadow-[0_0_16px_rgba(1,114,198,0.6)]'
                      : 'bg-radix-surface border-radix-border hover:border-radix-blue hover:scale-110'
                  }`}
                />

                {/* Label */}
                <span
                  className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.65rem]
                               font-medium transition-all duration-200 ${
                                 activeLocation === location.id
                                   ? 'text-white'
                                   : 'text-radix-text-4 group-hover:text-radix-text-3'
                               }`}
                >
                  {location.name}
                </span>
              </button>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 text-xs text-radix-text-4">
              Zonas de operación activa
            </div>
          </motion.div>

          {/* Location details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            {LOCATIONS.map((location) => (
              <button
                key={location.id}
                onClick={() => setActiveLocation(location.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-300 ${
                  activeLocation === location.id
                    ? 'bg-radix-surface-2 border-radix-blue/40 shadow-[0_0_30px_rgba(1,114,198,0.08)]'
                    : 'bg-radix-surface border-radix-border hover:border-radix-border-2'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        activeLocation === location.id ? 'text-radix-blue' : 'text-radix-text-4'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{location.name}</span>
                        <span className="highlight-badge text-[0.6rem]">{location.type}</span>
                      </div>
                      {activeLocation === location.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-xs text-radix-text-4 leading-relaxed mb-2">
                            {location.description}
                          </p>
                          <div className="text-xs text-radix-text-3">{location.address}</div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-light text-white">{location.properties}</div>
                    <div className="text-[0.6rem] text-radix-text-4">propiedades</div>
                  </div>
                </div>
              </button>
            ))}

            <div className="mt-2 p-5 rounded-xl bg-radix-surface border border-radix-border">
              <div className="text-xs text-radix-text-4 mb-3">
                Próximamente ampliando cobertura a
              </div>
              <div className="flex flex-wrap gap-2">
                {['Jujuy', 'Tucumán', 'Mendoza'].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 text-xs text-radix-text-4 bg-radix-dark rounded-full border border-radix-border"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
