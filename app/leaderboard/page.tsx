"use client";

import { getSupabaseClient, isSupabaseConfigured } from "@/supabase/client";
import { getRank, RANKS } from "@/rank/ranks";
import { useEffect, useState } from "react";

type Period = "today" | "all";
type Category = "points" | "minutes" | "gq";
type League = "instinct" | "awareness" | "reason" | "intellect" | "logic" | "insight" | "genius" | "mastermind" | "paragon" | "oracle" | "transcendent" | "celestial" | "cosmic" | "primordial" | "absolute";

const LEAGUES: { id: League; name: string; minRank: number; maxRank: number; color: string }[] = [
  { id: "instinct", name: "Instinct", minRank: 0, maxRank: 2, color: "#64748b" },
  { id: "awareness", name: "Awareness", minRank: 3, maxRank: 5, color: "#78716c" },
  { id: "reason", name: "Reason", minRank: 6, maxRank: 8, color: "#60a5fa" },
  { id: "intellect", name: "Intellect", minRank: 9, maxRank: 11, color: "#38bdf8" },
  { id: "logic", name: "Logic", minRank: 12, maxRank: 14, color: "#22d3ee" },
  { id: "insight", name: "Insight", minRank: 15, maxRank: 17, color: "#2dd4bf" },
  { id: "genius", name: "Genius", minRank: 18, maxRank: 20, color: "#34d399" },
  { id: "mastermind", name: "Mastermind", minRank: 21, maxRank: 23, color: "#4ade80" },
  { id: "paragon", name: "Paragon", minRank: 24, maxRank: 26, color: "#a3e635" },
  { id: "oracle", name: "Oracle", minRank: 27, maxRank: 29, color: "#facc15" },
  { id: "transcendent", name: "Transcendent", minRank: 30, maxRank: 32, color: "#fbbf24" },
  { id: "celestial", name: "Celestial", minRank: 33, maxRank: 35, color: "#fb923c" },
  { id: "cosmic", name: "Cosmic", minRank: 36, maxRank: 38, color: "#fb7185" },
  { id: "primordial", name: "Primordial", minRank: 39, maxRank: 41, color: "#c084fc" },
  { id: "absolute", name: "Absolute", minRank: 42, maxRank: 44, color: "#e879f9" },
];

function getLeagueFromPoints(points: number): League {
  // Determine which league based on total points
  const rankIdx = RANKS.findIndex((r) => points >= r.min && (r.max == null || points < r.max));
  if (rankIdx < 0) return "instinct";
  // Each league has 3 ranks
  const leagueIdx = Math.floor(rankIdx / 3);
  if (leagueIdx >= LEAGUES.length) return "absolute";
  return LEAGUES[leagueIdx].id;
}

