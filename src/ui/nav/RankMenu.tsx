"use client";

import {
  RANKS,
  formatRange,
  getRank,
  getRankIndex,
  pointsMagnitude
} from "@/rank/ranks";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setPoints(readPoints());
    const onAppState = () => setPoints(readPoints());
    window.addEventListener("sllgms-app-state", onAppState as any);
    return () => window.removeEventListener("sllgms-app-state", onAppState as any);
  }, []);

  const rank = useMemo(() => getRank(points), [points]);

  function computePos() {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelWidth = 360;
    const gap = 8;
    const vw = window.innerWidth;
    const left = Math.max(8, Math.min(r.left, vw - panelWidth - 8));
    const top = Math.min(window.innerHeight - 24, r.bottom + gap);
    setPos({ left, top, width: panelWidth });
  }

  useEffect(() => {
    if (!open) return;
    computePos();
    const onResize = () => computePos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        ref={btnRef}
        onClick={() => {
          setOpen((v) => !v);
        }}
        className="ui-pill"
        title={`${rank.name} • ${points} pts`}
        aria-label={`${rank.name} • ${points} points`}
      >
        <span
          aria-hidden="true"
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: rank.color, boxShadow: "0 0 0 2px rgba(0,0,0,0.15) inset" }}
        />
        <span className="hidden sm:inline">{rank.name}</span>
      </button>

      {mounted && open && pos
        ? createPortal(
            <div style={{ position: "fixed", inset: 0, zIndex: 5000 }}>
              <div
                style={{ position: "fixed", inset: 0, background: "transparent" }}
                onMouseDown={() => setOpen(false)}
                onClick={() => setOpen(false)}
              />
              <div
                className="ui-card shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] backdrop-blur-md"
                style={{
                  position: "fixed",
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  maxWidth: "92vw"
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Point ranks</div>
                    <div className="mt-1 text-xs text-slate-300">
                      Your points: <span className="text-slate-100 tabular-nums">{points}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      Base points are ±(2^premises), multiplied by speed (1× at ≥20s, up to 2× at 10s),
                      and carousel adds ±20%. Total never below 0.
                    </div>
                  </div>
                  <button type="button" className="ui-pill" onClick={() => setOpen(false)}>
                    Close
                  </button>
                </div>

                <div className="mt-3 grid gap-1 max-h-[46vh] overflow-y-auto pr-1 no-scrollbar">
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
                  Example: a 9-premise question at 10s changes points by{" "}
                  <span className="text-slate-200 font-semibold">
                    {pointsMagnitude({ premiseCount: 9, elapsedSeconds: 10, carouselEnabled: false })}
                  </span>
                  {" "} (×2 speed). Carousel adds about +20%:{" "}
                  <span className="text-slate-200 font-semibold">
                    {pointsMagnitude({ premiseCount: 9, elapsedSeconds: 10, carouselEnabled: true })}
                  </span>
                  .
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}


