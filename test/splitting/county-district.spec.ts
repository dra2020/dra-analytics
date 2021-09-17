import * as T from '../../lib/types/all'
import * as U from '../../lib/utils/all';
import * as C from '../../lib/rate/dra-config';

import * as FU from '../../testutil/fileutils';
import '../../testutil/match-closeto-array';

import
{
  splitScore,
  reduceCSplits, reduceDSplits,
  calcCountyWeights, calcDistrictWeights,
  calcCountyFractions, calcDistrictFractions,
  countySplitScore, districtSplitScore,
  countySplitting, districtSplitting,
  doCountySplitting, doDistrictSplitting,
  calcCountySplitting, calcDistrictSplitting,
  totalCounties, totalDistricts
} from '../../lib/splitting/county-district';


describe('Roughly equal', () =>
{
  const x = 100;
  test('Equal', () =>
  {
    expect(U.areRoughlyEqual(x, x, U.EQUAL_TOLERANCE)).toBe(true);
  });
  test('Barely different', () =>
  {
    expect(U.areRoughlyEqual(x, x + U.EPSILON, U.EQUAL_TOLERANCE)).toBe(true);
  });
  test('Barely equal', () =>
  {
    expect(U.areRoughlyEqual(x, x + (U.AVERAGE_BLOCK_SIZE / 2) - U.EPSILON, U.EQUAL_TOLERANCE)).toBe(true);
  });
  test('Barely not equal', () =>
  {
    expect(U.areRoughlyEqual(x, x + (U.AVERAGE_BLOCK_SIZE / 2), U.EQUAL_TOLERANCE)).toBe(false);
  });
  test('Different', () =>
  {
    expect(U.areRoughlyEqual(x, x * 2, U.EQUAL_TOLERANCE)).toBe(false);
  });
});

// These tests replicate the examples at the end of Section 6.1.1 of Moon Duchin's Appendix.
describe('Split scores', () =>
{
  // split_score([97, 3])             # A = 1.16
  test('A', () =>
  {
    expect(splitScore([97 / 100, 3 / 100])).toBeCloseTo(1.16);
  });
  // split_score([88, 12])            # B = 1.28
  test('B', () =>
  {
    expect(splitScore([88 / 100, 12 / 100])).toBeCloseTo(1.28);
  });
  // split_score([50, 50])            # C = 1.41
  test('C', () =>
  {
    expect(splitScore([50 / 100, 50 / 100])).toBeCloseTo(1.41);
  });
  // split_score([96, 2, 2])          # D = 1.26
  test('D', () =>
  {
    expect(splitScore([96 / 100, 2 / 100, 2 / 100])).toBeCloseTo(1.26);
  });
  // split_score([50, 25, 25])        # E = 1.71
  test('E', () =>
  {
    expect(splitScore([50 / 100, 25 / 100, 25 / 100])).toBeCloseTo(1.71);
  });
  // split_score([33.3, 33.3, 33.3])  # F = 1.73
  test('F', () =>
  {
    expect(splitScore([33.3 / 100, 33.3 / 100, 33.3 / 100])).toBeCloseTo(1.73);
  });
  // split_score([25, 25, 25, 25])    # G = 2.00
  test('G', () =>
  {
    expect(splitScore([25 / 100, 25 / 100, 25 / 100, 25 / 100])).toBeCloseTo(2.0);
  });

  // No splits
  test('No splits', () =>
  {
    expect(splitScore([])).toBeCloseTo(1.0);
  });
});


