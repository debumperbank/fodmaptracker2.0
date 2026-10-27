import { z } from "zod";
export const foodSchema=z.object({food_name:z.string().trim().min(2).max(140),meal_type:z.enum(["ontbijt","lunch","avondeten","tussendoor"]),portion_description:z.string().trim().max(100).optional(),notes:z.string().trim().max(500).optional()});
export const symptomSchema=z.object({symptom_type:z.enum(["buikpijn","opgeblazen","winderigheid","stoelgang","misselijkheid","anders"]),severity:z.coerce.number().int().min(0).max(10),notes:z.string().trim().max(500).optional()});
export const credentialsSchema=z.object({email:z.email().max(254),password:z.string().min(10).max(128)});
export const idSchema=z.uuid();
