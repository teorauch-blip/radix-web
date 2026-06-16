'use server'

import { createClient } from '@supabase/supabase-js'

export interface LeadInput {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  // Contexto opcional de propiedad (cuando el lead viene del detalle)
  propiedad_id?: string | null
  propiedad_codigo?: string | null
  propiedad_titulo?: string | null
}

export type LeadResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  // ─── Validación server-side ───
  const nombre = input.nombre?.trim()
  const email = input.email?.trim()
  const mensaje = input.mensaje?.trim()
  const telefono = input.telefono?.trim() || null

  if (!nombre || !email || !mensaje) {
    return { ok: false, error: 'Completá nombre, email y mensaje.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'El email no parece válido.' }
  }
  if (mensaje.length > 2000) {
    return { ok: false, error: 'El mensaje es demasiado largo.' }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    console.error('[leads] Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL')
    return { ok: false, error: 'No pudimos procesar la consulta. Intentá más tarde.' }
  }

  // Cliente con service_role — SOLO en servidor, la key nunca llega al browser.
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Columnas base seguras (contenido + contexto de propiedad).
  const base = {
    nombre,
    email,
    telefono,
    mensaje,
    propiedad_id: input.propiedad_id ?? null,
    propiedad_codigo: input.propiedad_codigo ?? null,
    propiedad_titulo: input.propiedad_titulo ?? null,
  }

  // Intento con metadata de origen; si origen/canal fueran enums con valores
  // fijos en la DB, reintentamos sin esos campos para no perder el lead.
  let { error } = await supabase
    .from('consultas_entrantes')
    .insert({ ...base, origen: 'radix-web', canal: 'formulario' })

  if (error) {
    const retry = await supabase.from('consultas_entrantes').insert(base)
    error = retry.error
  }

  if (error) {
    console.error('[leads] submitLead:', error.message)
    return { ok: false, error: 'No pudimos enviar tu consulta. Probá de nuevo en un momento.' }
  }

  return { ok: true }
}