// Examples from P. 2 of Moon Duchin's Appendix
describe('Lefthand example', () =>
{
  const CxD: T.CxD = [
    [40, 40, 20, 0, 0, 0, 0],
    [0, 0, 20, 80, 0, 0, 0],
    [0, 0, 0, 0, 88, 12, 0],
    [0, 0, 0, 0, 0, 20, 80]
  ];

  const countyTotals: number[] = [40, 40, 40, 80, 88, 32, 80];

  const fCorrect: number[][] = [
    [1.0, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 1.0, 0.375, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.625, 1.0]
  ];
  const wCorrect = [0.1, 0.1, 0.1, 0.2, 0.22, 0.08, 0.2];

  const f = calcCountyFractions(CxD, countyTotals);
  const w = calcCountyWeights(countyTotals);

  test('Calculate county fractions', () =>
  {
    expect(f).toEqual(fCorrect);
  });
  test('Calculate county weights', () =>
  {
    expect(w).toEqual(wCorrect);
  });
  test('Calculate county split scores', () =>
  {
    expect(countySplitScore(0, fCorrect)).toBeCloseTo(1.0);
    expect(countySplitScore(1, fCorrect)).toBeCloseTo(1.0);
    expect(countySplitScore(2, fCorrect)).toBeCloseTo(1.4142);
    expect(countySplitScore(3, fCorrect)).toBeCloseTo(1.0);
    expect(countySplitScore(4, fCorrect)).toBeCloseTo(1.0);
    expect(countySplitScore(5, fCorrect)).toBeCloseTo(1.4029);
    expect(countySplitScore(6, fCorrect)).toBeCloseTo(1.0);
  });
  test('County splitting (SqEnt_DC)', () =>
  {
    expect(countySplitting(f, w)).toBeCloseTo(1.0737);
  });
  test('Do county splitting', () =>
  {
    expect(doCountySplitting(CxD, countyTotals)).toBeCloseTo(1.0737);
  });

  const districtTotals: number[] = [100, 100, 100, 100];

  const gCorrect: number[][] = [
    [0.4, 0.4, 0.2, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.2, 0.8, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.88, 0.12, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.8]
  ];
  const xCorrect = [0.25, 0.25, 0.25, 0.25];

  const g = calcDistrictFractions(CxD, districtTotals);
  const x = calcDistrictWeights(districtTotals);

  test('Calculate district fractions', () =>
  {
    expect(g).toEqual(gCorrect);
  });
  test('Calculate districts weights', () =>
  {
    expect(x).toEqual(xCorrect);
  });
  test('Calculate district split scores', () =>
  {
    expect(districtSplitScore(0, gCorrect)).toBeCloseTo(1.7121);
    expect(districtSplitScore(1, gCorrect)).toBeCloseTo(1.3416);
    expect(districtSplitScore(2, gCorrect)).toBeCloseTo(1.2845);
    expect(districtSplitScore(3, gCorrect)).toBeCloseTo(1.3416);
  });
  test('District splitting (SqEnt_CD)', () =>
  {
    expect(districtSplitting(g, x)).toBeCloseTo(1.4200);
  });
  test('Do district splitting', () =>
  {
    expect(doDistrictSplitting(CxD, districtTotals)).toBeCloseTo(1.4200);
  });
});

