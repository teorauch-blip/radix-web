'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { MAP_LOCATIONS, TERRITORY_SUB } from '@/lib/content/home'

// SVG viewBox: 0 0 560 480 — abstract cartographic croquis of Salta region
// Top = North, Bottom = South. Valley runs N–S through center.

const WEST_CONTOURS = [
  'M-2,0 Q9,240 -2,480',
  'M36,0 Q48,240 34,480',
  'M74,0 Q87,240 72,480',
  'M112,0 Q126,240 110,480',
  'M148,0 Q163,240 146,480',
]

const EAST_CONTOURS = [
  'M562,0 Q551,240 562,480',
  'M524,0 Q512,240 526,480',
  'M486,0 Q473,240 488,480',
  'M448,0 Q434,240 450,480',
  'M412,0 Q397,240 414,480',
]

const VALLEY_CONTOURS = [
  'M150,72 Q280,63 410,72',
  'M149,150 Q280,141 411,150',
  'M148,236 Q280,226 412,236',
  'M147,324 Q280,313 413,324',
  'M146,408 Q280,396 414,408',
]

const ROAD_NS = 'M277,0 C276,52 277,118 278,168 C279,222 277,302 274,424 C273,458 272,474 271,480'
const ROAD_W  = 'M278,168 C257,163 230,158 198,153 Q165,148 132,143'
const ROAD_E  = 'M278,168 C299,163 326,158 358,153 Q392,148 422,143'
const RIVER   = 'M255,105 C253,168 251,244 249,318 C247,394 249,462 247,480'