type Entry = {
  user_id: string;
  display_name: string;
  avatar_path?: string | null;
  points: number;
  updated_at: string;
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

type MinutesDailyRow = MinutesRow & { day: string };

type PointsDailyRow = {
  user_id: string;
  display_name: string;
  avatar_path?: string | null;
  day: string;
  start_points?: number;
  end_points?: number;
  delta_points: number;
  updated_at: string;
};

const TOP_N = 50;

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("today");
  const [category, setCategory] = useState<Category>("points");
  const [league, setLeague] = useState<League>("instinct");

  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [gqRows, setGqRows] = useState<GqRow[] | null>(null);
  const [minuteRows, setMinuteRows] = useState<MinutesRow[] | null>(null);
  const [minuteDailyRows, setMinuteDailyRows] = useState<MinutesDailyRow[] | null>(null);
  const [pointsDailyRows, setPointsDailyRows] = useState<PointsDailyRow[] | null>(null);
  const [rankByUserId, setRankByUserId] = useState<Record<string, { name: string; color: string }>>({});
  const [pointsByUserId, setPointsByUserId] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const day = new Date().toISOString().slice(0, 10); // UTC day

    void Promise.all([
      supabase
        .from("leaderboard_points")
        .select("user_id,display_name,avatar_path,points,updated_at")
        .not("avatar_path", "is", null)
        .not("display_name", "is", null)
        .order("points", { ascending: false })
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
        .limit(TOP_N),
      supabase
        .from("leaderboard_points_daily")
        .select("user_id,display_name,avatar_path,day,start_points,end_points,delta_points,updated_at")
        .eq("day", day)
        .not("avatar_path", "is", null)
        .not("display_name", "is", null)
        .order("delta_points", { ascending: false })
        .limit(TOP_N),
      supabase
        .from("leaderboard_minutes_daily")
        .select("user_id,display_name,avatar_path,day,total_ms,updated_at")
        .eq("day", day)
        .not("avatar_path", "is", null)
        .not("display_name", "is", null)
        .order("total_ms", { ascending: false })
        .limit(TOP_N)
    ]).then(async ([scoreRes, gqRes, minutesRes, pointsDailyRes, minutesDailyRes]) => {
      if (cancelled) return;
      const firstErr = scoreRes.error || gqRes.error || minutesRes.error || pointsDailyRes.error || minutesDailyRes.error;
      if (firstErr) {
        setError(firstErr.message);
        setEntries([]);
        setGqRows([]);
        setMinuteRows([]);
        setPointsDailyRows([]);
        setMinuteDailyRows([]);
        setRankByUserId({});
        return;
      }

      const entriesData = ((scoreRes.data as any) ?? []) as Entry[];
      const gqData = ((gqRes.data as any) ?? []) as GqRow[];
      const minutesData = ((minutesRes.data as any) ?? []) as MinutesRow[];
      const pointsDailyData = ((pointsDailyRes.data as any) ?? []) as PointsDailyRow[];
      const minutesDailyData = ((minutesDailyRes.data as any) ?? []) as MinutesDailyRow[];

      setEntries(entriesData);
      setGqRows(gqData);
      setMinuteRows(minutesData);
      setPointsDailyRows(pointsDailyData);
      setMinuteDailyRows(minutesDailyData);

      // Build a user_id -> rank-name map based on the user's points.
      // For points leaderboard entries we can compute directly, but for other leaderboards
      // we want to show the user's current rank next to their name.
      const ids = Array.from(
        new Set<string>([
          ...entriesData.map((x) => x.user_id),
          ...gqData.map((x) => x.user_id),
          ...minutesData.map((x) => x.user_id),
          ...pointsDailyData.map((x) => x.user_id),
          ...minutesDailyData.map((x) => x.user_id)
        ])
      );
      if (ids.length === 0) {
        setRankByUserId({});
        return;
      }

      const ptsRes = await supabase.from("leaderboard_points").select("user_id,points").in("user_id", ids);
      if (cancelled) return;
      if (ptsRes.error) {
        // Non-fatal: still render leaderboards, just omit rank labels.
        setRankByUserId({});
        return;
      }

      const map: Record<string, { name: string; color: string }> = {};
      const ptsMap: Record<string, number> = {};
      for (const row of (ptsRes.data as any[]) ?? []) {
        const id = row?.user_id;
        const pts = row?.points;
        const ptsNum =
          typeof pts === "number"
            ? pts
            : typeof pts === "string"
              ? Number(pts)
              : null;
        if (typeof id === "string" && typeof ptsNum === "number" && Number.isFinite(ptsNum)) {
          const r = getRank(ptsNum);
          map[id] = { name: r.name, color: r.color };
          ptsMap[id] = ptsNum;
        }
      }
      setRankByUserId(map);
      setPointsByUserId(ptsMap);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function avatarUrl(avatarPath?: string | null, updatedAt?: string | null): string | null {
    if (!avatarPath) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
    if (!data?.publicUrl) return null;
    // Cache-busting: append updated_at timestamp to force browser to fetch fresh image
    const cacheBuster = updatedAt ? `?t=${new Date(updatedAt).getTime()}` : `?t=${Date.now()}`;
    return data.publicUrl + cacheBuster;
  }

  function NameCell(props: {
    name: string;
    avatar_path?: string | null;
    rank?: { name: string; color: string } | null;
    updated_at?: string | null;
  }) {
    const url = avatarUrl(props.avatar_path, props.updated_at);
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
        <div className="truncate">
          {props.name}
          {props.rank ? (
            <span className="text-slate-400">
              {" "}
              |{" "}
              <span
                className="font-semibold tracking-wide"
                style={{
                  color: props.rank.color,
                  textShadow: `0 0 10px ${props.rank.color}99, 0 0 18px ${props.rank.color}55`
                }}
              >
                {props.rank.name}
              </span>
            </span>
          ) : null}
        </div>
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
              Make sure you applied `supabase/schema.sql` (leaderboard tables + daily tables + RLS).
            </div>
          </div>
        ) : entries == null || gqRows == null || minuteRows == null || pointsDailyRows == null || minuteDailyRows == null ? (
          <div className="text-sm text-slate-300">Loading…</div>
        ) : (
          <div className="grid gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm border ${category === "points" ? "bg-slate-900/50 border-slate-700 text-slate-100" : "bg-transparent border-slate-800 text-slate-300 hover:bg-slate-900/30"}`}
                  onClick={() => setCategory("points")}
                >
                  Points
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm border ${category === "minutes" ? "bg-slate-900/50 border-slate-700 text-slate-100" : "bg-transparent border-slate-800 text-slate-300 hover:bg-slate-900/30"}`}
                  onClick={() => setCategory("minutes")}
                >
                  Minutes
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm border ${category === "gq" ? "bg-slate-900/50 border-slate-700 text-slate-100" : "bg-transparent border-slate-800 text-slate-300 hover:bg-slate-900/30"}`}
                  onClick={() => setCategory("gq")}
                >
                  2D Space (GQ)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-400">Period</div>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm border ${period === "today" ? "bg-slate-900/50 border-slate-700 text-slate-100" : "bg-transparent border-slate-800 text-slate-300 hover:bg-slate-900/30"}`}
                  onClick={() => setPeriod("today")}
                  disabled={category === "gq"}
                  title={category === "gq" ? "GQ is all-time only" : "Today (UTC)"}
                >
                  Today
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm border ${period === "all" ? "bg-slate-900/50 border-slate-700 text-slate-100" : "bg-transparent border-slate-800 text-slate-300 hover:bg-slate-900/30"}`}
                  onClick={() => setPeriod("all")}
                >
                  All‑time
                </button>
              </div>
            </div>

            {category === "points" ? (
              period === "today" ? (
                <div>
                  <div className="text-sm font-semibold mb-2">Net points gained today (UTC)</div>
                  <div className="text-xs text-slate-400 mb-2">
                    Computed as (today end points − today start points). Filtered by league.
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {LEAGUES.map((l) => (
                      <button
                        key={l.id}
                        className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                          league === l.id
                            ? "border-slate-600 bg-slate-800/80"
                            : "border-slate-800 bg-transparent hover:bg-slate-900/40"
                        }`}
                        style={{ color: league === l.id ? l.color : undefined }}
                        onClick={() => setLeague(l.id)}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                  {(() => {
                    const filtered = pointsDailyRows.filter((r) => {
                      const pts = pointsByUserId[r.user_id];
                      if (typeof pts !== "number") return false;
                      return getLeagueFromPoints(pts) === league;
                    });
                    if (filtered.length === 0) {
                      return <div className="text-sm text-slate-300">No entries in {LEAGUES.find((l) => l.id === league)?.name} League today.</div>;
                    }
                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-slate-300">
                            <tr>
                              <th className="py-2 text-left">#</th>
                              <th className="py-2 text-left">Name</th>
                              <th className="py-2 text-left">Net</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((r, idx) => {
                              const net = r.delta_points as any;
                              const netNum =
                                typeof net === "number" ? net : typeof net === "string" ? Number(net) : 0;
                              const s = netNum >= 0 ? `+${netNum}` : String(netNum);
                              return (
                                <tr
                                  key={`${r.user_id}-${r.day}`}
                                  className="border-t border-slate-800/60 hover:bg-slate-900/20"
                                >
                                  <td className="py-2">{idx + 1}</td>
                                  <td className="py-2">
                                    <NameCell
                                      name={r.display_name}
                                      avatar_path={r.avatar_path}
                                      rank={rankByUserId[r.user_id] ?? null}
                                      updated_at={r.updated_at}
                                    />
                                  </td>
                                  <td className={`py-2 font-semibold ${netNum >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                                    {s}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  <div className="text-sm font-semibold mb-2">Top points (all‑time)</div>
                  {entries.length === 0 ? (
                    <div className="text-sm text-slate-300">No entries yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-slate-300">
                          <tr>
                            <th className="py-2 text-left">#</th>
                            <th className="py-2 text-left">Name</th>
                            <th className="py-2 text-left">Points</th>
                            <th className="py-2 text-left">Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((e, idx) => (
                            <tr key={e.user_id} className="border-t border-slate-800/60 hover:bg-slate-900/20">
                              <td className="py-2">{idx + 1}</td>
                              <td className="py-2">
                                <NameCell
                                  name={e.display_name}
                                  avatar_path={e.avatar_path}
                                  updated_at={e.updated_at}
                                  rank={(() => {
                                    const r = getRank(e.points);
                                    return { name: r.name, color: r.color };
                                  })()}
                                />
                              </td>
                              <td className="py-2 font-semibold">{e.points}</td>
                              <td className="py-2 text-slate-400">{new Date(e.updated_at).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            ) : category === "minutes" ? (
              period === "today" ? (
                <div>
                  <div className="text-sm font-semibold mb-2">Minutes played today (UTC)</div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {LEAGUES.map((l) => (
                      <button
                        key={l.id}
                        className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                          league === l.id
                            ? "border-slate-600 bg-slate-800/80"
                            : "border-slate-800 bg-transparent hover:bg-slate-900/40"
                        }`}
                        style={{ color: league === l.id ? l.color : undefined }}
                        onClick={() => setLeague(l.id)}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                  {(() => {
                    const filtered = minuteDailyRows.filter((r) => {
                      const pts = pointsByUserId[r.user_id];
                      if (typeof pts !== "number") return false;
                      return getLeagueFromPoints(pts) === league;
                    });
                    if (filtered.length === 0) {
                      return <div className="text-sm text-slate-300">No minutes in {LEAGUES.find((l) => l.id === league)?.name} League today.</div>;
                    }
                    return (
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
                            {filtered.map((r, idx) => (
                              <tr key={`${r.user_id}-${r.day}`} className="border-t border-slate-800/60 hover:bg-slate-900/20">
                                <td className="py-2">{idx + 1}</td>
                                <td className="py-2">
                                  <NameCell
                                    name={r.display_name ?? "Anonymous"}
                                    avatar_path={r.avatar_path}
                                    rank={rankByUserId[r.user_id] ?? null}
                                    updated_at={r.updated_at}
                                  />
                                </td>
                                <td className="py-2 font-semibold">{(r.total_ms / 60000).toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  <div className="text-sm font-semibold mb-2">Total minutes played (all‑time)</div>
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
                                <NameCell
                                  name={r.display_name ?? "Anonymous"}
                                  avatar_path={r.avatar_path}
                                  rank={rankByUserId[r.user_id] ?? null}
                                  updated_at={r.updated_at}
                                />
                              </td>
                              <td className="py-2 font-semibold">{(r.total_ms / 60000).toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div>
                <div className="flex items-end justify-between gap-3 mb-2">
                  <div>
                    <div className="text-sm font-semibold">2D Space (GQ)</div>
                    <div className="text-xs text-slate-400">
                      Qualify with scramble ≥ 80, timer ≤ 20s, ≥ 28/30 correct, and the latest 30 must share the same premise count.
                    </div>
                  </div>
                </div>
                {gqRows.length === 0 ? (
                  <div className="text-sm text-slate-300">No qualified users yet.</div>
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
                              <NameCell
                                name={r.display_name}
                                avatar_path={r.avatar_path}
                                rank={rankByUserId[r.user_id] ?? null}
                                updated_at={r.updated_at}
                              />
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}