describe('Righthand example', () =>
{
  const CxD: T.CxD = [
    [50, 30, 20, 0],
    [0, 60, 20, 20],
    [0, 0, 20, 80],
    [0, 0, 20, 80]
  ];

  const countyTotals: number[] = [50, 90, 80, 180];

  const fCorrect: number[][] = [
    [1.0, 0.3333333333333333, 0.25, 0.0],
    [0.0, 0.6666666666666666, 0.25, 0.1111111111111111],
    [0.0, 0.0, 0.25, 0.4444444444444444],
    [0.0, 0.0, 0.25, 0.4444444444444444]
  ];
  const wCorrect = [0.125, 0.225, 0.2, 0.45];

  const f = calcCountyFractions(CxD, countyTotals);
  const w = calcCountyWeights(countyTotals);

  test('Calculate county fractions', () =>
  {
    expect(f).toEqual(fCorrect);
  });
  test('Calculate county weights', () =>
  {
    expect(w).toEqual(wCorrect);
  });
  test('Calculate county split scores', () =>
  {
    expect(countySplitScore(0, fCorrect)).toBeCloseTo(1.0);
    expect(countySplitScore(1, fCorrect)).toBeCloseTo(1.3938);
    expect(countySplitScore(2, fCorrect)).toBeCloseTo(2, 0);
    expect(countySplitScore(3, fCorrect)).toBeCloseTo(1.6667);
  });
  test('County splitting (SqEnt_DC)', () =>
  {
    expect(countySplitting(f, w)).toBeCloseTo(1.5886);
  });
  test('Do county splitting', () =>
  {
    expect(doCountySplitting(CxD, countyTotals)).toBeCloseTo(1.5886);
  });

  const districtTotals: number[] = [100, 100, 100, 100];

  const gCorrect: number[][] = [
    [0.5, 0.3, 0.2, 0.0],
    [0.0, 0.6, 0.2, 0.2],
    [0.0, 0.0, 0.2, 0.8],
    [0.0, 0.0, 0.2, 0.8]
  ];
  const xCorrect = [0.25, 0.25, 0.25, 0.25];

  const g = calcDistrictFractions(CxD, districtTotals);
  const x = calcDistrictWeights(districtTotals);

  test('Calculate district fractions', () =>
  {
    expect(g).toEqual(gCorrect);
  });
  test('Calculate districts weights', () =>
  {
    expect(x).toEqual(xCorrect);
  });
  test('Calculate district split scores', () =>
  {
    expect(districtSplitScore(0, gCorrect)).toBeCloseTo(1.7020);
    expect(districtSplitScore(1, gCorrect)).toBeCloseTo(1.6690);
    expect(districtSplitScore(2, gCorrect)).toBeCloseTo(1.3416);
    expect(districtSplitScore(3, gCorrect)).toBeCloseTo(1.3416);
  });
  test('District splitting (SqEnt_CD)', () =>
  {
    expect(districtSplitting(g, x)).toBeCloseTo(1.5136);
  });
  test('Do district splitting', () =>
  {
    expect(doDistrictSplitting(CxD, districtTotals)).toBeCloseTo(1.5136);
  });
});

