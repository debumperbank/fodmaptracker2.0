-- Restore the original brand name without rewriting applied migrations.
update public.curated_recipes
set source_name = 'Fodmap-Tracker',
    attribution_note = replace(attribution_note, 'Tolerio', 'Fodmap-Tracker')
where source_name = 'Tolerio';
