const HALLOWEEN_DATE = "2026-10-31";

export function amsterdamDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isHalloweenToday(date = new Date()) {
  return amsterdamDate(date) === HALLOWEEN_DATE;
}

export const halloweenRecipeImages: Record<string, string> = {
  "Romige pompoen-saliepasta": "/halloween/pompoen-saliepasta.webp",
  "Romige pompoen-saliegnocchi": "/halloween/pompoen-saliegnocchi.webp",
  "Krokante aardappelgnocchi met kabocha en citroen": "/halloween/pompoen-saliegnocchi.webp",
  "Pompoen-wortelsoep": "/halloween/pompoen-wortelsoep.webp",
  "Kabocha-paprikasoep met gember": "/halloween/pompoen-wortelsoep.webp",
};
