-- RADIX Web — Seed Data (development only)
-- Run AFTER the schema migration

-- Agent
insert into agents (id, name, role, email, phone, bio) values
  ('00000000-0000-0000-0000-000000000001', 'Equipo RADIX', 'Consultores', 'info@radixconsultores.com', '+54 387 123-4567', 'Equipo profesional con más de 12 años en el mercado inmobiliario del NOA.');

-- Properties
insert into properties (slug, title, short_description, type, category, status, price, currency, surface_total, surface_covered, bedrooms, bathrooms, parking_spaces, floor, total_floors, address, neighborhood, city, province, cover_image, images, amenities, featured, highlight_label, agent_id) values
  (
    'penthouse-alto-noa-salta',
    'Penthouse Alto NOA',
    'Vista panorámica 360° sobre el valle de Lerma. Acabados de primera línea con tecnología domótica integrada.',
    'venta', 'penthouse', 'disponible',
    580000, 'USD',
    310, 280, 4, 4, 3, 22, 24,
    'Av. Virrey Toledo 400', 'Centro', 'Salta', 'Salta',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    array['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'],
    array['Piscina privada','Terraza','Domótica','SUM','Gym','Cochera cubierta'],
    true, 'EXCLUSIVO',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'oficinas-premium-belgrano-ba',
    'Torre Belgrano Offices',
    'Planta libre en el corazón de Belgrano. Ideal para headquarters corporativo o inversión de renta.',
    'venta', 'oficina', 'disponible',
    420000, 'USD',
    480, 480, null, null, 4, 8, 18,
    'Av. Cabildo 1850', 'Belgrano', 'Buenos Aires', 'Buenos Aires',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    array['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'],
    array['Planta libre','Doble altura','Parking','Seguridad 24h','Generator'],
    true, 'CORPORATIVO',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'casa-country-san-lorenzo',
    'Residencia San Lorenzo',
    'Arquitectura contemporánea en entorno privilegiado. 5000 m² de terreno con jardín diseñado.',
    'venta', 'residencial', 'disponible',
    340000, 'USD',
    520, 380, 5, 5, 4, null, null,
    'San Lorenzo Country Club', 'San Lorenzo', 'San Lorenzo', 'Salta',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    array['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80'],
    array['Piscina','Jardín diseñado','Quincho','Estudio','Guest house'],
    true, 'PREMIUM',
    '00000000-0000-0000-0000-000000000001'
  );

-- Testimonials
insert into testimonials (name, role, company, content, rating) values
  ('Martín Aguirre', 'Director', 'Grupo Aguirre Inversiones',
   'RADIX entiende el mercado de una manera que pocas firmas locales logran. Su capacidad de análisis y la calidad de los activos que manejan los posiciona en otro nivel. Tercera operación con ellos y la experiencia mejora cada vez.', 5),
  ('Valentina Roca', 'CEO', 'Roca & Partners',
   'Buscábamos una sede en Salta que representara nuestra identidad corporativa. RADIX identificó opciones que nosotros nunca hubiéramos encontrado solos, y acompañó todo el proceso con una precisión extraordinaria.', 5),
  ('Federico Zabaleta', 'Inversor privado', '',
   'Llevo cuatro años invirtiendo en real estate en Salta y Jujuy. Desde que trabajo con RADIX mis retornos mejoraron notablemente. Su conocimiento del mercado regional no tiene comparación.', 5);
