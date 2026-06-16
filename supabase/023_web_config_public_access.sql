-- =============================================================
-- 023_web_config_public_access.sql
-- Función pública para que radix-web lea web_config sin RLS.
--
-- Problema: web_config tiene RLS con is_agente_or_above().
-- El anon key de radix-web no tiene ese rol → permission denied.
-- fetchConfig silenciaba el error y activaba el fallback siempre.
--
-- Solución: mismo patrón que get_propiedades_publicas en 018.
-- SECURITY DEFINER corre como table owner → bypasa RLS.
-- GRANT a anon → accesible con la anon key de radix-web.
--
-- Correr en: Supabase Dashboard → SQL Editor
-- =============================================================

CREATE OR REPLACE FUNCTION get_web_config_public(p_clave TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT valor
  FROM   web_config
  WHERE  clave = p_clave
  LIMIT  1;
$$;

GRANT EXECUTE ON FUNCTION get_web_config_public(TEXT) TO anon;

-- Verificar que funcionó:
-- SELECT get_web_config_public('hero');
-- SELECT get_web_config_public('sobre_radix');
-- SELECT get_web_config_public('metricas');
-- SELECT get_web_config_public('cta_final');
