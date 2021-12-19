import * as FU from '../../testutil/fileutils';

import
{
  makePopulationScorecard
} from '../../lib/equal/all';


describe('Population Deviation calculation', () =>
{
  const bLegislative = false;

  test('Equal', () =>
  {
    const byDistrict = [100, 100, 100, 100, 100];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(byDistrict, targetSize, bLegislative);
    expect(scorecard.deviation).toBeCloseTo(0.00);
  });
  test('10% deviation', () =>
  {
    const byDistrict = [105, 95, 100, 100, 100];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(byDistrict, targetSize, bLegislative);
    expect(scorecard.deviation).toBeCloseTo(0.10);
  });
  test('Empty', () =>
  {
    const byDistrict = [0, 0, 0, 0, 0];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(byDistrict, targetSize, bLegislative);
    expect(scorecard.deviation).toBeCloseTo(0.00);
  });
  test('One district', () =>
  {
    const byDistrict = [0, 105, 0, 0, 0];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(byDistrict, targetSize, bLegislative);
    expect(scorecard.deviation).toBeCloseTo(0.00);
  });
  test('Two districts', () =>
  {
    const byDistrict = [0, 0, 105, 95, 0];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(byDistrict, targetSize, bLegislative);
    expect(scorecard.deviation).toBeCloseTo(0.10);
  });
  test('(Report) Max deviation', () =>
  {
    const e /*: T.PopulationProfile */ = FU.readJSON('testdata/population/population-NC-116th.json');
    const byDistrict = e.byDistrict;
    const targetSize = e.targetSize;
    const scorecard = makePopulationScorecard(e.byDistrict, e.targetSize, bLegislative);
    expect(scorecard.notes['maxDeviation']).toBe(11693);
  });
  test('Extremely large deviation', () =>
  {
    const byDistrict = [485999, 620961, 971777, 863420, 167134, 287085, 549714, 1827462];
    const targetSize = 721694;
    const scorecard = makePopulationScorecard(byDistrict, targetSize, false);
    expect(scorecard.deviation).toBeCloseTo(2.3006);
  });
});

describe('MMD Population Deviations', () =>
{
  const bLegislative = true;

  test('SMD no deviation', () =>
  {
    const popByDistrict = [100, 100, 100, 100, 100];
    const repsByDistrict = [1, 1, 1, 1, 1];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(popByDistrict, targetSize, bLegislative, repsByDistrict);
    expect(scorecard.deviation).toBeCloseTo(0.00);
    expect(scorecard.roughlyEqual).toBe(true);
  });
  test('SMD no deviation', () =>
  {
    const popByDistrict = [110, 90, 100, 100, 100];
    const repsByDistrict = [1, 1, 1, 1, 1];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(popByDistrict, targetSize, bLegislative, repsByDistrict);
    expect(scorecard.deviation).toBeCloseTo(0.20);
    expect(scorecard.roughlyEqual).toBe(false);
  });
  test('MMD deviation - all non-empty', () =>
  {
    const popByDistrict = [210, 90, 300, 300, 100];
    const repsByDistrict = [2, 1, 3, 3, 1];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(popByDistrict, targetSize, bLegislative, repsByDistrict);
    expect(scorecard.deviation).toBeCloseTo(0.15);
    expect(scorecard.roughlyEqual).toBe(false);
  });
  test('MMD deviation - only one non-empty', () =>
  {
    const popByDistrict = [0, 105, 0, 0, 0];
    const repsByDistrict = [2, 1, 3, 3, 1];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(popByDistrict, targetSize, bLegislative, repsByDistrict);
    expect(scorecard.deviation).toBeCloseTo(0.0);
    expect(scorecard.roughlyEqual).toBe(false);
  });
  test('MMD deviation - multiple non-empty', () =>
  {
    const popByDistrict = [0, 0, 315, 300, 0];
    const repsByDistrict = [2, 1, 3, 3, 1];
    const targetSize = 100;
    const scorecard = makePopulationScorecard(popByDistrict, targetSize, bLegislative, repsByDistrict);
    expect(scorecard.deviation).toBeCloseTo(0.05);
    expect(scorecard.roughlyEqual).toBe(true);
  });
});