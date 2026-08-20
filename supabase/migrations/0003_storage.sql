-- ============================================================================
-- Supabase Storage: public buckets for product and offer images.
-- Run after 0001_init.sql. Safe to re-run.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('offer-images', 'offer-images', true)
on conflict (id) do nothing;

-- Public read for both buckets.
drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "offer_images_public_read" on storage.objects;
create policy "offer_images_public_read" on storage.objects
  for select using (bucket_id = 'offer-images');

-- Only admins can upload/update/delete.
drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "offer_images_admin_write" on storage.objects;
create policy "offer_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'offer-images' and public.is_admin());
drop policy if exists "offer_images_admin_update" on storage.objects;
create policy "offer_images_admin_update" on storage.objects
  for update using (bucket_id = 'offer-images' and public.is_admin());
drop policy if exists "offer_images_admin_delete" on storage.objects;
create policy "offer_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'offer-images' and public.is_admin());
