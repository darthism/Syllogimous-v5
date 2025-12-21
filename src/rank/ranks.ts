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
  // 1. Instinct
  "Instinct I",
  "Instinct II",
  "Instinct III",
  // 2. Awareness
  "Awareness I",
  "Awareness II",
  "Awareness III",
  // 3. Reason
  "Reason I",
  "Reason II",
  "Reason III",
  // 4. Intellect
  "Intellect I",
  "Intellect II",
  "Intellect III",
  // 5. Logic
  "Logic I",
  "Logic II",
  "Logic III",
  // 6. Insight
  "Insight I",
  "Insight II",
  "Insight III",
  // 7. Genius
  "Genius I",
  "Genius II",
  "Genius III",
  // 8. Mastermind
  "Mastermind I",
  "Mastermind II",
  "Mastermind III",
  // 9. Paragon
  "Paragon I",
  "Paragon II",
  "Paragon III",
  // 10. Oracle
  "Oracle I",
  "Oracle II",
  "Oracle III",
  // 11. Transcendent
  "Transcendent I",
  "Transcendent II",
  "Transcendent III",
  // 12. Celestial
  "Celestial I",
  "Celestial II",
  "Celestial III",
  // 13. Cosmic
  "Cosmic I",
  "Cosmic II",
  "Cosmic III",
  // 14. Primordial
  "Primordial I",
  "Primordial II",
  "Primordial III",
  // 15. Absolute
  "Absolute I",
  "Absolute II",
  "Absolute III"
] as const;

const RANK_COLORS = [
  // 1. Instinct (gray/slate)
  "#94a3b8", "#64748b", "#475569",
  // 2. Awareness (stone/warm gray)
  "#a8a29e", "#78716c", "#57534e",
  // 3. Reason (blue)
  "#93c5fd", "#60a5fa", "#3b82f6",
  // 4. Intellect (sky)
  "#7dd3fc", "#38bdf8", "#0ea5e9",
  // 5. Logic (cyan)
  "#67e8f9", "#22d3ee", "#06b6d4",
  // 6. Insight (teal)
  "#5eead4", "#2dd4bf", "#14b8a6",
  // 7. Genius (emerald)
  "#6ee7b7", "#34d399", "#10b981",
  // 8. Mastermind (green)
  "#86efac", "#4ade80", "#22c55e",
  // 9. Paragon (lime)
  "#bef264", "#a3e635", "#84cc16",
  // 10. Oracle (yellow)
  "#fde047", "#facc15", "#eab308",
  // 11. Transcendent (amber)
  "#fcd34d", "#fbbf24", "#f59e0b",
  // 12. Celestial (orange)
  "#fdba74", "#fb923c", "#f97316",
  // 13. Cosmic (rose)
  "#fda4af", "#fb7185", "#f43f5e",
  // 14. Primordial (purple)
  "#d8b4fe", "#c084fc", "#a855f7",
  // 15. Absolute (fuchsia/pink)
  "#f0abfc", "#e879f9", "#d946ef"
] as const;

// Linear rank scaling from 0 to 1,000,000 points
// Each rank spans approximately 22,222 points (1,000,000 / 45 ranks)
const MAX_POINTS = 1_000_000;
const POINTS_PER_RANK = Math.floor(MAX_POINTS / RANK_NAMES.length);
export const RANKS: RankDef[] = (() => {
  const out: RankDef[] = [];
  for (let i = 0; i < RANK_NAMES.length; i++) {
    const name = RANK_NAMES[i];
    const color = RANK_COLORS[i];
    const isLast = i === RANK_NAMES.length - 1;
    const min = i * POINTS_PER_RANK;
    const max = isLast ? null : (i + 1) * POINTS_PER_RANK;
    out.push({ name, min, max, color });
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
  // Cap max point gain/loss at 2050.
  return Math.max(1, Math.min(2050, Math.round(raw)));
}


