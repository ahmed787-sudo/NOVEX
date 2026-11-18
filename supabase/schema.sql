-- NOVEX database schema
-- Run this file in Supabase SQL Editor after creating a project.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 180),
  description text not null default '',
  category_id text not null,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  stock integer not null default 0 check (stock >= 0),
  image_url text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  notes text not null default '',
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  shipping_fee numeric(12,2) not null default 0 check (shipping_fee >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  payment_method text not null default 'cod' check (payment_method in ('cod')),
  status text not null default 'new' check (status in ('new','confirmed','preparing','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0)
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public visitors can only read active products.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products
for select to anon, authenticated using (is_active = true);

-- Admin access is granted only through trusted app_metadata, never user-editable user_metadata.
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- No direct public access to orders. Order creation will be added through a validated server-side function before checkout is enabled.
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders
for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items
for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- After creating your admin user in Supabase Authentication, run this once,
-- replacing the email with your own login email:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'YOUR-ADMIN-EMAIL';
