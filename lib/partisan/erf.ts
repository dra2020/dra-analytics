//
// Approximate ERF - https://en.wikipedia.org/wiki/Error_function#Numerical_approximations
//

export function approximateERF(x: number): number
{
  const n = Math.abs(x);

  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = 0.284496736 * -1;
  const a3 = 1.421413741;
  const a4 = 1.453152027 * -1;
  const a5 = 1.061405429;
  const t = 1 / (1 + (p * n));

  const erf = 1 - ((a1 * t) + (a2 * t ** 2) + (a3 * t ** 3) + (a4 * t ** 4) + (a5 * t ** 5)) * Math.E ** (-1 * n ** 2);

  return (x < 0) ? -erf : erf;
}

/* To validate this, you need to import mathjs.erf into a Jest test file and run these:

const {erf} = require('mathjs');

describe('mathjs.erf', () =>
{
  test('Probabilities', () =>
  {
    const places = 15;

    expect(erf(0.2)).toBeCloseTo(0.22270258921047847, places);
    expect(erf(-0.5)).toBeCloseTo(-0.5204998778130465, places);
    expect(erf(4)).toBeCloseTo(0.9999999845827421, places);
  });
});

describe('erf approximation', () =>
{
  test('Probabilities', () =>
  {
    const places = 6;

    expect(U.approximateERF(0.2)).toBeCloseTo(erf(0.2), places);
    expect(U.approximateERF(-0.5)).toBeCloseTo(erf(-0.5), places);
    expect(U.approximateERF(4)).toBeCloseTo(erf(4), places);
  });
});

*/
