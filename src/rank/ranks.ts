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
  "Absolute III",
  // 16. Singularity
  "Singularity I",
  "Singularity II",
  "Singularity III",
  // 17. Infinity
  "Infinity I",
  "Infinity II",
  "Infinity III",
  // 18. Eternity
  "Eternity I",
  "Eternity II",
  "Eternity III",
  // 19. Omniscience
  "Omniscience I",
  "Omniscience II",
  "Omniscience III",
  // 20. Aether
  "Aether I",
  "Aether II",
  "Aether III",
  // 21. Dimension
  "Dimension I",
  "Dimension II",
  "Dimension III",
  // 22. Continuum
  "Continuum I",
  "Continuum II",
  "Continuum III",
  // 23. Supernal
  "Supernal I",
  "Supernal II",
  "Supernal III",
  // 24. Zenith
  "Zenith I",
  "Zenith II",
  "Zenith III",
  // 25. Origin
  "Origin I",
  "Origin II",
  "Origin III"
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
  "#f0abfc", "#e879f9", "#d946ef",
  // 16. Singularity (red)
  "#fca5a5", "#f87171", "#ef4444",
  // 17. Infinity (indigo)
  "#c7d2fe", "#818cf8", "#6366f1",
  // 18. Eternity (violet)
  "#ddd6fe", "#a78bfa", "#8b5cf6",
  // 19. Omniscience (pink)
  "#fbcfe8", "#f472b6", "#ec4899",
  // 20. Aether (zinc)
  "#d4d4d8", "#a1a1aa", "#71717a",
  // 21. Dimension (slate-dark)
  "#475569", "#1e293b", "#0f172a",
  // 22. Continuum (indigo-dark)
  "#4338ca", "#312e81", "#1e1b4b",
  // 23. Supernal (amber-dark)
  "#b45309", "#78350f", "#451a03",
  // 24. Zenith (rose-dark)
  "#be123c", "#881337", "#4c0519",
  // 25. Origin (gray-darkest)
  "#1f2937", "#111827", "#030712"
] as const;

// Exponential rank scaling for first 45 ranks up to 1,000,000 points
const BASE_RANK_COUNT = 45;
const MAX_BASE_POINTS = 1_000_000;
const EXPONENTIAL_FACTOR = 0.12;

function getExponentialPoints(rankIndex: number): number {
  if (rankIndex === 0) return 0;
  // We want the 45th rank (Absolute III) to end at 1,000,000.
  // This means getExponentialPoints(45) should be 1,000,000.
  const maxExp = Math.exp(EXPONENTIAL_FACTOR * BASE_RANK_COUNT) - 1;
  const currentExp = Math.exp(EXPONENTIAL_FACTOR * rankIndex) - 1;
  return Math.round(MAX_BASE_POINTS * currentExp / maxExp);
}

const EXTENDED_RANK_POINTS = [
  1_000_000, 1_128_000, 1_272_384, // Singularity
  1_435_249, 1_618_961, 1_826_188, // Infinity
  2_059_940, 2_323_612, 2_621_034, // Eternity
  2_956_527, 3_334_962, 3_761_837, // Omniscience
  4_243_352, 4_786_501, 5_399_173, // Aether
  6_090_268, 6_869_822, 7_749_159, // Dimension
  8_741_051, 9_859_906, 11_121_974, // Continuum
  12_545_587, 14_151_422, 15_962_804, // Supernal
  18_006_043, 20_310_816, 22_910_601, // Zenith
  25_843_158, 29_151_082, 32_882_421  // Origin
];

export const RANKS: RankDef[] = (() => {
  const out: RankDef[] = [];
  for (let i = 0; i < RANK_NAMES.length; i++) {
    const name = RANK_NAMES[i];
    const color = RANK_COLORS[i];
    let min: number;
    let max: number | null;

    if (i < BASE_RANK_COUNT) {
      min = getExponentialPoints(i);
      max = getExponentialPoints(i + 1);
    } else {
      const extIdx = i - BASE_RANK_COUNT;
      min = EXTENDED_RANK_POINTS[extIdx];
      const isLast = extIdx === EXTENDED_RANK_POINTS.length - 1;
      max = isLast ? null : EXTENDED_RANK_POINTS[extIdx + 1];
    }

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


