export const languages = ["en", "nl", "fr", "de"] as const;
export type AppLanguage = (typeof languages)[number];

export const languageInfo: Record<AppLanguage, { flag: string; label: string; locale: string }> = {
  nl: { flag: "🇳🇱", label: "Nederlands", locale: "nl-NL" },
  fr: { flag: "🇫🇷", label: "Français", locale: "fr-BE" },
  de: { flag: "🇩🇪", label: "Deutsch", locale: "de-DE" },
  en: { flag: "🇬🇧", label: "English", locale: "en-GB" },
};

export function appLanguage(value: unknown): AppLanguage {
  return languages.includes(value as AppLanguage) ? value as AppLanguage : "en";
}

export const shellText = {
  nl: { overview: "Overzicht", recipes: "Recepten", week: "Weekmenu", profile: "Profiel", meal: "Maaltijd", symptom: "Klacht", admin: "Beheerder", logout: "Uitloggen", nav: "Hoofdnavigatie", language: "Taal wijzigen", footer: "Fodmap Tracker helpt je gegevens bij te houden en stelt geen diagnose. Bespreek voedingskeuzes met een gekwalificeerde diëtist." },
  fr: { overview: "Aperçu", recipes: "Recettes", week: "Menu semaine", profile: "Profil", meal: "Repas", symptom: "Symptôme", admin: "Admin", logout: "Déconnexion", nav: "Navigation principale", language: "Changer de langue", footer: "Fodmap Tracker vous aide à enregistrer vos données et ne pose aucun diagnostic. Discutez de vos choix alimentaires avec un diététicien qualifié." },
  de: { overview: "Übersicht", recipes: "Rezepte", week: "Wochenplan", profile: "Profil", meal: "Mahlzeit", symptom: "Beschwerde", admin: "Verwaltung", logout: "Abmelden", nav: "Hauptnavigation", language: "Sprache ändern", footer: "Fodmap Tracker hilft dir, deine Daten zu erfassen, und stellt keine Diagnose. Besprich Ernährungsentscheidungen mit einer qualifizierten Ernährungsfachkraft." },
  en: { overview: "Overview", recipes: "Recipes", week: "Weekly menu", profile: "Profile", meal: "Meal", symptom: "Symptom", admin: "Admin", logout: "Log out", nav: "Main navigation", language: "Change language", footer: "Fodmap Tracker helps you keep track of your information and does not provide a diagnosis. Discuss dietary choices with a qualified dietitian." },
} satisfies Record<AppLanguage, Record<string, string>>;
