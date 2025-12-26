import { getSupabaseClient, isSupabaseConfigured } from "@/supabase/client";
import { ensureSupabaseSession } from "@/supabase/session";
import { getLocalDisplayName } from "./displayName";
import { gqFromPremises } from "./gq";

let lastUpdateAt = 0;
let __dbgLeaderboardCount = 0;
let __dbgRankPointsReadLogged = false;
const __dbgCanIngest =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

function readRankPointsFromLocalStorage(): number {
  try {
    const key = "sllgms-v3-app-state";
    const raw = localStorage.getItem(key);
    // #region agent log
    try {
      if (!__dbgRankPointsReadLogged) {
        __dbgRankPointsReadLogged = true;
        if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId: (globalThis as any).__dbgRunId || 'pre-fix',
            hypothesisId: 'D',
            location: 'src/leaderboards/update.ts:readRankPointsFromLocalStorage',
            message: 'read-rankpoints-localstorage',
            data: { key, hasRaw: !!raw, rawLen: raw ? raw.length : 0 },
            timestamp: Date.now()
          })
        }).catch(() => {});
      }
    } catch {}
    // #endregion
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const p = (parsed as any)?.rankPoints;
    if (typeof p !== "number" || !Number.isFinite(p)) return 0;
    return Math.max(0, Math.floor(p));
  } catch {
    return 0;
  }
}

function utcDayStringNow(): string {
  // YYYY-MM-DD (UTC)
  return new Date().toISOString().slice(0, 10);
}

