"use client";

import { recipeImagePath } from "@/lib/recipe-image";
import { halloweenRecipeImages, isHalloweenToday } from "@/lib/seasonal";

export function RecipePhoto({ title, fallback, alt, className }: { title: string; fallback: string; alt: string; className?: string }) {
  const specific = isHalloweenToday() ? halloweenRecipeImages[title] ?? recipeImagePath(title) : recipeImagePath(title);
  return (
    <img
      className={className}
      src={specific ?? fallback}
      alt={alt}
      onError={specific ? (event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallback;
      } : undefined}
    />
  );
}
