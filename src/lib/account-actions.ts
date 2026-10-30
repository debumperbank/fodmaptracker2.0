"use server";

import { redirect } from "next/navigation";
import { removeOwnStorage, type AccountDataClient } from "@/lib/account-data";
import { requireUser } from "@/lib/data";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";

const field = (form: FormData, name: string) => String(form.get(name) ?? "");

type RpcClient = {
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  auth: { signOut: () => Promise<{ error: { message: string } | null }> };
};

type ProfileWriter = {
  from: (table: string) => {
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
    };
  };
};

export async function deleteOwnAccount(form: FormData) {
  if (field(form, "confirm_delete") !== "VERWIJDER") redirect("/profiel?error=verwijderen-bevestiging");
  const { supabase, user } = await requireUser();
  try {
    await removeOwnStorage(supabase as unknown as AccountDataClient, user.id);
  } catch {
    redirect("/profiel?error=verwijderen");
  }
  const client = supabase as unknown as RpcClient;
  const { error } = await client.rpc("delete_own_account");
  if (error) redirect("/profiel?error=verwijderen");
  await client.auth.signOut();
  redirect("/account-verwijderen?message=verwijderd");
}

export async function recordHealthConsent(form: FormData) {
  if (field(form, "health_consent") !== "yes") redirect("/profiel?error=toestemming");
  const { supabase, user } = await requireUser();
  const { error } = await (supabase as unknown as ProfileWriter).from("profiles").update({
    health_data_consent_at: new Date().toISOString(),
    privacy_notice_version: PRIVACY_NOTICE_VERSION,
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);
  if (error) redirect("/profiel?error=toestemming");
  redirect("/profiel?message=toestemming");
}
