-- =============================================================
-- 024 — get_propiedades_publicas: sacar los límites implícitos
--
-- Correr en: Supabase Dashboard → SQL Editor
--
-- Problema
-- --------
-- La versión de 018 tenía DOS límites que ningún llamador pedía:
--
--   p_limit INTEGER DEFAULT 50          → llamarla sin p_limit devolvía 50 filas
--   LIMIT LEAST(p_limit, 100)           → cap duro de 100, incluso pidiendo más
--
-- Con 53 propiedades publicadas, /propiedades mostraba 50. El sitemap veía las 53
-- solo porque paginaba, y el cap de 100 era invisible por estar todavía por debajo.
--
-- El cap además rompía el barrido de getAllPropiedadesPublicas() en cuanto el
-- inventario superara las 100: pedía páginas de 200, recibía 100, y por recibir
-- menos de lo pedido daba el recorrido por terminado. Silencioso, y se llevaba
-- puesto el sitemap. Ese lado ya quedó blindado en el cliente (el barrido avanza
-- por lo recibido), pero el cap no tiene por qué seguir existiendo: los datos que
-- devuelve esta función son los que ya se publican en la web y en el sitemap.
--
-- Qué cambia
-- ----------
--   1. p_limit pasa a DEFAULT NULL → sin límite salvo que se pida uno explícito.
--      `LIMIT NULL` en Postgres es "todas las filas".
--   2. Se elimina el LEAST(..., 100): un p_limit explícito ahora se respeta tal cual.
--   3. Se agrega `p.id ASC` como desempate final del ORDER BY.
--
-- Qué NO cambia: los mismos filtros, el mismo RETURNS TABLE (mismas columnas, mismo
-- orden y mismos tipos), SECURITY DEFINER, search_path, y el mismo criterio de orden
-- para todo lo que ya estaba desempatado. p_limit explícito sigue funcionando igual
-- para cualquier valor <= 100, así que las llamadas existentes no cambian de
-- resultado. CREATE OR REPLACE conserva los permisos; el GRANT se repite igual por
-- idempotencia.
--
-- Sobre el desempate por id: `id` es uuid (uuid_generate_v4), o sea aleatorio, no
-- cronológico. Para un tiebreaker eso es exactamente lo que hace falta: uuid tiene
-- orden total y estable en Postgres, así que dos filas con misma destacada, mismo
-- orden_web y mismo publicado_en caen siempre en el mismo orden entre llamadas. Sin
-- él, ese empate lo resolvía el plan de ejecución y podía cambiar entre una consulta
-- y la siguiente: con LIMIT/OFFSET eso significa una fila repetida en una página y
-- otra que no aparece nunca. Es la precondición para paginar de verdad más adelante.
-- =============================================================

CREATE OR REPLACE FUNCTION get_propiedades_publicas(
  p_tipo    TEXT    DEFAULT NULL,
  p_ciudad  TEXT    DEFAULT NULL,
  p_uso     TEXT    DEFAULT NULL,
  p_limit   INTEGER DEFAULT NULL,   -- 018: DEFAULT 50
  p_offset  INTEGER DEFAULT 0
)
RETURNS TABLE (
  id                  UUID,
  codigo              TEXT,
  slug                TEXT,
  tipo                TEXT,
  uso                 TEXT,
  estado              TEXT,
  titulo_web          TEXT,
  descripcion_web     TEXT,
  seo_title           TEXT,
  seo_description     TEXT,
  video_url           TEXT,
  imagen_portada_url  TEXT,
  destacada           BOOLEAN,
  orden_web           INTEGER,
  publicado_en        TIMESTAMPTZ,
  direccion           TEXT,
  barrio              TEXT,
  ciudad              TEXT,
  provincia           TEXT,
  latitud             NUMERIC,
  longitud            NUMERIC,
  superficie_total    NUMERIC,
  superficie_cubierta NUMERIC,
  ambientes           INTEGER,
  dormitorios         INTEGER,
  banos               INTEGER,
  cocheras            INTEGER,
  antiguedad_anos     INTEGER,
  tiene_ascensor      BOOLEAN,
  tiene_balcon        BOOLEAN,
  tiene_terraza       BOOLEAN,
  tiene_piscina       BOOLEAN,
  permite_mascotas    BOOLEAN,
  precio_alquiler     NUMERIC,
  moneda_alquiler     TEXT,
  precio_venta        NUMERIC,
  moneda_venta        TEXT,
  expensas_monto      NUMERIC
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id, p.codigo, p.slug,
    p.tipo::text, p.uso::text, p.estado::text,
    p.titulo_web, p.descripcion_web, p.seo_title, p.seo_description,
    p.video_url, p.imagen_portada_url, p.destacada, p.orden_web, p.publicado_en,
    p.direccion, p.barrio, p.ciudad, p.provincia, p.latitud, p.longitud,
    p.superficie_total, p.superficie_cubierta,
    p.ambientes, p.dormitorios, p.banos, p.cocheras, p.antiguedad_anos,
    p.tiene_ascensor, p.tiene_balcon, p.tiene_terraza,
    p.tiene_piscina, p.permite_mascotas,
    p.precio_alquiler, p.moneda_alquiler,
    p.precio_venta, p.moneda_venta, p.expensas_monto
  FROM propiedades p
  WHERE p.publicada = true
    AND p.deleted_at IS NULL
    AND (p_tipo   IS NULL OR p.tipo::text = p_tipo)
    AND (p_ciudad IS NULL OR p.ciudad ILIKE '%' || p_ciudad || '%')
    AND (p_uso    IS NULL OR p.uso::text  = p_uso)
  ORDER BY p.destacada DESC, p.orden_web ASC NULLS LAST, p.publicado_en DESC, p.id ASC
  LIMIT  p_limit          -- NULL = sin límite (018: LEAST(p_limit, 100))
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION get_propiedades_publicas(TEXT, TEXT, TEXT, INTEGER, INTEGER) TO anon;

-- PostgREST cachea las firmas; refrescar para que tome el nuevo default.
NOTIFY pgrst, 'reload schema';

-- =============================================================
-- Verificación (correr después, debería dar 53 / 53 / 5 / 53)
--
--   SELECT count(*) FROM propiedades WHERE publicada = true AND deleted_at IS NULL;
--   SELECT count(*) FROM get_propiedades_publicas();              -- sin límite
--   SELECT count(*) FROM get_propiedades_publicas(p_limit => 5);  -- límite explícito
--   SELECT count(*) FROM get_propiedades_publicas(p_limit => 500);-- ya no capa en 100
-- =============================================================
