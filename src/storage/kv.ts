import { getSupabaseClient } from "@/supabase/client";
import { ensureSupabaseSession } from "@/supabase/session";

export async function pullKvText(keys: string[]): Promise<Record<string, string>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};
  const userId = await ensureSupabaseSession();
  if (!userId) return {};

  const { data, error } = await supabase
    .from("user_kv")
    .select("key,value_text")
    .in("key", keys);

  if (error || !data) return {};

  const out: Record<string, string> = {};
  for (const row of data as any[]) out[row.key] = row.value_text;
  return out;
}

export async function pushKvText(key: string, valueText: string | null): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const userId = await ensureSupabaseSession();
  if (!userId) return;

  await supabase.from("user_kv").upsert(
    {
      user_id: userId,
      key,
      value_text: valueText
    } as any,
    { onConflict: "user_id,key" }
  );
}


