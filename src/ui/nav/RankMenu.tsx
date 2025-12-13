"use client";

import { RANKS, formatRange, getRank, getRankIndex, pointsDeltaFromPremises, requiredPremisesForRankIndex } from "@/rank/ranks";
import { useEffect, useMemo, useState } from "react";

const APP_STATE_KEY = "sllgms-v3-app-state";

function readPoints(): number {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (!raw) return 0;
    const obj = JSON.parse(raw);
    const p = (obj as any)?.rankPoints;
    return typeof p === "number" && Number.isFinite(p) ? Math.max(0, Math.floor(p)) : 0;
  } catch {
    return 0;
  }
}

export function RankMenu() {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    setPoints(readPoints());
    const onAppState = () => setPoints(readPoints());
    window.addEventListener("sllgms-app-state", onAppState as any);
    return () => window.removeEventListener("sllgms-app-state", onAppState as any);
  }, []);

  const rank = useMemo(() => getRank(points), [points]);
  const rankIndex = useMemo(() => getRankIndex(points), [points]);
  const requiredPremises = useMemo(() => requiredPremisesForRankIndex(rankIndex), [rankIndex]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ui-pill"
        title="Rank + points"
      >
        <span
          aria-hidden="true"
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: rank.color, boxShadow: "0 0 0 2px rgba(0,0,0,0.15) inset" }}
        />
        <span className="hidden sm:inline">{rank.name}</span>
        <span className="tabular-nums opacity-90">{points}</span>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] w-[360px] max-w-[92vw] z-[4500] ui-card shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Point ranks</div>
              <div className="mt-1 text-xs text-slate-300">
                Your points: <span className="text-slate-100 tabular-nums">{points}</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                At your rank, points only change on questions with{" "}
                <span className="text-slate-200 font-semibold">{requiredPremises}+</span> premises.
                Each question gives ±premises points (capped at{" "}
                <span className="text-slate-200 font-semibold">15</span>), never below 0.
              </div>
            </div>
            <button type="button" className="ui-pill" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <div className="mt-3 grid gap-1">
            {RANKS.map((r) => {
              const active = r.name === rank.name;
              return (
                <div
                  key={r.name}
                  className={[
                    "flex items-center justify-between gap-3 rounded-2xl border px-3 py-2",
                    active ? "border-cyan-300/25 bg-cyan-500/10" : "border-slate-800/60"
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2.5 w-2.5 rounded-full flex-none"
                      style={{ backgroundColor: r.color }}
                    />
                    <div className="text-sm font-semibold truncate">{r.name}</div>
                  </div>
                  <div className="text-xs text-slate-300 tabular-nums">{formatRange(r)}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-slate-400">
            Example: a 9-premise question changes points by{" "}
            <span className="text-slate-200 font-semibold">{pointsDeltaFromPremises(9)}</span>.
          </div>
        </div>
      ) : null}
    </div>
  );
}


