-- ============================================================================
-- Seed data: the two current Venky's products + default site settings.
-- Safe to re-run — uses upsert on the natural unique keys.
-- ============================================================================

insert into public.products (
  slug, name, weight_label, description, short_description,
  price, compare_at_price, stock_status, is_active, is_featured, badge,
  cover_image, gallery_images, sort_order
) values
(
  'red-chilli-powder-500g',
  'Red Chilli Powder',
  '500g',
  'Our signature Red Chilli Powder is made from carefully selected chillies, sun-ripened and stone-ground the traditional way. Every batch is made without pesticides, artificial colours, chemicals or preservatives — just rich colour, authentic aroma and natural heat, the way your grandmother''s kitchen intended. Perfect for everyday curries, marinades and tempering.',
  'Traditional & organic, stone-ground for rich colour and authentic aroma.',
  299, 349, 'in_stock', true, true, 'bestseller',
  '/images/product-500g.jpg',
  array['/images/product-500g.jpg'],
  1
),
(
  'red-chilli-powder-1kg',
  'Red Chilli Powder',
  '1kg',
  'Our signature Red Chilli Powder in a larger 1kg pack — made from carefully selected chillies, sun-ripened and stone-ground the traditional way, without pesticides, artificial colours, chemicals or preservatives. The household favourite for kitchens that cook often and cook properly.',
  'The 1kg pack for kitchens that cook often — same pure, traditional recipe.',
  599, 699, 'in_stock', true, true, 'none',
  '/images/product-1kg.jpg',
  array['/images/product-1kg.jpg'],
  2
)
on conflict (slug) do update set
  name = excluded.name,
  weight_label = excluded.weight_label,
  description = excluded.description,
  short_description = excluded.short_description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  cover_image = excluded.cover_image,
  gallery_images = excluded.gallery_images,
  sort_order = excluded.sort_order;

insert into public.site_settings (
  brand_name, tagline, phone, whatsapp, instagram_url, email, address,
  homepage_headline, homepage_subheadline, footer_note
)
select
  'Venky''s', 'Authentic Organic Spices', '+91 93919 01656', '+91 93919 01656',
  'https://www.instagram.com/venkys__kitchen', 'venkysfoodsofficial@gmail.com',
  'Shanthi Nagar, Hayath Nagar, Hyderabad',
  'Where purity meets tradition',
  'Premium red chilli powder, made from carefully selected chillies for rich colour, authentic aroma and natural taste — without pesticides, artificial colours, chemicals or preservatives.',
  'More premium organic food products are coming soon, as we continue our mission to bring authentic, healthy, trusted food to every kitchen.'
where not exists (select 1 from public.site_settings);

-- ----------------------------------------------------------------------------
-- To make yourself an admin after creating a user in Supabase Auth
-- (Authentication → Users → Add user), run:
--
--   insert into public.admin_users (user_id, full_name)
--   values ('<the user''s UUID from Auth>', 'Your Name');
-- ----------------------------------------------------------------------------
