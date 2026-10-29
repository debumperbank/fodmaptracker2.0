-- Bewerkbare maaltijden, vrije klachten, maaltijdkoppeling en privéfoto's.
begin;
alter table public.food_entries add column if not exists photo_path text check (photo_path is null or char_length(photo_path) <= 500);
alter table public.symptom_entries add column if not exists food_entry_id uuid references public.food_entries(id) on delete set null;
alter table public.symptom_entries add column if not exists custom_symptom text check (custom_symptom is null or char_length(custom_symptom) <= 80);
create index if not exists symptom_entries_food_entry_idx on public.symptom_entries(food_entry_id);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('meal-photos','meal-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

create policy "meal_photos_select_own" on storage.objects for select to authenticated using (bucket_id='meal-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "meal_photos_insert_own" on storage.objects for insert to authenticated with check (bucket_id='meal-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "meal_photos_update_own" on storage.objects for update to authenticated using (bucket_id='meal-photos' and (storage.foldername(name))[1]=(select auth.uid())::text) with check (bucket_id='meal-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "meal_photos_delete_own" on storage.objects for delete to authenticated using (bucket_id='meal-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
commit;
