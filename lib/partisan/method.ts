//
// METHODOLOGY SUPPORT
//

export function fptpWin(demPct: number): number
{
  // Vote shares should be fractions in the range [0.0 – 1.0]
  //assert((demPct <= 1.0) && (demPct >= 0.0));

  return ((demPct > 0.5) ? 1 : 0);
}