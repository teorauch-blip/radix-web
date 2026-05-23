'use client'

import { ArrowUpRight } from 'lucide-react'

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        // TODO: integrate with Supabase or email provider
      }}
    >
      <input
        type="email"
        placeholder="tu@email.com"
        className="w-full px-4 py-3 text-sm bg-radix-surface border border-radix-border rounded-xl
                   text-radix-text-2 placeholder:text-radix-text-4
                   focus:outline-none focus:border-radix-blue/50 transition-colors"
      />
      <button type="submit" className="btn-outline text-xs py-2.5">
        Suscribirme
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </form>
  )
}
