-- =============================================================
-- 021_web_config_anon_access.sql
-- Permite que el rol anon (web pública sin sesión) lea web_config.
-- web_config contiene solo contenido público del sitio — seguro.
-- Correr en: Supabase Dashboard → SQL Editor
-- =============================================================

-- Habilitar lectura pública de web_config para radix-web
DROP POLICY IF EXISTS "web_config_anon_select" ON web_config;
CREATE POLICY "web_config_anon_select"
  ON web_config FOR SELECT
  TO anon
  USING (true);

-- ─────────────────────────────────────────────────────────────
-- Actualizar seeds con datos reales de RADIX
-- ON CONFLICT DO UPDATE → safe para re-ejecutar
-- ─────────────────────────────────────────────────────────────
INSERT INTO web_config (clave, descripcion, valor) VALUES

  ('contacto', 'Datos de contacto visibles en la web', '{
    "whatsapp_number":  "5493870000000",
    "telefono_visible": "+54 387 XXX-XXXX",
    "email_contacto":   "info@radixconsultores.com",
    "direccion":        "Balcarce 1050, Salta Capital",
    "horario":          "Lunes a viernes · 9 a 18 hs"
  }'),

  ('redes', 'URLs de redes sociales', '{
    "instagram_url": "",
    "facebook_url":  "",
    "linkedin_url":  ""
  }'),

  ('empresa', 'Datos generales de RADIX', '{
    "nombre":     "RADIX Consultores Inmobiliarios",
    "matriculas": "Matrículas CMCPRA Nº 656 · 291",
    "tagline":    "Firma premium de real estate en Salta y el NOA. Estrategia, diseño y precisión."
  }'),

  ('seo_global', 'Meta tags por defecto del sitio', '{
    "seo_default_title":       "RADIX Consultores Inmobiliarios",
    "seo_default_description": "Firma premium de real estate en Salta y el NOA. Estrategia, diseño y precisión al servicio del capital inmobiliario.",
    "seo_og_title":            "RADIX Consultores Inmobiliarios",
    "seo_og_description":      "Firma premium de real estate. Salta · NOA · Argentina."
  }')

ON CONFLICT (clave) DO UPDATE SET
  valor      = EXCLUDED.valor,
  updated_at = NOW();

NOTIFY pgrst, 'reload schema';
