import * as T from '../../lib/types/minority'
import * as U from '../../lib/utils/all';
// import * as C from '../../lib/rate/dra-config';

import * as FU from '../../testutil/fileutils';
import '../../testutil/match-closeto-array';

import
{
  makeMinorityScorecard, convertTableToArray,
  estMinorityOpportunity,
  calcDistrictsByDemo,
  calcProportionalDistricts
} from '../../lib/minority/minority';


describe('Proportional # of minority districts', () =>
{
  const nDistricts = 10;
  test('Zero', () =>
  {
    expect(calcProportionalDistricts(0.0, nDistricts)).toBe(0);
  });
  test('Not quite one', () =>
  {
    expect(calcProportionalDistricts((1 / nDistricts) - 0.05 - U.EPSILON, nDistricts)).toBe(0);
  });
  test('One', () =>
  {
    expect(calcProportionalDistricts(1 / nDistricts, nDistricts)).toBe(1);
  });
  test('Not quite two', () =>
  {
    expect(calcProportionalDistricts((2 * (1 / nDistricts)) - 0.05 - U.EPSILON, nDistricts)).toBe(1);
  });

  test('Two', () =>
  {
    expect(calcProportionalDistricts(2 * (1 / nDistricts), nDistricts)).toBe(2);
  });
});

describe('Estimate minority opportunity', () =>
{
  test('35%', () =>
  {
    expect(estMinorityOpportunity(0.3500)).toBeCloseTo(0.0);
  });
  test('37%', () =>
  {
    expect(estMinorityOpportunity(0.3700)).toBeCloseTo(0.6914624612740132);
  });
  test('38%', () =>
  {
    expect(estMinorityOpportunity(0.3800)).toBeCloseTo(0.773372647623132);
  });
  test('49%', () =>
  {
    expect(estMinorityOpportunity(0.4900)).toBeCloseTo(0.9997673709209645);
  });
  test('50%', () =>
  {
    expect(estMinorityOpportunity(0.5000)).toBeCloseTo(0.9999115827147992);
  });
  test('51%', () =>
  {
    expect(estMinorityOpportunity(0.5100)).toBeCloseTo(0.9999683287581669);
  });
  test('90%', () =>
  {
    expect(estMinorityOpportunity(0.9000)).toBeCloseTo(1.0);
  });
})

describe('Evaluate TX minority opportunity', () =>
{
  const p = FU.readJSON('testdata/CD116/profile-TX-CD116.json');
  test('Proportional districts by demographic', () =>
  {
    const N = p.nDistricts;
    const statewide = Object.values(p.demographics.statewide).slice(1) as number[];
    const correct = [18, 4, 12, 0, 2, 0];
    expect(calcDistrictsByDemo(statewide, N)).toBeArrayWithValuesCloseTo(correct);
  });
  const mS: T.MinorityScorecard = makeMinorityScorecard(p.demographics.statewide, p.demographics.byDistrict);
  const a: number[][] = convertTableToArray(mS.pivotByDemographic);
  test('Pivot by demographic', () =>
  {
    const correct = [
      [5, 4, 2, 2, 0, 12, 0.5036, 18],  // Minority
      [1, 1, 1, 0, 0, 0, 0.1201, 4],    // Black
      [0, 0, 1, 0, 1, 8, 0.3361, 12],   // Hispanic
      [0, 0, 0, 0, 0, 0, 0.0017, 0],    // Pacific
      [0, 0, 0, 0, 0, 0, 0.0439, 2],    // Asian
      [0, 0, 0, 0, 0, 0, 0.0119, 0]     // Native
    ];
    expect(a).toBeArrayWithValuesCloseTo(correct);
  });
  test('Estimate opportunity & coalition districts', () =>
  {
    expect(mS.opportunityDistricts).toBeCloseTo(12.56);
    expect(mS.proportionalOpportunities).toBeCloseTo(18);
    expect(mS.coalitionDistricts).toBeCloseTo(22.92);
    expect(mS.proportionalCoalitions).toBeCloseTo(18);
  });
});
