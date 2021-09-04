//
// dotProduct - cloned from poly/matrix.ts, to avoid needing mathjs
//

export type Vector = number[];                // A general vector or a row or a column


export function dotProduct(a: Vector, b: Vector): number
{
  protect((a.length > 0) && (a.length == b.length), "In dotProduct, the vectors aren't the same length. ");

  return a.map((value, i) => value * b[i]).reduce((acc, val) => acc + val, 0);
};

function protect(condition: boolean, message: string): void
{
  if (!condition)
    throw new Error(message);
}
