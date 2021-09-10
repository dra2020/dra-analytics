import * as U from '../../lib/utils/all'

import
{
  isASweep, radiansToDegrees,
  calcEfficiencyGap,
  calcMinimalInverseResponsiveness
} from '../../lib/partisan/all'


describe('Determine sweeps', () =>
{
  test('Sweep', () =>
  {
    expect(isASweep(1.0, 10)).toBe(true);
  });
  test('Sweep', () =>
  {
    expect(isASweep(10 - (1 / 10) + U.EPSILON, 10)).toBe(true);
  });
  test('Swept', () =>
  {
    expect(isASweep(0.0, 10)).toBe(true);
  });
  test('Swept', () =>
  {
    expect(isASweep((1 / 10 - U.EPSILON), 10)).toBe(true);
  });
})

describe('Convert radians to degrees', () =>
{
  test('Arctangent in degrees', () =>
  {
    expect(radiansToDegrees(Math.atan(1))).toBe(45);
  });
})

describe('Calculate efficiency gap', () =>
{
  // Source: https://planscore.org/north_carolina/#!2012-plan-ushouse-eg
  // Making sure the signs are right vs. precise results
  test('NC 2016', () =>
  {
    const Vf: number = 0.467;
    const Sf: number = 3 / 13;
    const EG: number = 0.194;
    expect(calcEfficiencyGap(Vf, Sf)).toBeCloseTo(EG, 1);
  });
  test('NC 2018', () =>
  {
    const Vf: number = 0.508;
    const Sf: number = 3 / 13;
    const EG: number = 0.277;
    expect(calcEfficiencyGap(Vf, Sf)).toBeCloseTo(EG, 1);
  });
})

describe('Calculate minimal inverse responsiveness', () =>
{
  // Based on hand calculating MIR based 'r' values in Nagle's Table 1
  test('Sample states', () =>
  {
    // "CA"
    expect(calcMinimalInverseResponsiveness(0.592091, 2.1)).toBeCloseTo(0.2762);
    // "MA"
    expect(calcMinimalInverseResponsiveness(0.600269, 1.9)).toBeCloseTo(0.3263);
    // "IL"
    expect(calcMinimalInverseResponsiveness(0.600068, 3.1)).toBeCloseTo(0.1226);
    // "MD"
    expect(calcMinimalInverseResponsiveness(0.593369, 1.0)).toBeCloseTo(0.8000);
    // "CO"
    expect(calcMinimalInverseResponsiveness(0.505561, 3.9)).toBeCloseTo(0.1564);
    // "PA"
    expect(calcMinimalInverseResponsiveness(0.529422, 4.1)).toBeCloseTo(0.1439);
    // "NC"
    expect(calcMinimalInverseResponsiveness(0.515036, 4.0)).toBeCloseTo(0.1500);
    // "OH"
    expect(calcMinimalInverseResponsiveness(0.513062, 4.5)).toBeCloseTo(0.1222);
    // "SC"
    expect(calcMinimalInverseResponsiveness(0.430028, 0.9)).toBeCloseTo(0.9111);
    // "TN"
    expect(calcMinimalInverseResponsiveness(0.415935, 0.8)).toBeCloseTo(1.0500);
    // "TX"
    expect(calcMinimalInverseResponsiveness(0.404324, 1.1)).toBeCloseTo(0.7091);
  });
  test('Edge cases', () =>
  {
    expect(calcMinimalInverseResponsiveness(0.50, 25)).toBeCloseTo(0.0);
  });
})