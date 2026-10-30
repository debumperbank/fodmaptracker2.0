# Fodmap-tracker content export

Articles from the Fodmap-tracker Blog, exported as Markdown for use in the app.
Source: the "Fodmap-tracker Blog" Page (Dutch master), 30 October 2026.

## Structure

```
fodmap-tracker-content/
├── README.md
├── scripts/check_recipes.py   (validation + cross-language check)
└── articles/
    ├── filipijns-koken-zonder-buikpijn-low-fodmap-gids/   (category: gids, Filipijns)
    ├── recept-low-fodmap-lumpia-shanghai/                 (category: recept, Filipijns)
    ├── recept-low-fodmap-pasta-alla-norma/                (category: recept, Italiaans)
    ├── recept-low-fodmap-pizza-verde/                     (category: recept, Italiaans)
    ├── recept-low-fodmap-vlaams-stoofvlees/               (category: recept, Belgisch)
    ├── recept-marokkaanse-kiptajine-citroen-olijven/      (category: recept, Marokkaans)
    ├── recept-regenboogbowl-wortelhummus/                 (category: recept, plantaardig)
    └── wat-is-het-low-fodmap-dieet-3-fasen/               (category: gids)
        (each folder: nl.md  fr.md  de.md  en.md)
```

One folder per article (folder name = `slug`), one file per language (`nl`, `fr` = Belgian French, `de`, `en`).
Dutch (`nl.md`) is the source text; the other languages are translations of it.

## Frontmatter (YAML)

All articles:

| field | type | notes |
|---|---|---|
| `title` | string | localized |
| `slug` | string | Dutch-based kebab-case, identical across languages (use it to link translations) |
| `lang` | string | `nl`, `fr`, `de` or `en` |
| `date` | date | `2026-10-30` |
| `author` | string | localized "Fodmap-tracker redactie" |
| `reading_time_minutes` | int | editorial estimate |
| `summary` | string | 1-2 sentences, localized |
| `tags` | list of strings | Dutch kebab-case keys, identical across languages (localize in the UI if needed) |
| `category` | string | `recept` or `gids` (Dutch keys, identical across languages) |

`image` / `image_alt` are intentionally absent: no real images exist yet. Add them when photos are available.

Recipes only (`category: recept`):

| field | type | notes |
|---|---|---|
| `servings` | int | number of servings the recipe is written for; an estimate only if listed in `estimated_fields` |
| `prep_time` | ISO 8601 duration | e.g. `PT40M`; estimate |
| `cook_time` | ISO 8601 duration | e.g. `PT20M`; estimate |
| `estimated_fields` | list | fields that are editorial estimates, not tested values; show them as approximate |
| `ingredients` | list of ingredient objects | see "Ingredient schema"; same order in every language |
| `steps` | list of step objects | `{title, text}`; same count in every language |
| `fodmap_per_serving` | list of objects | see "FODMAP per serving"; same order in every language |

### Ingredient schema

```yaml
ingredients:
  - name: knoflookolie        # string, localized
    amount: 14                # number, per whole recipe (not per serving)
    unit: g                   # "g" or "ml" only
    note: 1 el                # optional: household measure and/or preparation, localized
    group: Saus               # optional: localized group heading (e.g. dough / sauce / topping)
```

- `amount`, `unit`, whether `note` is present, and the group pattern are **identical in all 4 languages**; only `name`, `note` and `group` text are translated.
- Liquids are in `ml` with grams in the note (`ca. 400 g`). Oils, soy sauce and other condiments are always in `g`.
- Whole items get an approximate weight, e.g. `name: ei, amount: 50, unit: g, note: 1 stuk, ca. 50 g zonder schaal`.
- "Optional" and "to taste" are in `note`; the amount is the suggested quantity.
- Body list line format: `- {amount} {unit} {name} ({note})`, under `### {group}` headings.

### Steps

```yaml
steps:
  - title: Aanbraden
    text: Verhit 28 g knoflookolie (2 el) in een braadpan op middelhoog vuur. ...
```

Every step names heat level/temperature and time where relevant, and quotes gram amounts when only part of an ingredient is used. Every ingredient is used in a step.

### FODMAP per serving

```yaml
fodmap_per_serving:
  - name: Kikkererwten uit blik   # localized
    amount: 42                    # per serving = recipe amount / servings (or a stated cooked weight)
    unit: g
    status: low                   # low | portie-telt | onzeker | vermijden | swap
```

Each entry has exactly these four keys. **There are no numeric low-FODMAP thresholds** in the content: Monash University's terms (app and website) forbid copying or redistributing their data for commercial use, so we only give a qualitative status. `amount` is our own recipe amount per serving, not a threshold. The body shows the same data as a table: ingredient | per serving | status.

