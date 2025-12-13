"use client";

import { isSupabaseConfigured } from "@/supabase/client";
import { getAllProgressCloud } from "@/storage/rrtHistory";
import { useEffect, useMemo, useState } from "react";

type AppState = {
  score?: number;
  questions?: Array<{ startedAt?: number; answeredAt?: number; correctness?: string }>;
};

function readLocalAppState(): AppState | null {
  try {
    const raw = localStorage.getItem("sllgms-v3-app-state");
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export default function StatsPage() {
  const [local, setLocal] = useState<AppState | null>(null);
  const [cloudCount, setCloudCount] = useState<number | null>(null);
  const [cloudMinutes, setCloudMinutes] = useState<number | null>(null);

  const localStats = useMemo(() => {
    const q = local?.questions ?? [];
    const times = q
      .filter((x) => typeof x.startedAt === "number" && typeof x.answeredAt === "number")
      .map((x) => ((x.answeredAt as number) - (x.startedAt as number)) / 1000);
    const totalSeconds = times.reduce((a, b) => a + b, 0);
    const correct = q.filter((x) => x.correctness === "right").length;
    const answered = q.length;
    const pct = answered ? (100 * correct) / answered : 0;
    const avg = times.length ? totalSeconds / times.length : 0;
    return {
      score: local?.score ?? 0,
      answered,
      correct,
      pct,
      avg
    };
  }, [local]);

  useEffect(() => {
    setLocal(readLocalAppState());
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured()) return;
    void getAllProgressCloud().then((rows) => {
      if (cancelled) return;
      setCloudCount(rows.length);
      const totalMinutes = rows.reduce((sum, r: any) => sum + (r.timeElapsed ?? 0) / 1000 / 60, 0);
      setCloudMinutes(totalMinutes);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ui-shell text-slate-100">
      <div className="ui-header">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Stats</div>
            <div className="mt-1 text-sm text-slate-300">
          Local session stats + (optional) Supabase cloud history summary.
            </div>
          </div>
          <div className="hidden sm:block text-xs text-slate-400">
            Tip: profile + cloud sync makes your leaderboards look nicer.
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="ui-card">
          <div className="text-sm font-semibold">This session (local)</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="ui-tile">
              <div className="text-xs text-slate-300">Score</div>
              <div className="text-xl font-semibold">{localStats.score}</div>
            </div>
            <div className="ui-tile">
              <div className="text-xs text-slate-300">Answered</div>
              <div className="text-xl font-semibold">{localStats.answered}</div>
            </div>
            <div className="ui-tile">
              <div className="text-xs text-slate-300">Correct</div>
              <div className="text-xl font-semibold">{localStats.correct}</div>
            </div>
            <div className="ui-tile">
              <div className="text-xs text-slate-300">% Correct</div>
              <div className="text-xl font-semibold">{localStats.pct.toFixed(1)}%</div>
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-300">
            Avg response time: <span className="text-slate-100">{localStats.avg.toFixed(1)}s</span>
          </div>
        </div>

        <div className="ui-card">
          <div className="text-sm font-semibold">Cloud history (Supabase)</div>
          {!isSupabaseConfigured() ? (
            <div className="mt-2 text-sm text-slate-300">
              Configure Supabase env vars to enable cloud stats.
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="ui-tile">
                <div className="text-xs text-slate-300">Tracked questions</div>
                <div className="text-xl font-semibold">{cloudCount ?? "…"}</div>
              </div>
              <div className="ui-tile">
                <div className="text-xs text-slate-300">Total minutes</div>
                <div className="text-xl font-semibold">
                  {cloudMinutes == null ? "…" : cloudMinutes.toFixed(0)}
                </div>
              </div>
            </div>
          )}
          <div className="mt-3 text-xs text-slate-400">
            Note: cloud history only records questions when the in-game timer is active (original behavior).
          </div>
        </div>
      </div>
    </div>
  );
}


