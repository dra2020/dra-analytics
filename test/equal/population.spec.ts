import * as FU from '../../testutil/fileutils';

import
{
  doPopulationDeviation
} from '../../lib/equal/population';

// import * as T from '../../lib/types/population'; DELETE

describe('Population Deviation calculation', () =>
{
  const bLegislative = false;

  test('Equal', () =>
  {
    const byDistrict = [100, 100, 100, 100, 100];
    const targetSize = 100;
    const popdevS = doPopulationDeviation(byDistrict, targetSize, bLegislative);
    expect(popdevS.deviation).toBeCloseTo(0.00);
  });
  test('10% deviation', () =>
  {
    // const e: T.PopulationProfile = {"byDistrict": [105, 95, 100, 100, 100], "targetSize": 100};
    const byDistrict = [105, 95, 100, 100, 100];
    const targetSize = 100;
    const popdevS = doPopulationDeviation(byDistrict, targetSize, bLegislative);
    expect(popdevS.deviation).toBeCloseTo(0.10);
  });
  test('Empty', () =>
  {
    // const e: T.PopulationProfile = {"byDistrict": [0, 0, 0, 0, 0], "targetSize": 100};
    const byDistrict = [0, 0, 0, 0, 0];
    const targetSize = 100;
    const popdevS = doPopulationDeviation(byDistrict, targetSize, bLegislative);
    expect(popdevS.deviation).toBeCloseTo(0.00);
  });
  test('One district', () =>
  {
    // const e: T.PopulationProfile = {"byDistrict": [0, 105, 0, 0, 0], "targetSize": 100};
    const byDistrict = [0, 105, 0, 0, 0];
    const targetSize = 100;
    const popdevS = doPopulationDeviation(byDistrict, targetSize, bLegislative);
    expect(popdevS.deviation).toBeCloseTo(0.00);
  });
  test('Two districts', () =>
  {
    // const e: T.PopulationProfile = {"byDistrict": [0, 0, 105, 95, 0], "targetSize": 100};
    const byDistrict = [0, 0, 105, 95, 0];
    const targetSize = 100;
    const popdevS = doPopulationDeviation(byDistrict, targetSize, bLegislative);
    expect(popdevS.deviation).toBeCloseTo(0.10);
  });
  test('(Report) Max deviation', () =>
  {
    const e /*: T.PopulationProfile */ = FU.readJSON('testdata/population/population-NC-116th.json');
    const byDistrict = e.byDistrict;
    const targetSize = e.targetSize;
    const popdevS = doPopulationDeviation(e.byDistrict, e.targetSize, bLegislative);
    expect(popdevS.notes['maxDeviation']).toBe(11693);
  });
  test('Extremely large deviation', () =>
  {
    // const e: T.PopulationProfile = {"byDistrict": [485999, 620961, 971777, 863420, 167134, 287085, 549714, 1827462], "targetSize": 721694};
    const byDistrict = [485999, 620961, 971777, 863420, 167134, 287085, 549714, 1827462];
    const targetSize = 721694;
    const popdevS = doPopulationDeviation(byDistrict, targetSize, false);
    expect(popdevS.deviation).toBeCloseTo(2.3006);
  });
});