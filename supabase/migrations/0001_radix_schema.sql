-- RADIX Web — Initial Schema
-- Run this migration in your Supabase SQL editor

-- =============================================
-- PROPERTIES
-- =============================================
create table if not exists properties (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Identity
  slug          text unique not null,
  title         text not null,
  short_description text,
  description   text,

  -- Classification
  type          text not null check (type in ('venta','alquiler','desarrollo','inversion')),
  category      text not null check (category in ('residencial','comercial','oficina','lote','desarrollo','penthouse')),
  status        text not null default 'disponible'
                  check (status in ('disponible','reservado','vendido','alquilado','en-construccion')),

  -- Pricing
  price         numeric,
  currency      text not null default 'USD' check (currency in ('USD','ARS')),
  price_period  text,   -- null | 'mes' | 'año' (for rentals)

  -- Dimensions
  surface_total   numeric,
  surface_covered numeric,
  bedrooms        integer,
  bathrooms       integer,
  parking_spaces  integer,
  floor           integer,
  total_floors    integer,

  -- Location
  address       text,
  neighborhood  text,
  city          text not null default 'Salta',
  province      text not null default 'Salta',
  lat           numeric,
  lng           numeric,

  -- Media
  cover_image   text,
  images        text[] default '{}',

  -- Metadata
  amenities       text[] default '{}',
  featured        boolean not null default false,
  highlight_label text,   -- 'NUEVO' | 'EXCLUSIVO' | 'PREMIUM' etc.
  published       boolean not null default true,

  -- Relations
  agent_id      uuid
);

-- =============================================
-- AGENTS
-- =============================================
create table if not exists agents (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  role       text,
  photo      text,
  email      text,
  phone      text,
  bio        text
);

-- Add FK after table exists
alter table properties
  add constraint properties_agent_id_fkey
  foreign key (agent_id) references agents(id)
  on delete set null;

-- =============================================
-- TESTIMONIALS
-- =============================================
create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  role       text,
  company    text,
  content    text not null,
  rating     integer not null default 5 check (rating between 1 and 5),
  published  boolean not null default true
);

-- =============================================
-- INQUIRIES
-- =============================================
create table if not exists inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text,
  property_id uuid references properties(id) on delete set null,
  type        text not null default 'contacto'
                check (type in ('contacto','visita','info')),
  status      text not null default 'pendiente'
                check (status in ('pendiente','leido','respondido','archivado'))
);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_properties_updated_at
  before update on properties
  for each row execute function update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table properties   enable row level security;
alter table agents       enable row level security;
alter table testimonials enable row level security;
alter table inquiries    enable row level security;

-- Public can read published content
create policy "Public can view published properties"
  on properties for select
  using (published = true);

create policy "Public can view agents"
  on agents for select
  using (true);

create policy "Public can view published testimonials"
  on testimonials for select
  using (published = true);

-- Anyone can submit an inquiry
create policy "Anyone can create an inquiry"
  on inquiries for insert
  with check (true);

-- =============================================
-- INDEXES
-- =============================================
create index properties_featured_idx on properties (featured) where featured = true;
create index properties_type_idx     on properties (type);
create index properties_city_idx     on properties (city);
create index properties_status_idx   on properties (status);
create index properties_slug_idx     on properties (slug);
create index inquiries_status_idx    on inquiries (status);
