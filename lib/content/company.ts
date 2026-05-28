// ─────────────────────────────────────────────────────────────────
// Company profile — edit here to update institutional information
// across the entire site.
// ─────────────────────────────────────────────────────────────────

export const COMPANY = {
  name: 'RADIX',
  yearsActive: 17,
  founder: 'Rosa Uriburu',
  location: 'Salta Capital',
  address: 'Balcarce 1050, Salta Capital',
  phone: '+54 387 XXX-XXXX',   // ← reemplazar con número real
  email: 'info@radixconsultores.com',
  hours: 'Lunes a viernes · 9 a 18 hs',
  license: 'Matrículas 656 · 291',
} as const

export const COMPANY_ABOUT = {
  label: 'Sobre RADIX',
  headlineLines: ['Empresa familiar.', 'Trayectoria real.'],
  paragraphs: [
    'RADIX nace como una empresa familiar con más de 17 años de recorrido en el mercado inmobiliario de Salta. Sus primeros pasos fueron impulsados por Rosa Uriburu, construyendo con los años una red sólida de propietarios, compradores, inversores y desarrolladores.',
    'Nuestro trabajo combina conocimiento local, experiencia comercial y una mirada profesional sobre cada operación. Acompañamos procesos de compra, venta, alquiler, inversión y administración con criterio, cercanía y responsabilidad.',
    'Una inmobiliaria con trayectoria, relaciones construidas en el tiempo y experiencia concreta en el mercado donde operamos.',
  ],
  details: [
    { label: 'Salta Capital', sub: 'Sede principal' },
    { label: 'Salta · NOA', sub: 'Área de operación' },
    { label: 'Matrículas 656 · 291', sub: 'CMCPRA · Habilitación profesional' },
  ],
} as const