function utcDayStringOffset(day: string, offsetDays: number): string {
  // day is YYYY-MM-DD (UTC)
  const d = new Date(`${day}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

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
  const configured = isSupabaseConfigured();
  // #region agent log
  try {
    if (__dbgLeaderboardCount < 3) {
      if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: (globalThis as any).__dbgRunId || 'pre-fix',
          hypothesisId: 'E',
          location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
          message: 'maybeUpdateLeaderboards-entry',
          data: { configured, progressType: progressData?.type },
          timestamp: Date.now()
        })
      }).catch(() => {});
    }
  } catch {}
  // #endregion
  if (!configured) {
    // #region agent log
    try {
      if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: (globalThis as any).__dbgRunId || 'pre-fix',
          hypothesisId: 'E',
          location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
          message: 'early-return:not-configured',
          data: {},
          timestamp: Date.now()
        })
      }).catch(() => {});
    } catch {}
    // #endregion
    return;
  }
  const now = Date.now();
  if (now - lastUpdateAt < 3000) {
    // #region agent log
    try {
      if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: (globalThis as any).__dbgRunId || 'pre-fix',
          hypothesisId: 'E',
          location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
          message: 'early-return:throttled',
          data: { msSinceLast: now - lastUpdateAt, throttleLimit: 3000 },
          timestamp: Date.now()
        })
      }).catch(() => {});
    } catch {}
    // #endregion
    return; // throttle
  }
  lastUpdateAt = now;

  const supabase = getSupabaseClient();
  if (!supabase) {
    // #region agent log
    try {
      if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: (globalThis as any).__dbgRunId || 'pre-fix',
          hypothesisId: 'E',
          location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
          message: 'early-return:no-supabase-client',
          data: {},
          timestamp: Date.now()
        })
      }).catch(() => {});
    } catch {}
    // #endregion
    return;
  }
  const userId = await ensureSupabaseSession();
  if (!userId) {
    // #region agent log
    try {
      if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: (globalThis as any).__dbgRunId || 'pre-fix',
          hypothesisId: 'E',
          location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
          message: 'early-return:no-session',
          data: {},
          timestamp: Date.now()
        })
      }).catch(() => {});
    } catch {}
    // #endregion
    return;
  }

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

  const day = utcDayStringNow();
  // #region agent log
  try {
    if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: (globalThis as any).__dbgRunId || 'pre-fix',
        hypothesisId: 'E',
        location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
        message: 'profile-complete-evaluated',
        data: { profileComplete },
        timestamp: Date.now()
      })
    }).catch(() => {});
  } catch {}
  // #endregion

  // Minutes leaderboards are updated by DB triggers; we only maintain profile metadata for display.
  if (profileComplete) {
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
    try {
      await supabase
        .from("leaderboard_minutes_daily")
        .upsert(
          { user_id: userId, day, display_name: displayName, avatar_path: avatarPath } as any,
          { onConflict: "user_id,day" }
        );
    } catch {
      // ignore
    }
  } else {
    // Ensure user is not shown if they don't meet requirements.
    try {
      await supabase.from("leaderboard_minutes").update({ display_name: null, avatar_path: null } as any).eq("user_id", userId);
    } catch {
      // ignore
    }
    try {
      await supabase
        .from("leaderboard_minutes_daily")
        .update({ display_name: null, avatar_path: null } as any)
        .eq("user_id", userId)
        .eq("day", day);
    } catch {
      // ignore
    }
  }

  // Qualification requirement: user must have manually set BOTH username + avatar.
  // If not, ensure they do not appear on any leaderboard that uses our updater.
  if (!profileComplete) {
    // #region agent log
    try {
      if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: (globalThis as any).__dbgRunId || 'pre-fix',
          hypothesisId: 'E',
          location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
          message: 'early-return:profile-incomplete',
          data: {},
          timestamp: Date.now()
        })
      }).catch(() => {});
    } catch {}
    // #endregion
    try {
      await supabase.from("leaderboard_2d_gq").delete().eq("user_id", userId);
    } catch {
      // ignore
    }
    try {
      await supabase.from("leaderboard_points").delete().eq("user_id", userId);
    } catch {
      // ignore
    }
    try {
      await supabase.from("leaderboard_points_daily").delete().eq("user_id", userId).eq("day", day);
    } catch {
      // ignore
    }
    return;
  }

  // Points leaderboard: always keep current points up to date (top 50 is enforced at query time).
  try {
    const points = readRankPointsFromLocalStorage();
    // #region agent log
    try {
      if (__dbgLeaderboardCount < 3) {
        __dbgLeaderboardCount++;
        if (__dbgCanIngest) fetch('http://127.0.0.1:7243/ingest/d0b07b4c-34b6-4420-ae9c-63c63a325a9c', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId: (globalThis as any).__dbgRunId || 'pre-fix',
            hypothesisId: 'D',
            location: 'src/leaderboards/update.ts:maybeUpdateLeaderboards',
            message: 'points-upsert-attempt',
            data: { points, profileComplete },
            timestamp: Date.now()
          })
        }).catch(() => {});
      }
    } catch {}
    // #endregion
    await supabase.from("leaderboard_points").upsert(
      {
        user_id: userId,
        display_name: displayName,
        avatar_path: avatarPath,
        points,
        updated_at: new Date().toISOString()
      } as any,
      { onConflict: "user_id" }
    );

    // Daily net delta (UTC midnight-based):
    // - If today's row exists, keep start_points and update end_points/delta_points.
    // - If it doesn't exist, initialize start_points from yesterday's end_points if available; else fall back to current points.
    let startPoints: number | null = null;
    try {
      const existing = await supabase
        .from("leaderboard_points_daily")
        .select("start_points,end_points,delta_points")
        .eq("user_id", userId)
        .eq("day", day)
        .maybeSingle();
      const s = (existing.data as any)?.start_points;
      const e = (existing.data as any)?.end_points;
      const d = (existing.data as any)?.delta_points;

      const sNum = typeof s === "number" ? s : typeof s === "string" ? Number(s) : null;
      const eNum = typeof e === "number" ? e : typeof e === "string" ? Number(e) : null;
      const dNum = typeof d === "number" ? d : typeof d === "string" ? Number(d) : null;

      // Migration self-heal:
      // When we added start_points/end_points to an existing row, Postgres filled them with 0.
      // That makes delta look like "all-time points". Treat this state as "unset".
      const looksUnset =
        (typeof sNum === "number" && Number.isFinite(sNum) && Math.floor(sNum) === 0) &&
        (eNum == null || (typeof eNum === "number" && Number.isFinite(eNum) && Math.floor(eNum) === 0)) &&
        (dNum == null || (typeof dNum === "number" && Number.isFinite(dNum) && Math.floor(dNum) === 0));

      if (!looksUnset && typeof sNum === "number" && Number.isFinite(sNum)) {
        startPoints = Math.floor(sNum);
      }
    } catch {
      // ignore
    }
    if (startPoints == null) {
      const yesterday = utcDayStringOffset(day, -1);
      try {
        const prev = await supabase
          .from("leaderboard_points_daily")
          .select("end_points")
          .eq("user_id", userId)
          .eq("day", yesterday)
          .maybeSingle();
        const e = (prev.data as any)?.end_points;
        const eNum = typeof e === "number" ? e : typeof e === "string" ? Number(e) : null;
        if (typeof eNum === "number" && Number.isFinite(eNum)) startPoints = Math.floor(eNum);
      } catch {
        // ignore
      }
    }
    if (startPoints == null) startPoints = Math.floor(points);
    const endPoints = Math.floor(points);
    const deltaPoints = Math.floor(endPoints - startPoints);
    await supabase.from("leaderboard_points_daily").upsert(
      {
        user_id: userId,
        day,
        display_name: displayName,
        avatar_path: avatarPath,
        start_points: startPoints,
        end_points: endPoints,
        delta_points: deltaPoints,
        updated_at: new Date().toISOString()
      } as any,
      { onConflict: "user_id,day" }
    );
  } catch {
    // ignore
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


