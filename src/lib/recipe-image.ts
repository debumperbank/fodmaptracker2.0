const apostrophes = /['’ʼ`´ʻ]/g;

export function recipeImageSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(apostrophes, "")
    .toLocaleLowerCase("nl-NL")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Mirrors public/recipes/items. A title whose slug is absent (including the
// pasta recipes in migration 0015) must not request a missing file.
export const availableRecipeImageSlugs = [
  "aardappel-spinazie-ontbijtpan",
  "aardbei-yoghurt-bark",
  "aziatische-kip-noedelsalade",
  "aziatische-quinoasalade",
  "chocolade-macadamia-energiebolletjes",
  "citroen-kruidenkip-met-geroosterde-groenten",
  "citroenzalm-met-makrutlimoen",
  "frisse-tonijn-aardappelsalade",
  "gember-sesam-tofubowl",
  "groene-kiwi-spinaziesmoothie",
  "hartige-paprika-fetamuffins",
  "havermout-banaanpannenkoeken",
  "kabeljauw-met-romige-polenta-en-spinazie",
  "kiwi-blauwebes-overnight-oats",
  "krokante-quinoa-kipsalade",
  "kruidige-wortelfritters",
  "maple-granola-met-yoghurt",
  "milde-kip-madras-met-rijst",
  "ontbijttortillas",
  "overnight-oats-met-pindakaas-en-banaan",
  "paprika-kip-traybake",
  "pompoen-wortelsoep",
  "quinoa-koolsalade-met-pepitas",
  "quinoabowl-met-geroosterde-groente-en-ei",
  "quinoapap-met-banaan-en-yoghurt",
  "rode-paprikahummus",
  "roertofu-met-wortel-en-courgette",
  "romige-pasta-met-gerookte-zalm",
  "romige-pompoen-saliegnocchi",
  "snelle-chocolade-mugcake",
  "snelle-zalm-aardappelgratin",
  "spinazie-feta-omelet",
  "thaise-groene-kipcurry",
  "vegan-chocolade-chiapudding",
  "warme-kip-groenteschotel-met-maple-mosterd",
  "worteltaartpap",
  "zalm-met-dikke-aardappelparten",
  "zalm-ricottafrittata",
  "zalmpokebowl",
  "zoete-aardappel-fetafrittata",
] as const;

const availableRecipeImages = new Set<string>(availableRecipeImageSlugs);

export function recipeImagePath(title: string): string | null {
  const slug = recipeImageSlug(title);
  if (!availableRecipeImages.has(slug)) return null;
  return `/recipes/items/${slug}.webp`;
}
