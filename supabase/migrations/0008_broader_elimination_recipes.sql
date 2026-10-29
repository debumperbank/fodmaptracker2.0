-- Een bredere, controleerbare receptenbibliotheek met fase-informatie per recept.
begin;

alter table public.curated_recipes
  add column if not exists phase_note text not null default
    'Low-FODMAP is portieafhankelijk. Controleer ingrediënten en hoeveelheden bij de bron en pas ze aan je persoonlijke tolerantie aan.';

-- Eén bronpagina kan meerdere recepten bevatten (bijvoorbeeld een ziekenhuisartikel).
alter table public.curated_recipes drop constraint if exists curated_recipes_source_url_key;
create index if not exists curated_recipes_source_url_idx on public.curated_recipes(source_url);

insert into public.curated_recipes
  (title,summary,category,source_name,source_url,suitable_for_elimination,servings,preparation_minutes,ingredients,instructions,attribution_note,phase_note,published)
values
  ('Overnight oats met pindakaas en banaan','Koelkastontbijt met haver, chia, pindakaas en een afgemeten portie banaan.','ontbijt','Michigan Medicine','https://www.michiganmedicine.org/health-lab/low-fodmap-diet-recipes',true,1,5,
   E'45 g havermout\n125 ml ongezoete amandelmelk\n1 tl chiazaad\n½ stevige, niet overrijpe banaan\n1 el pindakaas zonder toevoegingen\n¼ tl kaneel',
   E'1. Doe havermout, amandelmelk, chiazaad, pindakaas en kaneel in een afsluitbaar bakje.\n2. Roer tot de pindakaas goed verdeeld is.\n3. Dek af en zet minimaal 6 uur in de koelkast.\n4. Snijd de stevige banaan vlak voor het eten en schep deze door de haver.\n5. Eet koud of verwarm kort; voeg alleen extra melk toe als de pap te dik is.',
   'Vrije Nederlandstalige adaptatie van een recept van Michigan Medicine. Ingrediënten en werkwijze zijn opnieuw geformuleerd.',
   'Door Michigan Medicine gepubliceerd om met een low-FODMAP-dieet te starten. Gebruik een stevige banaan en houd één portie aan.',true),

  ('Quinoa-koolsalade met pepita’s','Knapperige lunchsalade met quinoa, boerenkool, rodekool, wortel en pompoenpitten.','lunch','Michigan Medicine','https://www.michiganmedicine.org/health-lab/low-fodmap-diet-recipes',true,2,25,
   E'90 g ongekookte quinoa\n70 g boerenkool, zonder harde nerven\n60 g fijngesneden rodekool\n60 g geraspte wortel\n80 g kerstomaten, in vieren\n20 g pompoenpitten\n2 el olijfolie\n1½ el citroensap\n¼ tl gemalen komijn\nPeper en zout',
   E'1. Spoel de quinoa goed en kook volgens de verpakking. Laat volledig afkoelen.\n2. Rooster de pompoenpitten kort in een droge pan met komijn en een snuf zout.\n3. Snijd de boerenkool fijn en masseer deze één minuut met de helft van de olie en een beetje citroensap.\n4. Voeg quinoa, rodekool, wortel en tomaat toe.\n5. Meng de resterende olie met het citroensap, peper en zout en schep door de salade.\n6. Verdeel over twee kommen en strooi de pepita’s er vlak voor het eten over.',
   'Vrije Nederlandstalige adaptatie van de Superfood Salad van Michigan Medicine; de tekst en opbouw zijn eigen formuleringen.',
   'De bron gebruikt uitsluitend door Michigan Medicine geselecteerde low-FODMAP-ingrediënten. Houd de verdeling over twee porties aan.',true),

  ('Paprika-kip traybake','Ovenschotel met kippenpoten, aardappel, wortel, broccoli en tomaat.','avondeten','A Little Bit Yummy','https://alittlebityummy.com/recipe/en-us/low-fodmap-yummy-paprika-chicken-traybake/',true,4,65,
   E'8 kippenonderbouten\n4 middelgrote aardappelen, in kleine stukken\n2 wortelen, in stukken\nBroccoliroosjes voor 4 porties (maximaal ca. ¾ cup per persoon)\n3 kleine trostomaten\n3 el tomatenpuree\n2 el knoflook-geïnfuseerde olie, zonder stukjes knoflook\n1½ el water\n1½ tl gerookt paprikapoeder\n2 el olijfolie\n½ tl gedroogde oregano\nPeper en zout',
   E'1. Verwarm de oven voor op 200 °C en bekleed een grote bakplaat.\n2. Roer tomatenpuree, knoflookolie, water en paprikapoeder glad. Bestrijk de kip hiermee en kruid met peper en zout.\n3. Schep aardappel en wortel om met olijfolie, oregano, peper en zout en verdeel ze met de kip over de plaat.\n4. Rooster 30 minuten. Keer de kip en groenten om.\n5. Voeg broccoli en hele tomaten toe en rooster nog 20–25 minuten, tot de kip volledig gaar is en de groenten kleuren.\n6. Verdeel de volledige plaat over vier porties.',
   'Vrije Nederlandstalige adaptatie van Alana Scott; het bronrecept is beoordeeld door diëtist Joanna Baker (APD) en Monash Low FODMAP Certified.',
   'Volgens de bron geschikt binnen het low-FODMAP-dieet wanneer het gerecht in vier porties wordt verdeeld. Let vooral op de hoeveelheid broccoli.',true),

  ('Warme kip-groenteschotel met maple-mosterd','Comfortfood met kippendij, wortelgroenten, groene prei en een milde saus.','avondeten','A Little Bit Yummy','https://alittlebityummy.com/recipe/en-gb/low-fodmap-cozy-chicken-casserole-2/',true,4,65,
   E'600 g kippendijfilet, zonder vel\n2 pastinaken\n2½ wortelen\nCa. 300 g zoete aardappel of kabocha-pompoen\n80 g uitsluitend donkergroen preiblad, fijngesneden\n3 flinke handen spinazie\n1½ el knoflook-geïnfuseerde olie, zonder stukjes\n2 el olijfolie\n3 el glutenvrije bloem zonder peulvruchtenmeel\n375 ml bouillon zonder ui of knoflook\n1 el dijonmosterd zonder ui of knoflook\n1 el pure ahornsiroop\n½ tl tijm\nPeper en zout',
   E'1. Verwarm de oven voor op 180 °C en vet een ruime ovenschaal in.\n2. Snijd pastinaak, wortel en zoete aardappel of pompoen klein. Meng ze met knoflookolie, bloem, peper en zout.\n3. Leg de groenten in de schaal. Meng bouillon, mosterd en ahornsiroop en giet erover. Bak alvast 30 minuten.\n4. Schroei intussen de kippendijen in olijfolie aan beide kanten aan. Voeg het groene preiblad op het einde kort toe.\n5. Leg kip en prei op de groenten, strooi tijm erover en bak 10 minuten.\n6. Voeg grofgesneden spinazie toe en bak nog 10–15 minuten, tot kip en groenten gaar zijn. Verdeel in vier gelijke porties.',
   'Vrije Nederlandstalige adaptatie van Alana Scott; het bronrecept is beoordeeld door diëtist Anna Sloan (RD).',
   'De bron geeft dit als low-FODMAP-recept voor vier personen. Gebruik alleen groen preiblad en bouillon zonder ui of knoflook.',true),

  ('Hartige paprika-fetamuffins','Voorbereidbare hartige muffins met maïs- en tapiocameel, basilicum en feta.','tussendoor','Monash FODMAP','https://www.monashfodmap.com/recipe/savoury-muffin/',true,12,30,
   E'180 g tapiocameel\n230 g maïsmeel\n14 g bakpoeder\n3 g xanthaangom\n80 g haverzemelen\n3 eieren\n190 ml room\n190 ml lactosevrije halfvolle melk\n140 g verkruimelde feta\n150 g rode paprika, fijn gesneden\n20 g verse basilicum, grof gesneden\n36 g geraspte kaas\nPaprikapoeder\nNeutrale olie voor de vorm',
   E'1. Verwarm de oven voor op 160 °C en vet twaalf muffinvormen goed in.\n2. Meng tapioca- en maïsmeel met bakpoeder, xanthaangom en haverzemelen.\n3. Klop in een tweede kom eieren, room en melk los. Roer feta, paprika en basilicum erdoor.\n4. Spatel het natte mengsel kort door het droge; het beslag mag dik maar schepbaar zijn.\n5. Verdeel over twaalf vormen, bestrooi met kaas en een beetje paprikapoeder.\n6. Bak ongeveer 17–20 minuten. Laat vijf minuten in de vorm rusten en koel daarna op een rooster.',
   'Vrije Nederlandstalige adaptatie van het Monash FODMAP-recept. Volg de bron voor actuele porties en variaties.',
   'Monash presenteert dit als low-FODMAP-recept. Eén muffin is één portie; grotere hoeveelheden kunnen de totale FODMAP-belasting verhogen.',true),

  ('Chocolade-macadamia energiebolletjes','No-bake snack met macadamia, cranberry, cacao en pure chocolade.','tussendoor','Monash FODMAP','https://monashfodmap.com/documents/88/Monash_FODMAP_-_Low_FODMAP_Double_Chocolate_Bliss_Balls_Recipe.pdf',true,18,25,
   E'154 g droge, ongezouten geroosterde macadamianoten\n77 g gedroogde cranberries, gezoet met suiker en niet met appelsap\n27 g teffzaad of chiazaad\n77 g pure ahornsiroop\n23 g cacaopoeder\n¾ tl vanille-extract\n40 g fijngehakte pure chocolade\nSnuf zout\nExtra chia, kokos of cacao voor de buitenkant, optioneel',
   E'1. Rooster teff- of chiazaad kort in een droge pan en laat afkoelen.\n2. Hak de macadamia’s grof. Maal ze met cranberries, ahornsiroop, cacao, vanille en zout tot een plakkerig kruim; maal niet tot notenpasta.\n3. Schep de gehakte chocolade en het geroosterde zaad erdoor.\n4. Verdeel het mengsel in achttien gelijke delen en rol er bolletjes van.\n5. Rol ze eventueel door cacao, chia of een kleine hoeveelheid kokos en bewaar gekoeld.',
   'Vrije Nederlandstalige adaptatie van het officiële Monash FODMAP-recept; bereidingsstappen zijn opnieuw geformuleerd.',
   'Monash geeft achttien porties op. Houd één bolletje als portie aan en controleer de ingrediënten van cranberry en chocolade.',true)
on conflict (title) do update set
  summary=excluded.summary,category=excluded.category,source_name=excluded.source_name,
  source_url=excluded.source_url,suitable_for_elimination=excluded.suitable_for_elimination,
  servings=excluded.servings,preparation_minutes=excluded.preparation_minutes,
  ingredients=excluded.ingredients,instructions=excluded.instructions,
  attribution_note=excluded.attribution_note,phase_note=excluded.phase_note,published=true;

commit;
