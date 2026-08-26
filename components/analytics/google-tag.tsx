import Script from 'next/script'
import { GOOGLE_TAG_IDS, GOOGLE_TAG_LOADER_ID } from '@/lib/analytics/google'

/**
 * Google tag global (gtag.js). Se monta una sola vez en el root layout, así
 * que cubre todas las páginas públicas.
 *
 * Anti-duplicación:
 * - gtag.js se carga UNA vez, con el primer ID; los demás IDs se agregan
 *   como `gtag('config', ...)` sobre la misma librería (así lo documenta
 *   Google para convivir Ads + GA4).
 * - Los <Script> llevan `id`, que es lo que usa next/script para no volver a
 *   inyectar ni re-ejecutar el mismo script en navegaciones del App Router.
 * - `window.dataLayer = window.dataLayer || []` preserva la cola si algo ya
 *   la creó, en vez de pisarla.
 */
export function GoogleTag() {
  if (!GOOGLE_TAG_LOADER_ID) return null

  const configLines = GOOGLE_TAG_IDS.map((id) => `gtag('config', '${id}');`).join('\n')

  return (
    <>
      <Script
        id="google-tag-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_LOADER_ID}`}
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configLines}`}
      </Script>
    </>
  )
}
