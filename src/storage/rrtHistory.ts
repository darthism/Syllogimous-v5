import { getSupabaseClient } from "@/supabase/client";
import { ensureSupabaseSession } from "@/supabase/session";

export type RrtRow = Record<string, any>;

export async function storeProgressCloud(progressData: any): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const userId = await ensureSupabaseSession();
  if (!userId) return false;

  const row = {
    user_id: userId,
    key: progressData.key,
    timestamp: progressData.timestamp,
    time_elapsed_ms: progressData.timeElapsed ?? 0,
    did_trigger_progress: progressData.didTriggerProgress === true,
    data: progressData
  };

  const { error } = await supabase.from("rrt_history").insert(row as any);
  return !error;
}

export async function getAllProgressCloud(): Promise<RrtRow[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const userId = await ensureSupabaseSession();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("rrt_history")
    .select("data")
    .eq("user_id", userId)
    .order("timestamp", { ascending: true });

  if (error || !data) return [];
  return (data as any[]).map((r) => r.data);
}

export async function getProgressFromCloud(startTime: number): Promise<RrtRow[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const userId = await ensureSupabaseSession();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("rrt_history")
    .select("data")
    .eq("user_id", userId)
    .gte("timestamp", startTime)
    .order("timestamp", { ascending: true });

  if (error || !data) return [];
  return (data as any[]).map((r) => r.data);
}

export async function getTopProgressCloud(keys: string[], count = 20): Promise<RrtRow[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const userId = await ensureSupabaseSession();
  if (!userId) return [];

  const maxResults = Math.max(1, count * Math.max(1, keys.length));

  const { data, error } = await supabase
    .from("rrt_history")
    .select("data")
    .eq("user_id", userId)
    .in("key", keys)
    .order("timestamp", { ascending: false })
    .limit(maxResults);

  if (error || !data) return [];

  const results = (data as any[]).map((r) => r.data).sort((a, b) => b.timestamp - a.timestamp);

  const filtered: any[] = [];
  for (const r of results) {
    if (filtered.length >= count || r.didTriggerProgress === true) break;
    filtered.push(r);
  }
  return filtered;
}


