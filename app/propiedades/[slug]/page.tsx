import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getPropiedadesPublicas, getPropiedadPublica, getPropiedadImagenes } from '@/lib/data/propiedades'
import type { PropiedadPublica, ImagenPublica } from '@/lib/types/db'
import { getContactConfig } from '@/lib/data/web-config'

export const revalidate = 300

// Genera rutas estáticas para las propiedades publicadas en build time.
// dynamicParams = true (default) permite que slugs nuevos se generen on-demand.
export async function generateStaticParams() {
  const props = await getPropiedadesPublicas({ limit: 100 })
  return props
    .filter(p => Boolean(p.slug))
    .map(p => ({ slug: p.slug! }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const property = await getPropiedadPublica(params.slug)
  if (!property) return {}

  return {
    title:       property.seo_title ?? property.titulo_web ?? params.slug,
    description: property.seo_description ?? property.descripcion_web ?? undefined,
    openGraph: property.imagen_portada_url
      ? { images: [{ url: property.imagen_portada_url }] }
      : undefined,
  }
}

// ─── Helpers de visualización ────────────────────────────────

const TIPO_LABEL: Record<string, string> = {
  departamento: 'Departamento',
  casa:         'Casa',
  duplex:       'Duplex',
  local:        'Local',
  oficina:      'Oficina',
  terreno:      'Terreno',
  cochera:      'Cochera',
  galpon:       'Galpón',
  otro:         'Propiedad',
}

const OPERACION_LABEL = (p: PropiedadPublica): string => {
  if (p.precio_venta && p.precio_venta > 0)     return 'Venta'
  if (p.precio_alquiler && p.precio_alquiler > 0) return 'Alquiler'
  return 'Consultar'
}

function formatPrice(amount: number | null, currency: string | null): string {
  if (!amount) return 'Consultar'
  const fmt = new Intl.NumberFormat('es-AR', {
    style:                 'currency',
    currency:              currency ?? 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return fmt.format(amount)
}

// Imagen con fallback elegante
function PropertyImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'
  return (
    <Image
      src={src ?? PLACEHOLDER}
      alt={alt}
      fill
      className={className ?? 'object-cover'}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      priority
    />
  )
}

// ─── Página ───────────────────────────────────────────────────

export default async function PropiedadPage({ params }: { params: { slug: string } }) {
  const property = await getPropiedadPublica(params.slug)
  if (!property) notFound()

  const [imagenes, contact] = await Promise.all([
    getPropiedadImagenes(property.id),
    getContactConfig(),
  ])

  const precio    = property.precio_venta ?? property.precio_alquiler
  const moneda    = property.precio_venta ? property.moneda_venta : property.moneda_alquiler
  const operacion = OPERACION_LABEL(property)

  const waNumber = contact.whatsapp_number
  const waMsg    = encodeURIComponent(`Hola, me interesa la propiedad "${property.titulo_web ?? property.codigo}". ¿Podría obtener más información?`)
  const wa       = `https://wa.me/${waNumber}?text=${waMsg}`

  // Imagen de portada: la marcada como es_portada, o la primera, o imagen_portada_url
  const portada = imagenes.find(i => i.es_portada) ?? imagenes[0] ?? null
  const coverSrc = portada?.url ?? property.imagen_portada_url

  // Galería de miniaturas (excluye la portada)
  const galeria = imagenes.filter(i => i.url !== coverSrc).slice(0, 8)

  // Características booleanas como amenities
  const amenities: string[] = []
  if (property.tiene_ascensor)   amenities.push('Ascensor')
  if (property.tiene_balcon)     amenities.push('Balcón')
  if (property.tiene_terraza)    amenities.push('Terraza')
  if (property.tiene_piscina)    amenities.push('Piscina')
  if (property.permite_mascotas) amenities.push('Permite mascotas')

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3252] via-[#172A47] to-[#122137]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 50% 20%, rgba(14,96,175,0.15) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-10 section-container pt-6 pb-28 lg:pt-8 lg:pb-40">
          {/* Back link */}
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 text-xs text-radix-text-4 hover:text-radix-text-2 transition-colors duration-200 mb-10 uppercase tracking-[0.15em]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Propiedades
          </Link>

          {/* Cover image */}
          <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/7] bg-radix-surface relative">
            <PropertyImage
              src={coverSrc}
              alt={property.titulo_web ?? property.codigo}
            />
          </div>

          {/* Galería de miniaturas */}
          {galeria.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mb-10">
              {galeria.map((img) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-lg overflow-hidden relative bg-radix-surface"
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text ?? property.titulo_web ?? property.codigo}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: details */}
            <div className="lg:col-span-2 space-y-10">
              {property.destacada && (
                <div className="label-tag">DESTACADO</div>
              )}

              <div>
                <h1 className="font-serif text-display-3 text-white mb-3">
                  {property.titulo_web ?? `${TIPO_LABEL[property.tipo] ?? 'Propiedad'} en ${property.barrio ?? property.ciudad}`}
                </h1>
                <p className="flex items-center gap-2 text-sm text-radix-text-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {property.direccion}
                  {property.barrio && ` · ${property.barrio}`}
                  {` · ${property.ciudad}`}
                </p>
              </div>

              {property.descripcion_web && (
                <p className="text-radix-text-2 text-lg leading-relaxed">
                  {property.descripcion_web}
                </p>
              )}

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {property.superficie_cubierta != null && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">{property.superficie_cubierta} m²</div>
                    <div className="text-radix-text-4 text-xs mt-1">Sup. cubierta</div>
                  </div>
                )}
                {property.superficie_total != null && property.superficie_cubierta == null && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">{property.superficie_total} m²</div>
                    <div className="text-radix-text-4 text-xs mt-1">Superficie total</div>
                  </div>
                )}
                {property.ambientes != null && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">{property.ambientes}</div>
                    <div className="text-radix-text-4 text-xs mt-1">Ambientes</div>
                  </div>
                )}
                {property.dormitorios != null && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">{property.dormitorios}</div>
                    <div className="text-radix-text-4 text-xs mt-1">Dormitorios</div>
                  </div>
                )}
                {property.banos != null && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">{property.banos}</div>
                    <div className="text-radix-text-4 text-xs mt-1">Baños</div>
                  </div>
                )}
                {property.cocheras != null && property.cocheras > 0 && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">{property.cocheras}</div>
                    <div className="text-radix-text-4 text-xs mt-1">Cocheras</div>
                  </div>
                )}
                {property.antiguedad_anos != null && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">{property.antiguedad_anos}</div>
                    <div className="text-radix-text-4 text-xs mt-1">Años antigüedad</div>
                  </div>
                )}
                {property.expensas_monto != null && property.expensas_monto > 0 && (
                  <div className="bg-radix-surface border border-radix-border rounded-xl p-4">
                    <div className="text-white text-xl font-light">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(property.expensas_monto)}
                    </div>
                    <div className="text-radix-text-4 text-xs mt-1">Expensas</div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div>
                  <div className="text-xs text-radix-text-4 uppercase tracking-[0.18em] mb-4">
                    Características
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <span
                        key={a}
                        className="px-3 py-1.5 text-xs rounded-full bg-radix-surface border border-radix-border text-radix-text-2"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: price + CTA */}
            <div className="lg:col-span-1">
              <div className="bg-radix-surface border border-radix-border rounded-2xl p-8 sticky top-32">
                <div className="text-xs text-radix-text-4 uppercase tracking-[0.15em] mb-2">
                  {operacion} · {TIPO_LABEL[property.tipo] ?? property.tipo}
                </div>
                <div className="text-3xl lg:text-4xl font-light text-white tracking-tight mb-1">
                  {formatPrice(precio, moneda)}
                </div>
                <div className="text-radix-text-4 text-sm mb-8">
                  {property.barrio && property.barrio !== property.ciudad
                    ? `${property.barrio} · ${property.ciudad}`
                    : property.ciudad}
                </div>

                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center mb-3"
                >
                  Consultar por WhatsApp
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <Link href="/propiedades" className="btn-ghost w-full justify-center text-sm">
                  Ver más propiedades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