Status keys and their labels (use them consistently):

| key | nl | en | fr | de |
|---|---|---|---|---|
| `low` | Low-FODMAP | Low FODMAP | Pauvre en FODMAP | Low-FODMAP |
| `portie-telt` | Portie telt | Portion matters | La portion compte | Portion zählt |
| `onzeker` | Onzeker | Uncertain | Incertain | Unsicher |
| `vermijden` | Vermijden | Avoid | À éviter | Vermeiden |
| `swap` | Swap | Swap | À remplacer | Austauschen |

`low` means the ingredient is low FODMAP in a normal serve according to Monash; readers check the Monash app for the exact serving size. Use `onzeker` when that is not confirmed on a Monash page (e.g. spelt sourdough bread).

### Gram conversion table

Editorial table used for all recipes (metric spoons: 1 el/tbsp = 15 ml, 1 tl/tsp = 5 ml). Values are approximate household densities, not lab measurements; the household measure stays in `note`.

| ingredient | 1 el (15 ml) | 1 tl (5 ml) |
|---|---|---|
| oil (olive, garlic-infused, sunflower), butter | 14 g | — |
| soy sauce / tamari | 16 g | — |
| patis (fish sauce) | — | 6 g |
| water, vinegar, lemon/calamansi juice, stock, beer | 15 ml ≈ 15 g | 5 ml ≈ 5 g |
| tomato paste, tahini, mustard | 15 g | — |
| sugar, brown sugar | 12 g | 4 g |
| salt | — | 6 g (snufje/pinch ≈ 0.5 g) |
| ground spices (cumin, paprika, ras el hanout) | — | 2 g |
| chilli flakes | — | 2 g |
| dried oregano | — | 1 g |
| cornflour (maizena) | — | 3 g |
| sesame seeds | 9 g | — |
| fresh ginger, grated | 6 g | — |

Whole items / handfuls: egg ≈ 50 g (without shell); cinnamon stick ≈ 3 g; bay leaf ≈ 0.25 g; thyme sprig ≈ 0.5 g; small handful fresh herbs ≈ 10 g; lemon ≈ 40 ml juice + 5 g zest; slice spelt sourdough ≈ 35 g; spring onion greens ≈ 5 g each; rice paper 22 cm ≈ 8 g per sheet (varies by brand); dry yeast sachet 7 g; ground black pepper ½ tl ≈ 1 g; 1 l sunflower oil ≈ 920 g; water-based liquids 1 ml ≈ 1 g.
Dry → cooked gluten-free pasta: ≈ ×2 (Fody measured ≈ 700 g cooked from 340 g dry); weigh the cooked pasta if you want to be precise.

## Body

Full article in Markdown: H1 title, a blockquote with the not-medical-advice line, sections, and a Sources list with links.
Uncertain FODMAP information is labelled in the text (e.g. *Onzeker* / *Uncertain*) and must stay that way.
Short local words (Tagalog, Darija, Italian, Flemish) are in italics on purpose (brand voice).
The cuisine is a Dutch tag key (`marokkaans`, `italiaans`, `belgisch`, `filipijns`, `plantaardig`); there is no separate cuisine field. Ingredient groups (e.g. dough / sauce / topping) appear as `###` headings in the body and as the optional `group` field on each ingredient.
All recipes have a "FODMAP check" section with a status per ingredient: Low FODMAP / Portion matters / Uncertain / Avoid / Swap (localized, see the table above). No threshold figures in headings, text or tables.

## Checks

Run `python3 scripts/check_recipes.py` (needs PyYAML) after every edit. It validates the YAML and required fields of all articles, the ingredient/step/fodmap schema of recipes, that the 4 language versions have identical amounts, units, groups, step counts, servings, times and per-serving values and statuses, that no numeric low-FODMAP threshold remains (no `low_fodmap_limit` or other `limit` key in the frontmatter; no sentence outside the ingredient list, method and sources that combines a quantity with threshold wording such as low / Monash / tot / up to / jusqu'à / bis / limit; no Monash-serving column in tables), and that the body has as many ingredient lines and steps as the frontmatter.

## Content rules

- Change an amount in all 4 languages at once, then rerun the check.
- Don't change numbers or remove uncertainty flags or the medical disclaimer when editing.
- Never add numeric low-FODMAP thresholds ('low tot X g', 'Monash: X g', a limit column). Monash data may not be reused; give a qualitative status and point readers to the Monash app.
- Source links (Monash University, FODMAP Everyday, George Eats, ...) stay as further reading; don't copy their numbers.
- `SOURCES-limits.md` is an internal audit (INTERN — niet publiceren) and is not part of the published package.
