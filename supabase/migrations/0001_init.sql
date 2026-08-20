-- ============================================================================
-- Venky's — Authentic Organic Spices
-- Initial schema: tables, RLS policies, triggers, and RPC functions.
-- Run this in the Supabase SQL editor, or via `supabase db push`.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  weight_label text not null,
  description text not null default '',
  short_description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2),
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'out_of_stock', 'low_stock')),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  badge text not null default 'none'
    check (badge in ('none', 'bestseller', 'new', 'limited')),
  cover_image text not null default '',
  gallery_images text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Catalog of sellable products, editable from the admin dashboard.';

-- ----------------------------------------------------------------------------
-- ORDERS + ORDER ITEMS
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null default '',
  address_line1 text not null,
  address_line2 text not null default '',
  landmark text not null default '',
  city text not null,
  state text not null,
  pincode text not null,
  notes text not null default '',
  status text not null default 'new'
    check (status in ('new','confirmed','processing','packed','shipped','delivered','cancelled')),
  subtotal numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_weight_label text not null,
  unit_price numeric(10, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- Daily sequence counter used to build VK-YYYYMMDD-NNNN order numbers.
create table if not exists public.order_number_counters (
  day_key text primary key,
  last_seq int not null default 0
);

-- ----------------------------------------------------------------------------
-- OFFERS / BANNERS
-- ----------------------------------------------------------------------------
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  desktop_image text not null default '',
  mobile_image text not null default '',
  cta_label text not null default 'Shop now',
  cta_url text not null default '/shop',
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- SITE SETTINGS (single row)
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'Venky''s',
  tagline text not null default 'Authentic Organic Spices',
  phone text not null default '+91 93919 01656',
  whatsapp text not null default '+91 93919 01656',
  instagram_url text not null default 'https://www.instagram.com/venkys__kitchen',
  email text not null default 'venkysfoodsofficial@gmail.com',
  address text not null default 'Shanthi Nagar, Hayath Nagar, Hyderabad',
  homepage_headline text not null default 'Where purity meets tradition',
  homepage_subheadline text not null default '',
  footer_note text not null default 'More premium organic food products are coming soon.',
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ADMIN USERS — maps Supabase Auth users to admin privileges.
-- A user must have a row here (created manually by you after they sign up
-- via Supabase Auth) to pass the RLS checks below.
-- ----------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated_at on public.site_settings;
create trigger trg_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.offers enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.order_number_counters enable row level security;

-- PRODUCTS: public can read active products; only admins can write.
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (is_active = true or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- OFFERS: public can read active offers; only admins can write / see inactive ones.
drop policy if exists "offers_public_read" on public.offers;
create policy "offers_public_read" on public.offers
  for select using (is_active = true or public.is_admin());

drop policy if exists "offers_admin_write" on public.offers;
create policy "offers_admin_write" on public.offers
  for all using (public.is_admin()) with check (public.is_admin());

-- SITE SETTINGS: public can read; only admins can write.
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ORDERS: customers cannot read/list orders at all (no public select policy).
-- Inserts happen only via the SECURITY DEFINER create_order() function below,
-- never via a direct table insert from the client. Admins get full access.
drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- ADMIN_USERS: only admins can see the admin list; no client writes at all
-- (add admins via the Supabase SQL editor / dashboard for safety).
drop policy if exists "admin_users_admin_read" on public.admin_users;
create policy "admin_users_admin_read" on public.admin_users
  for select using (public.is_admin());

-- ORDER NUMBER COUNTERS: never exposed to the client directly; only touched
-- inside the SECURITY DEFINER create_order() function.
drop policy if exists "order_counters_admin_read" on public.order_number_counters;
create policy "order_counters_admin_read" on public.order_number_counters
  for select using (public.is_admin());

-- ============================================================================
-- RPC: create_order
-- Atomically re-prices items from the products table, allocates a
-- collision-free order number for the day, and inserts the order + items.
-- Runs as SECURITY DEFINER so anonymous customers can place an order
-- without ever getting direct INSERT rights on public.orders.
-- ============================================================================
create or replace function public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_address_line1 text,
  p_address_line2 text,
  p_landmark text,
  p_city text,
  p_state text,
  p_pincode text,
  p_notes text,
  p_items jsonb
)
returns table (order_id uuid, order_number text, total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day_key text := to_char(now(), 'YYYYMMDD');
  v_seq int;
  v_order_number text;
  v_order_id uuid;
  v_subtotal numeric(10,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
  v_line_total numeric(10,2);
begin
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'Customer name is required';
  end if;
  if p_customer_phone is null or length(trim(p_customer_phone)) < 10 then
    raise exception 'A valid mobile number is required';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Cannot place an order with no items';
  end if;

  -- Allocate the next sequence number for today, atomically.
  insert into public.order_number_counters (day_key, last_seq)
  values (v_day_key, 1)
  on conflict (day_key)
  do update set last_seq = public.order_number_counters.last_seq + 1
  returning last_seq into v_seq;

  v_order_number := 'VK-' || v_day_key || '-' || lpad(v_seq::text, 4, '0');

  insert into public.orders (
    order_number, customer_name, customer_phone, customer_email,
    address_line1, address_line2, landmark, city, state, pincode, notes,
    status, subtotal, total
  ) values (
    v_order_number, p_customer_name, p_customer_phone, coalesce(p_customer_email, ''),
    p_address_line1, coalesce(p_address_line2, ''), coalesce(p_landmark, ''),
    p_city, p_state, p_pincode, coalesce(p_notes, ''),
    'new', 0, 0
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
      and is_active = true;

    if not found then
      raise exception 'One of the items in your bag is no longer available';
    end if;

    v_qty := greatest(1, (v_item->>'quantity')::int);
    v_line_total := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_line_total;

    insert into public.order_items (
      order_id, product_id, product_name, product_weight_label,
      unit_price, quantity, line_total
    ) values (
      v_order_id, v_product.id, v_product.name, v_product.weight_label,
      v_product.price, v_qty, v_line_total
    );
  end loop;

  update public.orders
  set subtotal = v_subtotal, total = v_subtotal
  where id = v_order_id;

  return query select v_order_id, v_order_number, v_subtotal;
end;
$$;

-- Allow both anonymous and logged-in clients to call the RPC (it performs
-- its own validation and never trusts client-supplied prices).
grant execute on function public.create_order(
  text, text, text, text, text, text, text, text, text, text, jsonb
) to anon, authenticated;
