import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { availableRecipeImageSlugs, recipeImagePath, recipeImageSlug } from "@/lib/recipe-image";

const pastaTitles = [
  "Pasta met tomaat en basilicum",
  "Romige citroenpasta met kip en courgette",
  "Low-FODMAP pasta bolognese",
  "Romige pasta met zalm, citroen en dille",
  "Verse basilicumpesto-pasta",
  "Aziatische kip-ananaspasta",
  "Klassieke carbonara zonder room",
  "Mediterrane tonijn-tomatenpasta",
  "Pasta met geroosterde groenten en feta",
  "Romige pompoen-saliepasta",
];

describe("recipeImageSlug", () => {
  it("drops straight and curly apostrophes instead of turning them into hyphens", () => {
    expect(recipeImageSlug("Ontbijttortilla’s")).toBe("ontbijttortillas");
    expect(recipeImageSlug("Ontbijttortilla's")).toBe("ontbijttortillas");
    expect(recipeImageSlug("Quinoa-koolsalade met pepita’s")).toBe("quinoa-koolsalade-met-pepitas");
  });

  it("points apostrophe titles at the existing files", () => {
    expect(recipeImagePath("Ontbijttortilla’s")).toBe("/recipes/items/ontbijttortillas.webp");
    expect(recipeImagePath("Quinoa-koolsalade met pepita’s")).toBe("/recipes/items/quinoa-koolsalade-met-pepitas.webp");
  });

  it("points every pasta recipe at its own image", () => {
    for (const title of pastaTitles) expect(recipeImagePath(title)).toBe(`/recipes/items/${recipeImageSlug(title)}.webp`);
  });

  it("lists exactly the files in public/recipes/items", () => {
    const files = readdirSync("public/recipes/items").filter(name => name.endsWith(".webp")).map(name => name.slice(0, -".webp".length)).sort();
    expect([...availableRecipeImageSlugs].sort()).toEqual(files);
  });
});
