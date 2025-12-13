"use client";

import { getSupabaseClient, isSupabaseConfigured } from "@/supabase/client";
import { useEffect, useState } from "react";

type Entry = {
  id: number;
  display_name: string;
  avatar_path?: string | null;
  score: number;
  created_at: string;
};

type GqRow = {
  user_id: string;
  display_name: string;
  avatar_path?: string | null;
  gq: number;
  premises: number;
  last_30_right: number;
  last_30_scramble_min: number;
  last_30_countdown_max: number;
  updated_at: string;
};

type MinutesRow = {
  user_id: string;
  display_name: string | null;
  avatar_path?: string | null;
  total_ms: number;
  updated_at: string;
};

const TOP_N = 50;

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [gqRows, setGqRows] = useState<GqRow[] | null>(null);
  const [minuteRows, setMinuteRows] = useState<MinutesRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    void Promise.all([
      supabase
        .from("leaderboard_entries")
        .select("id,display_name,avatar_path,score,created_at")
        .not("avatar_path", "is", null)
        .order("score", { ascending: false })
        .limit(TOP_N),
      supabase
        .from("leaderboard_2d_gq")
        .select(
          "user_id,display_name,avatar_path,gq,premises,last_30_right,last_30_scramble_min,last_30_countdown_max,updated_at"
        )
        .not("avatar_path", "is", null)
        .order("gq", { ascending: false })
        .limit(TOP_N),
      supabase
        .from("leaderboard_minutes")
        .select("user_id,display_name,avatar_path,total_ms,updated_at")
        .not("avatar_path", "is", null)
        .not("display_name", "is", null)
        .order("total_ms", { ascending: false })
        .limit(TOP_N)
    ]).then(([scoreRes, gqRes, minutesRes]) => {
      if (cancelled) return;
      const firstErr = scoreRes.error || gqRes.error || minutesRes.error;
      if (firstErr) {
        setError(firstErr.message);
        setEntries([]);
        setGqRows([]);
        setMinuteRows([]);
        return;
      }
      setEntries((scoreRes.data as any) ?? []);
      setGqRows((gqRes.data as any) ?? []);
      setMinuteRows((minutesRes.data as any) ?? []);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function avatarUrl(avatarPath?: string | null): string | null {
    if (!avatarPath) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
    return data?.publicUrl ?? null;
  }

  function NameCell(props: { name: string; avatar_path?: string | null }) {
    const url = avatarUrl(props.avatar_path);
    const initial = (props.name || "A").slice(0, 1).toUpperCase();
    return (
      <div className="flex items-center gap-2">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-7 w-7 rounded-full border border-slate-800 object-cover bg-slate-900"
          />
        ) : (
          <div className="h-7 w-7 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-xs text-slate-200">
            {initial}
          </div>
        )}
        <div className="truncate">{props.name}</div>
      </div>
    );
  }

  return (
    <div className="ui-shell text-slate-100">
      <div className="ui-header">
        <div className="text-lg font-semibold">Leaderboard</div>
        <div className="mt-1 text-sm text-slate-300">
          Top 50 players (Supabase). To qualify, you must set BOTH a username and a profile picture in Profile.
        </div>
      </div>

      <div className="mt-4 ui-card">
        {!isSupabaseConfigured() ? (
          <div className="text-sm text-slate-300">
            Configure Supabase env vars to enable the leaderboard.
          </div>
        ) : error ? (
          <div className="text-sm text-amber-200">
            {error}
            <div className="mt-2 text-xs text-slate-400">
              Make sure you created the table `leaderboard_entries` (see `supabase/schema.sql` update
              we can add).
            </div>
          </div>
        ) : entries == null || gqRows == null || minuteRows == null ? (
          <div className="text-sm text-slate-300">Loading…</div>
        ) : (
          <div className="grid gap-6">
            <div>
              <div className="flex items-end justify-between gap-3 mb-2">
                <div>
                  <div className="text-sm font-semibold">2D Space (GQ)</div>
                  <div className="text-xs text-slate-400">
                    Qualify with scramble ≥ 80, timer ≤ 20s, and ≥ 28/30 correct (latest 30).
                  </div>
                </div>
              </div>
              {gqRows.length === 0 ? (
                <div className="text-sm text-slate-300">
                  No qualified users yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-slate-300">
                      <tr>
                        <th className="py-2 text-left">#</th>
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">GQ</th>
                        <th className="py-2 text-left">Premises</th>
                        <th className="py-2 text-left">Right (30)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gqRows.map((r, idx) => (
                        <tr key={r.user_id} className="border-t border-slate-800/60 hover:bg-slate-900/20">
                          <td className="py-2">{idx + 1}</td>
                          <td className="py-2">
                            <NameCell name={r.display_name} avatar_path={r.avatar_path} />
                          </td>
                          <td className="py-2 font-semibold">{r.gq}</td>
                          <td className="py-2">{r.premises}</td>
                          <td className="py-2 text-slate-300">{r.last_30_right}/30</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Total minutes played</div>
              {minuteRows.length === 0 ? (
                <div className="text-sm text-slate-300">No minutes recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-slate-300">
                      <tr>
                        <th className="py-2 text-left">#</th>
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">Minutes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {minuteRows.map((r, idx) => (
                        <tr key={r.user_id} className="border-t border-slate-800/60 hover:bg-slate-900/20">
                          <td className="py-2">{idx + 1}</td>
                          <td className="py-2">
                            <NameCell name={r.display_name ?? "Anonymous"} avatar_path={r.avatar_path} />
                          </td>
                          <td className="py-2 font-semibold">{(r.total_ms / 60000).toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Top scores</div>
              {entries.length === 0 ? (
                <div className="text-sm text-slate-300">No entries yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-slate-300">
                      <tr>
                        <th className="py-2 text-left">#</th>
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">Score</th>
                        <th className="py-2 text-left">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e, idx) => (
                        <tr key={e.id} className="border-t border-slate-800/60 hover:bg-slate-900/20">
                          <td className="py-2">{idx + 1}</td>
                          <td className="py-2">
                            <NameCell name={e.display_name} avatar_path={e.avatar_path} />
                          </td>
                          <td className="py-2 font-semibold">{e.score}</td>
                          <td className="py-2 text-slate-400">
                            {new Date(e.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


