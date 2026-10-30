-- New uploads are normalized by the app to an 800x800 maximum WebP image.
-- Existing JPG/PNG objects remain readable; these restrictions apply to new uploads.
update storage.buckets
set file_size_limit = 1048576,
    allowed_mime_types = array['image/webp']
where id in ('meal-photos', 'profile-photos');
