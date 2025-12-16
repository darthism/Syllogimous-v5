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
  "Bloom I",
  "Bloom II",
  "Bloom III",
  "Focus I",
  "Focus II",
  "Focus III",
  "Insight I",
  "Insight II",
  "Insight III",
  "Intuition I",
  "Intuition II",
  "Intuition III",
  "Legend I",
  "Legend II",
  "Legend III"
] as const;

const RANK_COLORS = [
  // Bloom League (green tones)
  "#86efac", // green-300
  "#4ade80", // green-400
  "#22c55e", // green-500
  // Focus League (blue tones)
  "#93c5fd", // blue-300
  "#60a5fa", // blue-400
  "#3b82f6", // blue-500
  // Insight League (purple tones)
  "#d8b4fe", // purple-300
  "#c084fc", // purple-400
  "#a855f7", // purple-500
  // Intuition League (amber/gold tones)
  "#fcd34d", // amber-300
  "#fbbf24", // amber-400
  "#f59e0b", // amber-500
  // Legend League (rose/red tones)
  "#fda4af", // rose-300
  "#fb7185", // rose-400
  "#f43f5e"  // rose-500
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
 * Rule: At the nth rank (1-based), you only earn/lose points if the question has (n+1) premises or more.
 * We model ranks as 0-based index -> required premises = index + 2.
 */
export function requiredPremisesForRankIndex(rankIndex: number): number {
  return Math.max(1, Math.floor(rankIndex) + 2);
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
  // Clamp to keep within signed 32-bit-ish magnitude even if multiplied.
  return Math.max(1, Math.min(2_000_000_000, Math.round(raw)));
}