export function MapSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activeLocation, setActiveLocation] = useState<string | null>('salta-capital')

  const active = MAP_LOCATIONS.find((l) => l.id === activeLocation)

  return (
    <section ref={ref} className="section-padding bg-radix-navy overflow-hidden">
      <div className="section-container">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div>
            <motion.div
              className="label-tag mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Territorio
            </motion.div>
            <motion.h2
              className="font-serif text-display-3 text-white"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {TERRITORY_SUB}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Architectural SVG croquis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square lg:aspect-auto lg:min-h-[520px] rounded-2xl overflow-hidden
                       bg-radix-surface border border-radix-border"
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 35%, rgba(20,120,204,0.06) 0%, transparent 65%)',
              }}
            />

            {/* Architectural croquis SVG */}
            <svg
              viewBox="0 0 560 480"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
              style={{ display: 'block' }}
            >
              {/* Western mountain contours */}
              {WEST_CONTOURS.map((d, i) => (
                <path
                  key={`w${i}`}
                  d={d}
                  fill="none"
                  stroke="rgba(43,143,217,0.13)"
                  strokeWidth={0.75}
                />
              ))}

              {/* Eastern mountain contours */}
              {EAST_CONTOURS.map((d, i) => (
                <path
                  key={`e${i}`}
                  d={d}
                  fill="none"
                  stroke="rgba(43,143,217,0.13)"
                  strokeWidth={0.75}
                />
              ))}

              {/* Valley floor — subtle fill */}
              <path
                d="M148,0 Q163,240 146,480 L414,480 Q397,240 412,0 Z"
                fill="rgba(20,120,204,0.025)"
                stroke="none"
              />

              {/* Valley floor horizontal contours */}
              {VALLEY_CONTOURS.map((d, i) => (
                <path
                  key={`h${i}`}
                  d={d}
                  fill="none"
                  stroke="rgba(43,143,217,0.08)"
                  strokeWidth={0.5}
                />
              ))}

              {/* Valley boundary lines */}
              <path d="M148,0 Q163,240 146,480" fill="none" stroke="rgba(43,143,217,0.22)" strokeWidth={0.75} />
              <path d="M412,0 Q397,240 414,480" fill="none" stroke="rgba(43,143,217,0.22)" strokeWidth={0.75} />

              {/* River — dashed */}
              <path
                d={RIVER}
                fill="none"
                stroke="rgba(58,158,232,0.28)"
                strokeWidth={0.75}
                strokeDasharray="5 3.5"
              />

              {/* Roads */}
              <path d={ROAD_NS} fill="none" stroke="rgba(160,174,192,0.20)" strokeWidth={1} />
              <path d={ROAD_W}  fill="none" stroke="rgba(160,174,192,0.14)" strokeWidth={0.75} />
              <path d={ROAD_E}  fill="none" stroke="rgba(160,174,192,0.14)" strokeWidth={0.75} />

              {/* Mountain range labels */}
              <text
                x={78}
                y={240}
                textAnchor="middle"
                fontSize={7}
                fill="rgba(43,143,217,0.22)"
                letterSpacing="0.18em"
                transform="rotate(-88 78 240)"
                style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}
              >
                Sierras de Chirita
              </text>
              <text
                x={482}
                y={240}
                textAnchor="middle"
                fontSize={7}
                fill="rgba(43,143,217,0.22)"
                letterSpacing="0.18em"
                transform="rotate(88 482 240)"
                style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}
              >
                Sierras de Mojotoro
              </text>

              {/* Valley floor label */}
              <text
                x={280}
                y={450}
                textAnchor="middle"
                fontSize={7}
                fill="rgba(43,143,217,0.18)"
                letterSpacing="0.28em"
                style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}
              >
                Valle de Lerma
              </text>

              {/* North indicator */}
              <g transform="translate(524 28)">
                <line x1={0} y1={14} x2={0} y2={-14} stroke="rgba(160,174,192,0.30)" strokeWidth={0.75} />
                <polygon points="-3.5 3 3.5 3 0 -7" fill="rgba(160,174,192,0.35)" />
                <text
                  x={0}
                  y={26}
                  textAnchor="middle"
                  fontSize={7}
                  fill="rgba(160,174,192,0.30)"
                  letterSpacing="0.1em"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  N
                </text>
              </g>

              {/* Scale bar */}
              <g transform="translate(30 456)">
                <line x1={0} y1={0} x2={40} y2={0} stroke="rgba(160,174,192,0.25)" strokeWidth={0.75} />
                <line x1={0} y1={-3} x2={0} y2={3} stroke="rgba(160,174,192,0.25)" strokeWidth={0.75} />
                <line x1={40} y1={-3} x2={40} y2={3} stroke="rgba(160,174,192,0.25)" strokeWidth={0.75} />
                <text
                  x={20}
                  y={14}
                  textAnchor="middle"
                  fontSize={6.5}
                  fill="rgba(160,174,192,0.25)"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  5 km
                </text>
              </g>

              {/* Location markers */}
              {MAP_LOCATIONS.map((loc) => {
                const isActive = activeLocation === loc.id
                return (
                  <g
                    key={loc.id}
                    onClick={() => setActiveLocation(loc.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulse ring for active */}
                    {isActive && (
                      <circle
                        cx={loc.sx}
                        cy={loc.sy}
                        r={18}
                        fill="none"
                        stroke="rgba(20,120,204,0.20)"
                        strokeWidth={0.75}
                        className="animate-map-pulse"
                      />
                    )}

                    {/* Outer ring */}
                    <circle
                      cx={loc.sx}
                      cy={loc.sy}
                      r={isActive ? 8 : 5.5}
                      fill="none"
                      stroke={isActive ? 'rgba(20,120,204,0.80)' : 'rgba(43,143,217,0.32)'}
                      strokeWidth={isActive ? 1.5 : 1}
                    />

                    {/* Inner dot */}
                    <circle
                      cx={loc.sx}
                      cy={loc.sy}
                      r={isActive ? 3.5 : 2}
                      fill={isActive ? '#1478CC' : 'rgba(43,143,217,0.45)'}
                    />

                    {/* Label */}
                    <text
                      x={loc.sx}
                      y={loc.sy - 16}
                      textAnchor="middle"
                      fontSize={isActive ? 9 : 7.5}
                      fill={isActive ? 'rgba(237,242,247,0.90)' : 'rgba(160,174,192,0.45)'}
                      letterSpacing="0.10em"
                      fontWeight={isActive ? '500' : '400'}
                      style={{ fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}
                    >
                      {loc.name}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 text-[0.6rem] text-radix-text-4 tracking-[0.08em]">
              Croquis territorial — RADIX
            </div>
          </motion.div>

          {/* Location details */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            {MAP_LOCATIONS.map((location) => (
              <button
                key={location.id}
                onClick={() => setActiveLocation(location.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-500 ${
                  activeLocation === location.id
                    ? 'bg-radix-surface-2 border-radix-blue/35 shadow-[0_4px_32px_rgba(20,120,204,0.07)]'
                    : 'bg-radix-surface border-radix-border hover:border-radix-border-2'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                        activeLocation === location.id ? 'text-radix-blue' : 'text-radix-text-4'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{location.name}</span>
                        <span className="highlight-badge">{location.badge}</span>
                      </div>
                      {activeLocation === location.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="text-xs text-radix-text-4 leading-relaxed mb-2">
                            {location.description}
                          </p>
                          <div className="text-xs text-radix-text-3">{location.address}</div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            <div className="mt-2 p-5 rounded-xl bg-radix-surface border border-radix-border">
              <div className="text-xs text-radix-text-4 mb-3 tracking-wide">
                Próximamente ampliando cobertura a
              </div>
              <div className="flex flex-wrap gap-2">
                {['San Agustín', 'Cerrillos', 'Chicoana'].map((city) => (
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
