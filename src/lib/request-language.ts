import { createClient } from "@/lib/supabase/server";
import { appLanguage, type AppLanguage } from "@/lib/i18n";

export async function getRequestLanguage(): Promise<AppLanguage> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) return "nl";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "nl";
    const { data } = await supabase.from("profiles").select("preferred_language").eq("id", user.id).maybeSingle();
    return appLanguage(data?.preferred_language);
  } catch {
    return "nl";
  }
}
