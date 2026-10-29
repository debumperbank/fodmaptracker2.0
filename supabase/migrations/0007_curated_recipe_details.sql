-- Volledige, oorspronkelijk geformuleerde bronadaptaties voor de receptenbibliotheek.
begin;

alter table public.curated_recipes
  add column if not exists servings smallint not null default 2 check (servings between 1 and 24),
  add column if not exists preparation_minutes smallint check (preparation_minutes is null or preparation_minutes between 1 and 1440),
  add column if not exists ingredients text not null default '',
  add column if not exists instructions text not null default '',
  add column if not exists attribution_note text not null default 'Vrije Nederlandstalige adaptatie; controleer porties en details bij de oorspronkelijke bron.';

insert into public.curated_recipes
  (title,summary,category,source_name,source_url,suitable_for_elimination,servings,preparation_minutes,ingredients,instructions,attribution_note,published)
values
  ('Havermout-banaanpannenkoeken','Zachte pannenkoeken op basis van haver, rijstmeel en stevige banaan.','ontbijt','Monash FODMAP','https://www.monashfodmap.com/recipe/oat-and-banana-pancakes/',true,6,40,
   E'100 g havermout\n40 g haverzemelen\n100 g rijstmeel\n2 eieren\n150 g stevige, niet overrijpe banaan\n200 ml lactosevrije melk\n2 tl bakpoeder\n¾ tl kaneel\nSnuf zout\nNeutrale olie om te bakken',
   E'1. Maal de havermout kort tot een grof meel.\n2. Meng haver, zemelen, rijstmeel, bakpoeder, kaneel en zout.\n3. Prak de banaan en klop deze met eieren en melk los.\n4. Roer nat en droog samen tot een dik beslag; voeg zo nodig een klein scheutje melk toe.\n5. Bak kleine pannenkoeken in een licht ingevette pan op middelhoog vuur. Keer wanneer de bovenkant belletjes toont.\n6. Verdeel het beslag over zes porties en kies toppings binnen je persoonlijke tolerantie.',
   'Vrije Nederlandstalige adaptatie van het Monash-recept. Controleer vooral banaanrijpheid, portie en toppings bij de bron.',true),

  ('Ontbijttortilla’s','Maïstortilla’s met ei, tomaat, kaas en lactosevrije yoghurt.','ontbijt','Monash FODMAP','https://monashfodmap.com/recipe/breakfast-tortillas/',true,4,15,
   E'4 maïstortilla’s zonder tarwe\n4 eieren\n160 g geraspte mozzarella\n120 g lactosevrije yoghurt\n130 g tomaat, in blokjes\n40 g macadamia-dukkah of een kleine portie gehakte noten en zaden\nPeterselie of koriander\nPeper en zout',
   E'1. Kook de eieren ongeveer 6 minuten, koel ze direct en pel ze.\n2. Verwarm elke tortilla kort aan beide kanten in een droge pan en houd afgedekt warm.\n3. Bestrijk de tortilla’s met yoghurt en verdeel mozzarella en tomaat erover.\n4. Halveer de eieren en leg ze op de tortilla’s.\n5. Werk af met dukkah, verse kruiden, peper en zout en vouw direct dicht.',
   'Vrije Nederlandstalige adaptatie van Monash. Gebruik tortilla’s die daadwerkelijk van maïs en niet van tarwe zijn gemaakt.',true),

  ('Worteltaartpap','Warme havermout met wortel, kaneel, zaden en walnoten.','ontbijt','Monash FODMAP','https://www.monashfodmap.com/recipe/carrot-cake-porridge/',true,4,25,
   E'120 g havermout\n750 ml water\n150 g geraspte wortel\n1 tl kaneel\n15 g gemalen lijnzaad\n30 g walnoten\n40 g gedroogde cranberries of rozijnen, verdeeld over vier porties\n125 ml lactosevrije melk\n40 g hennepzaad, optioneel\nAhornsiroop naar smaak',
   E'1. Breng havermout en water al roerend rustig aan de kook.\n2. Voeg wortel en kaneel toe en laat zacht koken tot de pap romig is.\n3. Haal de pan van het vuur en roer lijnzaad, fijngehakte walnoten en gedroogd fruit erdoor.\n4. Verdeel over vier kommen. Voeg per kom melk, eventueel hennepzaad en een klein beetje ahornsiroop toe.',
   'Vrije Nederlandstalige adaptatie van Monash. Houd de aangegeven hoeveelheid gedroogd fruit per portie aan.',true),

  ('Quinoapap met banaan en yoghurt','Glutenvrij ontbijt met quinoa, lactosevrije zuivel en banaan.','ontbijt','Monash FODMAP','https://monashfodmap.com/recipe/quinoa-porridge-banana-yoghurt/',true,1,15,
   E'50 g quinoavlokken\n125 ml water\n250 ml lactosevrije melk, verdeeld\n35 g banaan\n50 g lactosevrije yoghurt\n1 tl ahornsiroop\nKaneel, optioneel',
   E'1. Breng het water met de helft van de melk aan de kook.\n2. Strooi de quinoavlokken erbij en laat op laag vuur ongeveer 5 minuten indikken.\n3. Snijd ondertussen de banaan.\n4. Schep de pap in een kom en voeg de rest van de melk toe.\n5. Garneer met yoghurt, banaan, ahornsiroop en eventueel kaneel.',
   'Vrije Nederlandstalige adaptatie van Monash. De toegestane hoeveelheid banaan verschilt met de rijpheid.',true),

  ('Spinazie-feta-omelet','Snelle omelet met spinazie, feta en pijnboompitten.','lunch','Monash FODMAP','https://www.monashfodmap.com/recipe/spinach-feta-pinenut-omelette/',true,1,10,
   E'2 grote eieren\n20 ml lactosevrije melk\n38 g babyspinazie\n34 g verkruimelde feta\n10 g geroosterde pijnboompitten\n1 tl boter of olie\nPeper',
   E'1. Laat de spinazie in een pan slinken en verwarm de feta kort mee. Schep uit de pan.\n2. Klop eieren, melk en peper los.\n3. Verhit boter of olie en giet het eimengsel in de pan.\n4. Laat op matig vuur stollen en beweeg de nog vloeibare bovenkant voorzichtig naar de randen.\n5. Verdeel spinazie, feta en pijnboompitten over één helft en vouw de omelet dicht.',
   'Vrije Nederlandstalige adaptatie van Monash.',true),

  ('Citroenzalm met makrutlimoen','Ovenzalm met frisse citrus, citroengras en koriander.','avondeten','Monash FODMAP','https://www.monashfodmap.com/recipe/makrut-lime-lemon-salmon/',true,4,35,
   E'750 g zalmfilet\n½ citroen, dun gesneden\n1 makrutlimoenblad, gescheurd\n½ stengel citroengras, gekneusd\n8 g verse koriander\nPeper en zout',
   E'1. Verwarm de oven voor op 180 °C. Leg een ruim vel bakpapier en folie op een bakplaat.\n2. Leg de zalm erop en verdeel citroen, makrutlimoenblad, citroengras en koriander over de vis.\n3. Vouw het pakket goed dicht zodat stoom binnenblijft.\n4. Gaar ongeveer 25–30 minuten, afhankelijk van de dikte en gewenste gaarheid.\n5. Open voorzichtig en verwijder het citroengras en limoenblad voor het serveren.',
   'Vrije Nederlandstalige adaptatie van Monash.',true),

  ('Zalmpokébowl','Rijstbowl met gemarineerde zalm, komkommer, radijs en rodekool.','avondeten','Monash FODMAP','https://www.monashfodmap.com/recipe/salmon-poke-bowl/',true,4,70,
   E'325 g sushi- of witte rijst\n300 g sashimi-kwaliteit zalm, in blokjes\n60 ml rijstazijn\n65 ml sojasaus\n2 tl suiker\n2 tl ahornsiroop\n1 tl wasabipoeder\n80 g radijs\n175 g komkommer\n95 g rodekool\n11 g sesamzaad',
   E'1. Kook de rijst volgens de verpakking. Meng de suiker met de helft van de rijstazijn en schep dit door de nog warme rijst. Laat afkoelen.\n2. Meng sojasaus, wasabi, ahornsiroop en de resterende azijn.\n3. Schep de zalm voorzichtig door de marinade en zet minimaal 15 minuten gekoeld weg.\n4. Verdeel de rijst over vier kommen.\n5. Voeg zalm, dun gesneden radijs, komkommer en rodekool toe en bestrooi met sesam.',
   'Vrije Nederlandstalige adaptatie van Monash. Gebruik uitsluitend zalm die geschikt is om rauw te eten en houd hem gekoeld.',true),

  ('Roertofu met wortel en courgette','Hartige tofucrumble die ook als snel ontbijt werkt.','lunch','Monash FODMAP','https://www.monashfodmap.com/recipe/scrambled-tofu/',true,1,10,
   E'100 g stevige tofu\n75 g wortel en courgette, fijn gesneden\n60 ml water\n1 tl sojasaus\n¼ tl kurkuma\n1 tl bakolie',
   E'1. Meng water, sojasaus en kurkuma in een kom.\n2. Verkruimel de tofu erboven en voeg de groenten toe. Schep om.\n3. Verhit olie in een kleine koekenpan.\n4. Bak het mengsel ongeveer 5 minuten en roer regelmatig, tot het vocht grotendeels verdwenen is en de tofu licht kleurt.\n5. Serveer met een passende portie rijst of brood dat je goed verdraagt.',
   'Vrije Nederlandstalige adaptatie van Monash. Kies stevige tofu; de FODMAP-beoordeling verschilt per tofusoort.',true),

  ('Snelle zalm-aardappelgratin','Kleine ovenschotel met aardappel, zalm en mozzarella.','avondeten','Monash FODMAP','https://www.monashfodmap.com/recipe/easy-salmon-and-potato-gratin/',true,2,25,
   E'200 g geschilde witte aardappel\n90 g uitgelekte zalm uit blik\n32 g maïsroom uit blik\n24 g Japanse mayonaise\n15 ml amandelmelk\n1 tl grove dijonmosterd\n½ tl gedroogde oregano\n30 g geraspte mozzarella\nOlie, peper en zout',
   E'1. Verwarm de oven voor op 180 °C en vet een kleine ovenschaal in.\n2. Snijd de aardappel in zeer dunne halve plakjes.\n3. Meng zalm, maïsroom, mayonaise, amandelmelk, mosterd en oregano.\n4. Schep de aardappelplakjes erdoor tot alles bedekt is en verdeel over de schaal.\n5. Strooi mozzarella erover en bak ongeveer 15 minuten; controleer met een vork of de aardappel gaar is. Geef zo nodig extra oventijd.',
   'Vrije Nederlandstalige adaptatie van Monash. Oventijd hangt sterk af van de dikte van de aardappelplakjes.',true),

  ('Romige pasta met gerookte zalm','Glutenvrije pasta met spinazie, limoen, dille en gerookte zalm.','avondeten','Monash FODMAP','https://www.monashfodmap.com/recipe/creamy-pasta-smoked-salmon-lime-dill/',true,4,35,
   E'350 g glutenvrije pasta\n18 ml knoflook-geïnfuseerde olijfolie\n150 g oesterzwammen, dun gesneden\nRasp en sap van 1 limoen\n250 g gerookte zalm\n200 g babyspinazie\n250 ml low-FODMAP kippenbouillon\n10 g maïzena\n250 ml lactosevrije volle melk\n16 g verse dille\nPecorino naar smaak',
   E'1. Kook de pasta beetgaar en bewaar een beetje kookwater.\n2. Bak de oesterzwammen in de geïnfuseerde olie tot ze kleuren.\n3. Voeg bouillon, limoenrasp en -sap toe en laat kort inkoken.\n4. Roer maïzena glad met de melk en voeg al roerend toe. Laat zacht binden.\n5. Schep spinazie, pasta en gerookte zalm door de saus en verwarm kort zonder hard te koken.\n6. Werk af met dille en een kleine hoeveelheid pecorino.',
   'Vrije Nederlandstalige adaptatie van Monash. Controleer bouillon, pasta en porties op passende ingrediënten.',true)
on conflict (title) do update set
  source_url=excluded.source_url,
  title=excluded.title,summary=excluded.summary,category=excluded.category,source_name=excluded.source_name,
  suitable_for_elimination=excluded.suitable_for_elimination,servings=excluded.servings,
  preparation_minutes=excluded.preparation_minutes,ingredients=excluded.ingredients,
  instructions=excluded.instructions,attribution_note=excluded.attribution_note,published=true;

commit;
