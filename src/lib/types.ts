export type MealType = "ontbijt" | "lunch" | "avondeten" | "tussendoor";
export type SymptomType = "buikpijn" | "opgeblazen" | "winderigheid" | "stoelgang" | "misselijkheid" | "anders";
export type MenuMealType = "ontbijt" | "lunch" | "avondeten" | "tussendoor";
export interface FoodEntry { id:string; user_id:string; food_name:string; meal_type:MealType; portion_description:string|null; notes:string|null; photo_path:string|null; photo_url?:string|null; eaten_at:string; created_at:string; }
export interface SymptomEntry { id:string; user_id:string; food_entry_id:string|null; symptom_type:SymptomType; custom_symptom:string|null; severity:number; notes:string|null; experienced_at:string; created_at:string; food_entry?:Pick<FoodEntry,"id"|"food_name">|null; }
export interface Recipe { id:string; user_id:string; title:string; description:string|null; servings:number; preparation_minutes:number|null; ingredients:string; instructions:string; created_at:string; updated_at:string; }
export interface WeeklyMenuEntry { id:string; user_id:string; recipe_id:string; planned_for:string; meal_type:MenuMealType; created_at:string; recipe:Pick<Recipe,"id"|"title"|"servings"|"preparation_minutes">|null; }
export const mealNames:Record<MealType,string>={ontbijt:"Ontbijt",lunch:"Lunch",avondeten:"Avondeten",tussendoor:"Tussendoor"};
export const symptomNames:Record<SymptomType,string>={buikpijn:"Buikpijn",opgeblazen:"Opgeblazen gevoel",winderigheid:"Winderigheid",stoelgang:"Veranderde stoelgang",misselijkheid:"Misselijkheid",anders:"Anders"};
export const menuMealNames:Record<MenuMealType,string>={ontbijt:"Ontbijt",lunch:"Lunch",avondeten:"Avondeten",tussendoor:"Tussendoor"};
