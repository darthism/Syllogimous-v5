import { getSupabaseClient } from "./client";

export async function ensureSupabaseSession(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) return null;
  if (sessionData.session?.user?.id) return sessionData.session.user.id;

  // Anonymous sign-in to enable per-user cloud storage without a UI/login flow.
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) return null;
  return data.user?.id ?? null;
}


