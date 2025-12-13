import { getSupabaseClient, isSupabaseConfigured } from "@/supabase/client";
import { ensureSupabaseSession } from "@/supabase/session";
import { getLocalDisplayName } from "./displayName";
import { gqFromPremises } from "./gq";

let lastUpdateAt = 0;

type ProgressRow = {
  key?: string;
  timestamp?: number;
  type?: string;
  premises?: number;
  countdown?: number;
  scrambleFactor?: number;
  correctness?: string;
};

export async function maybeUpdateLeaderboards(progressData: any): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const now = Date.now();
  if (now - lastUpdateAt < 8000) return; // throttle
  lastUpdateAt = now;

  const supabase = getSupabaseClient();
  if (!supabase) return;
  const userId = await ensureSupabaseSession();
  if (!userId) return;

  let displayName = getLocalDisplayName();
  let avatarPath: string | null = null;
  let profileComplete = false;
  try {
    const { data } = await supabase
      .from("user_profiles")
      .select("username,avatar_path")
      .eq("user_id", userId)
      .maybeSingle();
    const u = (data as any)?.username;
    if (typeof u === "string" && u.trim().length > 0) displayName = u.trim();
    const a = (data as any)?.avatar_path;
    if (typeof a === "string" && a.trim().length > 0) avatarPath = a.trim();
    profileComplete = Boolean(
      typeof u === "string" &&
        u.trim().length > 0 &&
        typeof a === "string" &&
        a.trim().length > 0
    );
  } catch {
    // ignore
  }

  // Ensure minutes row exists and keeps a fresh display_name (totals are updated by DB trigger).
  try {
    await supabase
      .from("leaderboard_minutes")
      .upsert(
        { user_id: userId, display_name: displayName, avatar_path: avatarPath } as any,
        { onConflict: "user_id" }
      );
  } catch {
    // ignore
  }

  // Qualification requirement: user must have manually set BOTH username + avatar.
  // If not, ensure they do not appear on any leaderboard that uses our updater.
  if (!profileComplete) {
    try {
      await supabase.from("leaderboard_2d_gq").delete().eq("user_id", userId);
    } catch {
      // ignore
    }
    return;
  }

  // Only recompute GQ leaderboard when the user is doing 2D Space questions.
  const type = progressData?.type;
  if (type !== "space-two-d") return;

  const { data, error } = await supabase
    .from("rrt_history")
    .select("data,key,timestamp,time_elapsed_ms")
    .like("key", "space-two-d-%")
    .order("timestamp", { ascending: false })
    .limit(30);

  if (error || !data) return;

  const rows: ProgressRow[] = (data as any[]).map((r) => r.data);
  if (rows.length < 30) {
    // Not enough data to qualify yet.
    return;
  }

  const scrambleMin = Math.min(...rows.map((r) => (typeof r.scrambleFactor === "number" ? r.scrambleFactor : -Infinity)));
  const countdownMax = Math.max(...rows.map((r) => (typeof r.countdown === "number" ? r.countdown : Infinity)));
  const rightCount = rows.filter((r) => r.correctness === "right").length;
  const premiseNums = rows.map((r) => (typeof r.premises === "number" ? r.premises : NaN));
  if (premiseNums.some((n) => !Number.isFinite(n))) {
    // Can't qualify if any of the last 30 rows are missing premise count.
    return;
  }
  const premisesMin = Math.min(...premiseNums);
  const premisesMax = Math.max(...premiseNums);
  const samePremises = premisesMin === premisesMax;

  const qualifies =
    scrambleMin >= 80 &&
    countdownMax <= 20 &&
    rightCount >= 28 &&
    samePremises &&
    premisesMax >= 2;

  if (!qualifies) {
    // Ensure user is not included if they don't meet requirements.
    try {
      await supabase.from("leaderboard_2d_gq").delete().eq("user_id", userId);
    } catch {
      // ignore
    }
    return;
  }

  const gq = gqFromPremises(premisesMax);

  await supabase.from("leaderboard_2d_gq").upsert(
    {
      user_id: userId,
      display_name: displayName,
      avatar_path: avatarPath,
      gq,
      premises: premisesMax,
      last_30_right: rightCount,
      last_30_scramble_min: scrambleMin,
      last_30_countdown_max: countdownMax,
      qualified_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as any,
    { onConflict: "user_id" }
  );
}


