-- Rebrand curated content without rewriting previously applied migrations.
update public.curated_recipes
set source_name = 'Tolerio',
    attribution_note = replace(replace(attribution_note, 'Fodmap Tracker', 'Tolerio'), 'Fodmap-Tracker', 'Tolerio')
where source_name in ('Fodmap Tracker', 'Fodmap-Tracker');
