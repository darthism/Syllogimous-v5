export type RankDef = {
  name: string;
  /** inclusive */
  min: number;
  /** exclusive; null means "no upper bound" */
  max: number | null;
  /** hex color for the dot */
  color: string;
};

const RANK_NAMES = [
  "Wolf I",
  "Wolf II",
  "Wolf III",
  "Demon I",
  "Demon II",
  "Demon III",
  "Dragon I",
  "Dragon II",
  "Dragon III",
  "God I",
  "God II",
  "God III"
] as const;

const RANK_COLORS = [
  // Wolf League (slate/silver tones)
  "#94a3b8", // slate-400
  "#64748b", // slate-500
  "#475569", // slate-600
  // Demon League (red/crimson tones)
  "#fca5a5", // red-300
  "#f87171", // red-400
  "#ef4444", // red-500
  // Dragon League (amber/gold tones)
  "#fcd34d", // amber-300
  "#fbbf24", // amber-400
  "#f59e0b", // amber-500
  // God League (violet/divine tones)
  "#c4b5fd", // violet-300
  "#a78bfa", // violet-400
  "#8b5cf6"  // violet-500
] as const;

// Rank ranges double in size:
// Adept: 0-250 (width 250)
// Scholar: 250-750 (width 500)
// Savant: 750-1750 (width 1000)
// ...
const BASE_RANGE = 250;
export const RANKS: RankDef[] = (() => {
  const out: RankDef[] = [];
  let min = 0;
  for (let i = 0; i < RANK_NAMES.length; i++) {
    const name = RANK_NAMES[i];
    const color = RANK_COLORS[i];
    const isLast = i === RANK_NAMES.length - 1;
    const width = BASE_RANGE * 2 ** i;
    const max = isLast ? null : min + width;
    out.push({ name, min, max, color });
    if (max != null) min = max;
  }
  return out;
})();

export function getRankIndex(points: number): number {
  const p = Number.isFinite(points) ? points : 0;
  for (let i = 0; i < RANKS.length; i++) {
    const r = RANKS[i];
    if (p >= r.min && (r.max == null || p < r.max)) return i;
  }
  return 0;
}

export function getRank(points: number): RankDef {
  return RANKS[getRankIndex(points)];
}

export function formatRange(r: RankDef): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
  if (r.max == null) return `${fmt.format(r.min)}+ pts`;
  return `${fmt.format(r.min)}–${fmt.format(r.max)} pts`;
}

/**
 * Previously required higher premise counts at higher ranks.
 * Now removed: all questions with 1+ premises qualify for points at any rank.
 */
export function requiredPremisesForRankIndex(_rankIndex: number): number {
  return 1;
}

export function pointsDeltaFromPremises(premiseCount: number): number {
  const n = Math.floor(premiseCount);
  if (!Number.isFinite(n) || n <= 0) return 0;
  // Base points are 2^n. To keep values safe in JS/DB, cap exponent at 30 (2^30 ~ 1.07B).
  const exp = Math.min(30, n);
  return 2 ** exp;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Speed multiplier:
 * - 20+ seconds -> 1x
 * - 10 seconds -> 2x (because 20 / 10 = 2)
 * We clamp to [10s, 20s] so the multiplier stays within [1x, 2x].
 */
export function timeMultiplierFromSeconds(elapsedSeconds: number): number {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) return 1;
  const t = clamp(elapsedSeconds, 10, 20);
  return 20 / t;
}

/**
 * Final point magnitude for a question, before applying sign:
 * - Base is ±min(premises, 15)
 * - Multiply by speed factor (1x..2x)
 * - If carousel mode is enabled, apply a ±20% modifier (same magnitude for gains/losses)
 */
export function pointsMagnitude({
  premiseCount,
  elapsedSeconds,
  carouselEnabled
}: {
  premiseCount: number;
  elapsedSeconds: number;
  carouselEnabled: boolean;
}): number {
  const base = pointsDeltaFromPremises(premiseCount);
  if (!base) return 0;
  const speed = timeMultiplierFromSeconds(elapsedSeconds);
  const carousel = carouselEnabled ? 1.2 : 1.0;
  const raw = base * speed * carousel;
  // Keep integer points; round to nearest.
  // Cap max point gain/loss at 850.
  return Math.max(1, Math.min(850, Math.round(raw)));
}


