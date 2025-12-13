export function gqFromPremises(premises: number): number {
  // Spec: 2 premises => 85 GQ, 9 premises => 145 GQ.
  // Linear interpolation in between, clamped.
  const p = Math.max(2, Math.min(9, premises));
  const gq = 85 + ((p - 2) * (145 - 85)) / (9 - 2);
  return Math.round(gq);
}