describe('Reduce splits', () =>
{
  test('No reductions', () =>
  {
    const splits: number[][] = [
      [50, 50, 50, 0, 0, 0],
      [50, 50, 50, 0, 0, 0],
      [0, 0, 0, 50, 50, 50],
      [0, 0, 0, 50, 50, 50]
    ];
    const cT: number[] = [100, 100, 100, 100, 100, 100];
    const dT: number[] = [150, 150, 150, 150];

    const rC: number[][] = [
      [0, 0, 0, 0, 0, 0],
      [50, 50, 50, 0, 0, 0],
      [50, 50, 50, 0, 0, 0],
      [0, 0, 0, 50, 50, 50],
      [0, 0, 0, 50, 50, 50]
    ];
    const rD: number[][] = [
      [0, 50, 50, 50, 0, 0, 0],
      [0, 50, 50, 50, 0, 0, 0],
      [0, 0, 0, 0, 50, 50, 50],
      [0, 0, 0, 0, 50, 50, 50]
    ];
    expect(reduceCSplits(splits, dT)).toEqual(rC);
    expect(reduceDSplits(splits, cT)).toEqual(rD);
  });
  test('Whole districts', () =>
  {
    const splits = [
      [150, 0, 0, 0, 0, 0],
      [25, 25, 25, 25, 25, 25],
      [0, 0, 150, 0, 0, 0],
      [0, 0, 0, 100, 25, 25],
      [0, 150, 0, 0, 0, 0]
    ];
    const cT: number[] = [175, 175, 175, 125, 50, 50];
    const dT: number[] = [150, 150, 150, 150, 150];

    const rC = [
      [150, 150, 150, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [25, 25, 25, 25, 25, 25],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 100, 25, 25],
      [0, 0, 0, 0, 0, 0]
    ];
    expect(reduceCSplits(splits, dT)).toEqual(rC);
  });
  test('Large county', () =>
  {
    const splits = [
      [75, 0, 75, 0, 0, 0],
      [0, 150, 0, 0, 0, 0],
      [0, 150, 0, 0, 0, 0],
      [0, 0, 50, 50, 25, 25],
      [75, 0, 75, 0, 0, 0]
    ];
    const cT: number[] = [150, 300, 200, 50, 25, 25];
    const dT: number[] = [150, 150, 150, 150, 150];

    const rC = [
      [0, 300, 0, 0, 0, 0],
      [75, 0, 75, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 50, 50, 25, 25],
      [75, 0, 75, 0, 0, 0]
    ];
    expect(reduceCSplits(splits, dT)).toEqual(rC);
  });
  test('Whole counties', () =>
  {
    const splits = [
      [100, 50, 0, 0, 0, 0],
      [0, 0, 0, 50, 100, 0],
      [0, 50, 100, 0, 0, 0],
      [0, 0, 0, 100, 50, 0],
      [0, 50, 0, 0, 0, 100]
    ];
    const cT: number[] = [100, 150, 100, 150, 150, 100];
    const dT: number[] = [150, 150, 150, 150, 150];

    // const rC = [];
    const rD = [
      [100, 0, 50, 0, 0, 0, 0],
      [0, 0, 0, 0, 50, 100, 0],
      [100, 0, 50, 0, 0, 0, 0],
      [0, 0, 0, 0, 100, 50, 0],
      [100, 0, 50, 0, 0, 0, 0]
    ];
    expect(reduceDSplits(splits, cT)).toEqual(rD);
  });
  test('Small counties', () =>
  {
    const splits = [
      [75, 0, 0, 75, 0, 0],
      [0, 25, 25, 0, 0, 100],
      [50, 0, 0, 50, 50, 0],
      [0, 0, 0, 0, 75, 75],
      [0, 0, 0, 50, 50, 50]
    ];
    const cT: number[] = [125, 25, 25, 175, 175, 225];
    const dT: number[] = [150, 150, 150, 150, 150];

    // const rC = [];
    const rD = [
      [0, 75, 0, 0, 75, 0, 0],
      [50, 0, 0, 0, 0, 0, 100],
      [0, 50, 0, 0, 50, 50, 0],
      [0, 0, 0, 0, 0, 75, 75],
      [0, 0, 0, 0, 50, 50, 50]
    ];
    expect(reduceDSplits(splits, cT)).toEqual(rD);
  });
});

