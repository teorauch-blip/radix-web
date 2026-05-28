// ─────────────────────────────────────────────────────────────────
// Homepage content — edit here to update text, numbers and cards
// without touching component files.
// ─────────────────────────────────────────────────────────────────

// ── Hero ──────────────────────────────────────────────────────────

export const HERO_LABEL = 'Salta · NOA'

export const HERO_STATS = [
  { value: '17+', label: 'Años de trayectoria' },
  { value: '+200', label: 'Propiedades operadas' },   // ← ajustar número real
  { value: '+80', label: 'Propiedades administradas' }, // ← ajustar número real
] as const

// ── Data / Stats section ──────────────────────────────────────────

export const HOME_METRICS = [
  {
    value: 17,
    label: 'Años de trayectoria',
    sub: 'en el mercado salteño',
    prefix: '',
    suffix: '+',
  },
  {
    value: 200,          // ← ajustar número real
    label: 'Propiedades comercializadas',
    sub: 'desde nuestros inicios',
    prefix: '+',
    suffix: '',
  },
  {
    value: 80,           // ← ajustar número real
    label: 'Propiedades administradas',
    sub: 'en gestión activa',
    prefix: '+',
    suffix: '',
  },
  {
    value: 4,
    label: 'Zonas activas',
    sub: 'con presencia directa en Salta',
    prefix: '',
    suffix: '',
  },
] as const

// ── Investment areas ──────────────────────────────────────────────

export const INVESTMENT_AREAS = [
  {
    iconName: 'MapPin' as const,
    title: 'Salta Capital',
    description:
      'Centro histórico, corredor de Av. Tavella, Tres Cerritos y Grand Bourg. Mercado activo con demanda residencial consolidada.',
    badge: 'Zona consolidada',
    type: 'Renta + plusvalía',
  },
  {
    iconName: 'Building2' as const,
    title: 'San Lorenzo',
    description:
      'Zona residencial de alto estándar. Country clubs, entornos serrano y calidad de vida diferenciada. Perfil de comprador definido.',
    badge: 'Mercado activo',
    type: 'Residencial premium',
  },
  {
    iconName: 'TrendingUp' as const,
    title: 'Desarrollo urbano',
    description:
      'Lotes estratégicos y proyectos en pozo en zonas de crecimiento de Salta. Acompañamos la operación de principio a fin.',
    badge: 'Perfil inversor',
    type: 'Potencial a evaluar',
  },
] as const

// ── Territory / Map locations ─────────────────────────────────────

export const TERRITORY_SUB =
  'Cada zona requiere lectura propia: valores, demanda, tiempos y proyección.'

export const MAP_LOCATIONS = [
  {
    id: 'salta-capital',
    name: 'Salta Capital',
    address: 'Balcarce 1050, Salta Capital',
    description: 'Sede principal. Atención personalizada de lunes a viernes.',
    sx: 278,
    sy: 168,
    badge: 'Sede',
  },
  {
    id: 'san-lorenzo',
    name: 'San Lorenzo',
    address: 'San Lorenzo, Salta',
    description: 'Zona residencial de alto estándar. Country clubs, serranías y calidad de vida premium.',
    sx: 210,
    sy: 141,
    badge: 'Zona activa',
  },
  {
    id: 'tres-cerritos',
    name: 'Tres Cerritos',
    address: 'Tres Cerritos, Salta Capital',
    description: 'Barrio privado en expansión. Alta demanda residencial en la ciudad.',
    sx: 352,
    sy: 152,
    badge: 'Zona activa',
  },
  {
    id: 'valle-de-lerma',
    name: 'Valle de Lerma',
    address: 'Valle de Lerma, Salta',
    description: 'Zona rural y periurbana con presencia activa. Mercado en desarrollo.',
    sx: 268,
    sy: 320,
    badge: 'Zona activa',
  },
] as const

// ── Service panels ────────────────────────────────────────────────

export const SERVICE_PANELS = [
  {
    id: 'residencial',
    number: '01',
    label: 'Residencial',
    title: 'Residencial',
    description:
      'Casas, departamentos y desarrollos en las mejores ubicaciones de Salta. Selección rigurosa y atención personalizada en cada operación.',
    href: '/propiedades?categoria=residencial',
    metric: 'Compra · Venta · Alquiler',
    subMetric: 'propiedades residenciales',
    accent: '#0172C6',
  },
  {
    id: 'comercial',
    number: '02',
    label: 'Comercial',
    title: 'Comercial',
    description:
      'Locales, oficinas y plantas industriales. Análisis de rentabilidad, due diligence jurídico y gestión integral del activo.',
    href: '/propiedades?categoria=comercial',
    metric: 'Compra · Alquiler',
    subMetric: 'activos comerciales',
    accent: '#0E1B8C',
  },
  {
    id: 'desarrollo',
    number: '03',
    label: 'Desarrollos',
    title: 'Desarrollo',
    description:
      'Lotes estratégicos y proyectos en pozo. Identificamos el activo, estructuramos la operación, acompañamos el proceso.',
    href: '/inversiones',
    metric: 'Tierra · Pozo',
    subMetric: 'oportunidades de desarrollo',
    accent: '#0172C6',
  },
  {
    id: 'administracion',
    number: '04',
    label: 'Administración',
    title: 'Administración',
    description:
      'Gestión profesional de carteras inmobiliarias. Cobranzas, mantenimiento e informes de rendimiento periódicos.',
    href: '/administracion',
    metric: 'Gestión integral',
    subMetric: 'de propiedades',
    accent: '#0E1B8C',
  },
] as const

// ── CTA / Contact ─────────────────────────────────────────────────

export const CTA_SECTION = {
  label: 'Contacto',
  headlineLines: ['El primer paso es', 'una conversación.'],
  sub: 'Contanos qué buscás. Nuestro equipo analiza tu situación y te presenta opciones concretas, sin rodeos.',
  locationLine: 'Salta · NOA',
} as const

// ── References / Testimonials ─────────────────────────────────────

export const REFERENCES = {
  label: 'Confianza',
  headline: 'Relaciones construidas\nen el tiempo.',
  sub: 'Gran parte de nuestro trabajo se sostiene en clientes que vuelven, propietarios que confían sus inmuebles y operaciones que llegan por recomendación.',
  profiles: [
    { label: 'Propietarios', description: 'Propietarios que confían la gestión y comercialización de sus inmuebles.' },
    { label: 'Compradores', description: 'Familias e individuos que buscan su vivienda definitiva o una inversión sólida.' },
    { label: 'Inversores', description: 'Perfiles que priorizan rentabilidad, recorrido y criterio profesional.' },
    { label: 'Desarrolladores', description: 'Empresas y emprendedores con proyectos en el mercado salteño.' },
  ],
} as const
