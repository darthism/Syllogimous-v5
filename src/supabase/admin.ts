import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function getUserIdFromAuthHeader(request: Request): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const auth = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) return null;
  const token = auth.slice("bearer ".length).trim();

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user?.id ?? null;
}


