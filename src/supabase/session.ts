import { getSupabaseClient } from "./client";

// Track if anonymous auth has failed to avoid repeated 422 errors
let anonymousAuthDisabled = false;

export async function ensureSupabaseSession(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) return null;
  if (sessionData.session?.user?.id) return sessionData.session.user.id;

  // Skip anonymous sign-in if it previously failed (likely disabled in Supabase)
  if (anonymousAuthDisabled) return null;

  // Anonymous sign-in to enable per-user cloud storage without a UI/login flow.
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    // Mark as disabled to prevent repeated failed requests
    anonymousAuthDisabled = true;
    return null;
  }
  return data.user?.id ?? null;
}


