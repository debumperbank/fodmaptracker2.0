export type MealType = "ontbijt" | "lunch" | "avondeten" | "tussendoor";
export type SymptomType = "buikpijn" | "opgeblazen" | "winderigheid" | "stoelgang" | "misselijkheid" | "anders";
export interface FoodEntry { id:string; user_id:string; food_name:string; meal_type:MealType; portion_description:string|null; notes:string|null; eaten_at:string; created_at:string; }
export interface SymptomEntry { id:string; user_id:string; symptom_type:SymptomType; severity:number; notes:string|null; experienced_at:string; created_at:string; }
export const mealNames:Record<MealType,string>={ontbijt:"Ontbijt",lunch:"Lunch",avondeten:"Avondeten",tussendoor:"Tussendoor"};
export const symptomNames:Record<SymptomType,string>={buikpijn:"Buikpijn",opgeblazen:"Opgeblazen gevoel",winderigheid:"Winderigheid",stoelgang:"Veranderde stoelgang",misselijkheid:"Misselijkheid",anders:"Anders"};
