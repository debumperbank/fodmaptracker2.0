import type { AppLanguage } from "@/lib/i18n";

export const fodmapStatusLabels: Record<AppLanguage, Record<"low" | "portie-telt" | "onzeker" | "vermijden" | "swap", string>> = {
  nl: { low: "Low-FODMAP", "portie-telt": "Portie telt", onzeker: "Onzeker", vermijden: "Vermijden", swap: "Swap" },
  en: { low: "Low FODMAP", "portie-telt": "Portion matters", onzeker: "Uncertain", vermijden: "Avoid", swap: "Swap" },
  fr: { low: "Pauvre en FODMAP", "portie-telt": "La portion compte", onzeker: "Incertain", vermijden: "À éviter", swap: "À remplacer" },
  de: { low: "Low-FODMAP", "portie-telt": "Portion zählt", onzeker: "Unsicher", vermijden: "Vermeiden", swap: "Austauschen" },
};

export const articleCopy: Record<AppLanguage, {
  articles: string;
  signup: string;
  latestEyebrow: string;
  latestTitle: string;
  latestBody: string;
  allArticles: string;
  overviewTitle: string;
  overviewBody: string;
  category: string;
  allCategories: string;
  tag: string;
  allTags: string;
  apply: string;
  clear: string;
  empty: string;
  guides: string;
  recipes: string;
  minutes: string;
  servings: string;
  prep: string;
  cook: string;
  approximate: string;
  ingredients: string;
  steps: string;
  fodmap: string;
  fodmapNote: string;
  disclaimer: string;
  trackTitle: string;
  trackBody: string;
  languages: string;
  back: string;
  placeholderLabel: string;
}> = {
  nl: {
    articles: "Artikelen en recepten",
    signup: "Maak een account aan",
    latestEyebrow: "Lezen",
    latestTitle: "Gidsen en recepten",
    latestBody: "Korte stukken om te begrijpen hoe het low-FODMAP dieet werkt, en recepten die je daarna in je dagboek kunt bijhouden.",
    allArticles: "Alle artikelen",
    overviewTitle: "Artikelen en recepten",
    overviewBody: "Gidsen en recepten in het Nederlands. Kies een categorie of een trefwoord.",
    category: "Categorie",
    allCategories: "Alles",
    tag: "Trefwoord",
    allTags: "Alle trefwoorden",
    apply: "Filter",
    clear: "Filters wissen",
    empty: "Geen artikelen met deze filters.",
    guides: "Gids",
    recipes: "Recept",
    minutes: "min lezen",
    servings: "porties",
    prep: "voorbereiden",
    cook: "bereiden",
    approximate: "ongeveer",
    ingredients: "Ingrediënten",
    steps: "Bereiding",
    fodmap: "FODMAP-status per ingrediënt",
    fodmapNote: "Alleen een kwalitatieve status. Voor de actuele portiegrootte gebruik je de Monash-app. Hier staan geen cijfermatige drempels.",
    disclaimer: "Dit is algemene informatie en geen persoonlijk medisch advies. Heb je darmklachten, overleg dan met je huisarts of een FODMAP-getrainde diëtist.",
    trackTitle: "Houd bij wat je eet",
    trackBody: "Bewaar maaltijden en klachten in je eigen dagboek en neem het overzicht mee naar je diëtist.",
    languages: "Taal",
    back: "Alle artikelen",
    placeholderLabel: "Nog geen foto",
  },
  en: {
    articles: "Articles and recipes",
    signup: "Create an account",
    latestEyebrow: "Read",
    latestTitle: "Guides and recipes",
    latestBody: "Short pieces on how the low-FODMAP diet works, and recipes you can log in your diary afterwards.",
    allArticles: "All articles",
    overviewTitle: "Articles and recipes",
    overviewBody: "Guides and recipes in English. Filter by category or tag.",
    category: "Category",
    allCategories: "All",
    tag: "Tag",
    allTags: "All tags",
    apply: "Filter",
    clear: "Clear filters",
    empty: "No articles match these filters.",
    guides: "Guide",
    recipes: "Recipe",
    minutes: "min read",
    servings: "servings",
    prep: "prep",
    cook: "cook",
    approximate: "about",
    ingredients: "Ingredients",
    steps: "Method",
    fodmap: "FODMAP status per ingredient",
    fodmapNote: "A qualitative status only. Check the Monash app for the current serving size. No numeric thresholds are shown here.",
    disclaimer: "This is general information, not personal medical advice. If you have gut symptoms, talk to your doctor or a FODMAP-trained dietitian.",
    trackTitle: "Keep track of what you eat",
    trackBody: "Save meals and symptoms in your own diary and take the overview to your dietitian.",
    languages: "Language",
    back: "All articles",
    placeholderLabel: "No photo yet",
  },
  fr: {
    articles: "Articles et recettes",
    signup: "Créer un compte",
    latestEyebrow: "Lire",
    latestTitle: "Guides et recettes",
    latestBody: "De courts textes sur le régime pauvre en FODMAP, et des recettes à noter ensuite dans votre journal.",
    allArticles: "Tous les articles",
    overviewTitle: "Articles et recettes",
    overviewBody: "Guides et recettes en français. Filtrez par catégorie ou par mot-clé.",
    category: "Catégorie",
    allCategories: "Tout",
    tag: "Mot-clé",
    allTags: "Tous les mots-clés",
    apply: "Filtrer",
    clear: "Effacer les filtres",
    empty: "Aucun article ne correspond à ces filtres.",
    guides: "Guide",
    recipes: "Recette",
    minutes: "min de lecture",
    servings: "portions",
    prep: "préparation",
    cook: "cuisson",
    approximate: "environ",
    ingredients: "Ingrédients",
    steps: "Préparation",
    fodmap: "Statut FODMAP par ingrédient",
    fodmapNote: "Un statut qualitatif seulement. Vérifiez la portion actuelle dans l’application Monash. Aucun seuil chiffré n’est affiché ici.",
    disclaimer: "Ceci est une information générale, pas un avis médical personnel. En cas de symptômes digestifs, consultez votre médecin ou un·e diététicien·ne formé·e aux FODMAP.",
    trackTitle: "Notez ce que vous mangez",
    trackBody: "Enregistrez repas et symptômes dans votre journal et emportez la vue d’ensemble chez votre diététicien·ne.",
    languages: "Langue",
    back: "Tous les articles",
    placeholderLabel: "Pas encore de photo",
  },
  de: {
    articles: "Artikel und Rezepte",
    signup: "Konto erstellen",
    latestEyebrow: "Lesen",
    latestTitle: "Ratgeber und Rezepte",
    latestBody: "Kurze Texte dazu, wie die Low-FODMAP-Ernährung funktioniert, und Rezepte, die du danach im Tagebuch festhalten kannst.",
    allArticles: "Alle Artikel",
    overviewTitle: "Artikel und Rezepte",
    overviewBody: "Ratgeber und Rezepte auf Deutsch. Filter nach Kategorie oder Stichwort.",
    category: "Kategorie",
    allCategories: "Alles",
    tag: "Stichwort",
    allTags: "Alle Stichwörter",
    apply: "Filtern",
    clear: "Filter löschen",
    empty: "Keine Artikel passen zu diesen Filtern.",
    guides: "Ratgeber",
    recipes: "Rezept",
    minutes: "Min. Lesezeit",
    servings: "Portionen",
    prep: "Vorbereitung",
    cook: "Zubereitung",
    approximate: "etwa",
    ingredients: "Zutaten",
    steps: "Zubereitung",
    fodmap: "FODMAP-Status je Zutat",
    fodmapNote: "Nur ein qualitativer Status. Die aktuelle Portionsgröße steht in der Monash-App. Hier gibt es keine zahlenmäßigen Grenzwerte.",
    disclaimer: "Das sind allgemeine Informationen und keine persönliche medizinische Beratung. Bei Darmbeschwerden sprich mit deiner Ärztin, deinem Arzt oder einer FODMAP-geschulten Ernährungsfachkraft.",
    trackTitle: "Halt fest, was du isst",
    trackBody: "Speichere Mahlzeiten und Beschwerden in deinem Tagebuch und nimm die Übersicht mit zur Ernährungsberatung.",
    languages: "Sprache",
    back: "Alle Artikel",
    placeholderLabel: "Noch kein Foto",
  },
};
