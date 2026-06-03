'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { COMPANY_ABOUT } from '@/lib/content/company'
import type { SobreRadixConfig } from '@/lib/types/db'

interface IntroProps {
  cms?: SobreRadixConfig
}

export function Intro({ cms }: IntroProps = {}) {
  const label      = cms?.label      ?? COMPANY_ABOUT.label
  const titleLine1 = cms?.titleLine1 ?? COMPANY_ABOUT.headlineLines[0]
  const titleLine2 = cms?.titleLine2 ?? COMPANY_ABOUT.headlineLines[1]
  const paragraphs = cms?.paragraphs ?? [...COMPANY_ABOUT.paragraphs]
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-[#F6F8FA]">
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
              {label}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-display-3 text-[#0C1929]"
            >
              {titleLine1}
              <br />
              <span className="italic font-normal text-[#3A5A78]">
                {titleLine2}
              </span>
            </motion.h2>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 lg:pt-16 space-y-6">
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`text-base lg:text-lg leading-relaxed ${
                  i === 0 ? 'text-[#1A3554]' : 'text-[#3A5A78]'
                }`}
              >
                {text}
              </motion.p>
            ))}

            <motion.div
              className="pt-8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="divider-light" />
              <div className="flex flex-wrap gap-8 mt-8">
                {COMPANY_ABOUT.details.map((item) => (
                  <div key={item.label}>
                    <div className="text-sm font-medium text-[#1A3554]">{item.label}</div>
                    <div className="text-xs text-[#5A7A96] mt-1">{item.sub}</div>
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
