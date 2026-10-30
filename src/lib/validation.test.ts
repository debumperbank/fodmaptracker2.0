import { describe, expect, it } from "vitest";
import { credentialsSchema, emailSchema, foodSchema, idSchema, passwordSchema, profileSchema, recipeSchema, symptomSchema, weeklyMenuSchema } from "@/lib/validation";

const recipeId = "11111111-1111-4111-8111-111111111111";

describe("foodSchema", () => {
  it("accepts a meal with an optional local time", () => {
    const parsed = foodSchema.safeParse({ food_name: " Havermout ", meal_type: "ontbijt", portion_description: "1 kom", notes: "", eaten_at: "2026-10-30T08:30" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.food_name).toBe("Havermout");
  });

  it("rejects a short name and an unknown meal slot", () => {
    expect(foodSchema.safeParse({ food_name: "A", meal_type: "snack", eaten_at: "" }).success).toBe(false);
  });
});

describe("symptomSchema", () => {
  it("requires a description when the type is anders", () => {
    expect(symptomSchema.safeParse({ symptom_type: "anders", custom_symptom: "", severity: "4", experienced_at: "" }).success).toBe(false);
    expect(symptomSchema.safeParse({ symptom_type: "anders", custom_symptom: "branderig", severity: "4", experienced_at: "" }).success).toBe(true);
  });

  it("keeps severity inside 0 to 10", () => {
    expect(symptomSchema.safeParse({ symptom_type: "buikpijn", severity: "0", experienced_at: "" }).success).toBe(true);
    expect(symptomSchema.safeParse({ symptom_type: "buikpijn", severity: "11", experienced_at: "" }).success).toBe(false);
    expect(symptomSchema.safeParse({ symptom_type: "buikpijn", severity: "-1", experienced_at: "" }).success).toBe(false);
  });
});

describe("credentials and ids", () => {
  it("requires a real email and a password of at least 10 characters", () => {
    expect(emailSchema.safeParse("person@example.com").success).toBe(true);
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
    expect(passwordSchema.safeParse("short").success).toBe(false);
    expect(credentialsSchema.safeParse({ email: "person@example.com", password: "lang-wachtwoord" }).success).toBe(true);
  });

  it("accepts only uuids", () => {
    expect(idSchema.safeParse(recipeId).success).toBe(true);
    expect(idSchema.safeParse("meal-1").success).toBe(false);
  });
});

describe("recipeSchema and weeklyMenuSchema", () => {
  const recipe = { title: "Soep", description: "", servings: "2", preparation_minutes: "", ingredients: "water", instructions: "koken", visibility: "private" };

  it("accepts private and public visibility only", () => {
    expect(recipeSchema.safeParse(recipe).success).toBe(true);
    expect(recipeSchema.safeParse({ ...recipe, visibility: "public" }).success).toBe(true);
    expect(recipeSchema.safeParse({ ...recipe, visibility: "shared" }).success).toBe(false);
  });

  it("requires an ISO date and a known meal slot", () => {
    expect(weeklyMenuSchema.safeParse({ recipe_id: recipeId, planned_for: "2026-10-30", meal_type: "avondeten" }).success).toBe(true);
    expect(weeklyMenuSchema.safeParse({ recipe_id: recipeId, planned_for: "30-10-2026", meal_type: "avondeten" }).success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("requires a username of letters, digits or underscores", () => {
    expect(profileSchema.safeParse({ display_name: "Sam", username: "sam_1" }).success).toBe(true);
    expect(profileSchema.safeParse({ display_name: "", username: "ab" }).success).toBe(false);
    expect(profileSchema.safeParse({ display_name: "", username: "sam name" }).success).toBe(false);
  });
});