describe('AZ example', () =>
{
  /*
    SIMPLE
    * SqEnt(D|C) = 2.064
    * SqEnt(C|D) = 1.509

    REDUCED
    * SqEnt(D|C) = 1.3523
    * SqEnt(C|D) = 1.4240
  */

  const splits = FU.readJSON('testdata/splitting/samples/splitting-AZ-benchmark.json');

  const cT: number[] = totalCounties(splits.countyByDistrict);
  const dT: number[] = totalDistricts(splits.countyByDistrict);
  test('Total counties & districts', () =>
  {
    const cTCorrect: number[] = [71518, 131346, 134421, 53597, 37220, 8437, 20489, 3817117, 200186, 107449, 980263, 375770, 47420, 211033, 195751];
    const dTCorrect: number[] = [710224, 710224, 710224, 710224, 710224, 710224, 710224, 710225, 710224];
    expect(cT).toEqual(cTCorrect);
    expect(dT).toEqual(dTCorrect);
  });

  test('Do county splitting', () =>
  {
    expect(doCountySplitting(splits.countyByDistrict, cT)).toBeCloseTo(2.064);
  });
  test('Do district splitting', () =>
  {
    expect(doDistrictSplitting(splits.countyByDistrict, dT)).toBeCloseTo(1.509);
  });

  const rC = reduceCSplits(splits.countyByDistrict, dT);
  const rD = reduceDSplits(splits.countyByDistrict, cT);
  test('Reduce splits', () =>
  {
    const rCCorrect: number[][] = [
      [0, 0, 0, 0, 0, 0, 0, 3551121, 0, 0, 0, 0, 0, 0, 0],
      [71518, 0, 134421, 26230, 37220, 8437, 0, 2994, 1635, 107449, 92091, 197708, 0, 30521, 0],
      [0, 131346, 0, 0, 0, 0, 0, 0, 0, 0, 578878, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 225734, 0, 0, 309294, 545, 47420, 0, 127231],
      [0, 0, 0, 27367, 0, 0, 20489, 37268, 198551, 0, 0, 177517, 0, 180512, 68520],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const rDCorrect: number[][] = [
      [359045, 0, 0, 0, 26230, 0, 0, 0, 2994, 1635, 0, 92091, 197708, 0, 30521, 0],
      [131346, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 578878, 0, 0, 0, 0],
      [47420, 0, 0, 0, 0, 0, 0, 0, 225734, 0, 0, 309294, 545, 0, 0, 127231],
      [20489, 0, 0, 0, 27367, 0, 0, 0, 37268, 198551, 0, 0, 177517, 0, 180512, 68520],
      [0, 0, 0, 0, 0, 0, 0, 0, 710224, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 710224, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 710224, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 710225, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 710224, 0, 0, 0, 0, 0, 0, 0]
    ];
    expect(rC).toEqual(rCCorrect);
    expect(rD).toEqual(rDCorrect);
  });

  test('County weights', () =>
  {
    const wCorrect: number[] = [0.011, 0.021, 0.021, 0.008, 0.006, 0.001, 0.003, 0.597, 0.031, 0.017, 0.153, 0.059, 0.007, 0.033, 0.031];
    expect(calcCountyWeights(cT)).toBeArrayWithValuesCloseTo(wCorrect);
  });
  test('District weights', () =>
  {
    const xCorrect: number[] = [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111];
    expect(calcDistrictWeights(dT)).toBeArrayWithValuesCloseTo(xCorrect);
  });

  const f = calcCountyFractions(rC, cT);
  const fCorrect: number[][] = [
    [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.9303, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000],
    [1.0000, 0.0000, 1.0000, 0.4894, 1.0000, 1.0000, 0.0000, 0.0008, 0.0082, 1.0000, 0.0939, 0.5261, 0.0000, 0.1446, 0.0000],
    [0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.5905, 0.0000, 0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0591, 0.0000, 0.0000, 0.3155, 0.0015, 1.0000, 0.0000, 0.6500],
    [0.0000, 0.0000, 0.0000, 0.5106, 0.0000, 0.0000, 1.0000, 0.0098, 0.9918, 0.0000, 0.0000, 0.4724, 0.0000, 0.8554, 0.3500],
    [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000]
  ];
  test('Calculate county fractions', () =>
  {
    expect(f).toBeArrayWithValuesCloseTo(fCorrect);
  });

  const g = calcDistrictFractions(rD, dT);
  const gCorrect: number[][] = [
    [0.5055, 0, 0, 0, 0.0369, 0, 0, 0, 0.0042, 0.0023, 0, 0.1297, 0.2784, 0, 0.043, 0],
    [0.1849, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.8151, 0, 0, 0, 0],
    [0.0668, 0, 0, 0, 0, 0, 0, 0, 0.3178, 0, 0, 0.4355, 0.0008, 0, 0, 0.1791],
    [0.0288, 0, 0, 0, 0.0385, 0, 0, 0, 0.0525, 0.2796, 0, 0, 0.2499, 0, 0.2542, 0.0965],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
  ];
  test('Calculate district fractions', () =>
  {
    expect(g).toBeArrayWithValuesCloseTo(gCorrect);
  });


  test('Do county splitting - reduced C', () =>
  {
    expect(doCountySplitting(rC, cT)).toBeCloseTo(1.3523);
    const raw = calcCountySplitting(splits.countyByDistrict, dT, cT);
    expect(raw).toBeCloseTo(1.3523);
  });
  test('Do district splitting - reduced D', () =>
  {
    expect(doDistrictSplitting(rD, dT)).toBeCloseTo(1.4240);
    const raw = calcDistrictSplitting(splits.countyByDistrict, dT, cT);
    expect(raw).toBeCloseTo(1.4240);
  });
});