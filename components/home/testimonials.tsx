'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Testimonial } from '@/types'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < rating ? 'bg-radix-blue' : 'bg-radix-border'
          }`}
        />
      ))}
    </div>
  )
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const prev = () => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }

  const next = () => {
    setDirection(1)
    setCurrent((c) => (c + 1) % testimonials.length)
  }

  const testimonial = testimonials[current]

  return (
    <section ref={ref} className="section-padding bg-radix-abyss relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(1,114,198,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex label-tag mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
          >
            Testimonios
          </motion.div>
          <motion.h2
            className="font-serif text-display-3 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Lo que dice
            <br />
            quien confía en RADIX.
          </motion.h2>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative p-10 lg:p-14 rounded-3xl bg-radix-surface border border-radix-border overflow-hidden">
            {/* Decorative quote mark */}
            <Quote
              className="absolute top-8 right-10 w-16 h-16 text-radix-border opacity-50"
              strokeWidth={1}
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <StarRating rating={testimonial.rating} />

                <blockquote className="mt-6 text-xl lg:text-2xl font-light text-radix-text-2 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                <div className="mt-8 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-radix-gradient flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{testimonial.name}</div>
                    <div className="text-xs text-radix-text-4 mt-0.5">
                      {testimonial.role}
                      {testimonial.company && ` · ${testimonial.company}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-xl border border-radix-border text-radix-text-3
                         hover:border-radix-border-2 hover:text-white transition-all duration-200"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-radix-blue w-6' : 'bg-radix-border hover:bg-radix-border-2'
                  }`}
                  aria-label={`Ir al testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-xl border border-radix-border text-radix-text-3
                         hover:border-radix-border-2 hover:text-white transition-all duration-200"
              aria-label="Testimonio siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
