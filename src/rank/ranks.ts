export type RankDef = {
  name: string;
  /** inclusive */
  min: number;
  /** exclusive; null means "no upper bound" */
  max: number | null;
  /** hex color for the dot */
  color: string;
};

export const RANKS: RankDef[] = [
  { name: "Adept", min: 0, max: 250, color: "#94a3b8" }, // slate-400
  { name: "Scholar", min: 250, max: 500, color: "#60a5fa" }, // blue-400
  { name: "Savant", min: 500, max: 750, color: "#22d3ee" }, // cyan-400
  { name: "Expert", min: 750, max: 1000, color: "#34d399" }, // emerald-400
  { name: "Mastermind", min: 1000, max: 1250, color: "#a3e635" }, // lime-400
  { name: "Visionary", min: 1250, max: 1500, color: "#fbbf24" }, // amber-400
  { name: "Genius", min: 1500, max: 1750, color: "#fb923c" }, // orange-400
  { name: "Virtuoso", min: 1750, max: 2000, color: "#fb7185" }, // rose-400
  { name: "Luminary", min: 2000, max: 2250, color: "#f472b6" }, // pink-400
  { name: "Prodigy", min: 2250, max: 2500, color: "#c084fc" }, // purple-400
  { name: "Oracle", min: 2500, max: 2750, color: "#a78bfa" }, // violet-400
  { name: "Sage", min: 2750, max: 3000, color: "#818cf8" }, // indigo-400
  { name: "Philosopher", min: 3000, max: 3250, color: "#38bdf8" }, // sky-400
  { name: "Mystic", min: 3250, max: 3500, color: "#2dd4bf" }, // teal-400
  { name: "Transcendent", min: 3500, max: null, color: "#f0abfc" } // fuchsia-300
];

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
  if (r.max == null) return `${r.min}+ pts`;
  return `${r.min}–${r.max} pts`;
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
  return Math.min(15, n);
}


