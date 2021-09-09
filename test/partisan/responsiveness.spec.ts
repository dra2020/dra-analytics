import * as T from '../../lib/types/all'
import * as S from '../../lib/rate/settings';
import * as C from '../../lib/rate/dra-config';

import * as FU from '../../testutil/fileutils';

import
{
  estResponsiveness, estResponsiveDistricts,
  estResponsiveDistrictsShare,   // NOTE - Just a division; no tests
  countCompetitiveDistricts,
  estDistrictCompetitiveness,
  estCompetitiveDistricts,       // NOTE - Just a sum over a tested fn; no tests
  estCompetitiveDistrictsShare,  // NOTE - Just a division; no tests
  estMarginalCompetitiveShare    // NOTE - Tested indirectly via the hypothetical & sample state profiles
} from '../../lib/partisan/responsiveness'


describe('Count competitive districts', () =>
{
  test('3 of 7 competitive', () =>
  {
    const rV: T.VfArray = [0.40, 0.45 - S.EPSILON, 0.45, 0.50, 0.55, 0.55 + S.EPSILON, 0.60];
    expect(countCompetitiveDistricts(rV)).toBe(3);
  });
})

// If this is a perfectly competitive set of districts:
// const competitive: T.VfArray = { "1": 0.4900, "2": 0.4900, "3": 0.4900, "4": 0.4950, "5": 0.4950, "6": 0.4950, "7": 0.5050, "8": 0.5050, "9": 0.5050, "10": 0.5150, "11": 0.5150, "12": 0.5150 };
// console.log("Perfectly competitive responsive share =", estResponsiveDistricts(competitive) / 12);
// console.log("Perfectly competitive competitive share =", estCompetitiveDistricts(competitive) / 12);

// The responsive district share = 0.9639436785625163, and
// the competitive district share = 0.8691236439947692, when you compress the
// bell curve to half its normal range (pun intended), i.e., [0.25–0.75]. That
// gives the kind of probabilities that I'm looking for:

// Vf = 0.450 : 0.3779515959639903 => re-scaled = 0.40000000000000000 : 0.024684421529272083
// Vf = 0.460 : 0.5339350573256081 => re-scaled = 0.42000000000000004 : 0.08893025377807884
// Vf = 0.470 : 0.7010695821260757 => re-scaled = 0.43999999999999995 : 0.24937599650992093
// Vf = 0.480 : 0.8533685036915879 => re-scaled = 0.45999999999999996 : 0.5339350573256072
// Vf = 0.490 : 0.9610282450807063 => re-scaled = 0.48000000000000000 : 0.8533685036915879
// Vf = 0.495 : 0.9901044359629966 => re-scaled = 0.49000000000000000 : 0.9610282450807063
// Vf = 0.500 : 1.0000000000000000 => re-scaled = 0.50000000000000000 : 1.0000000000000000
// Vf = 0.505 : 0.9901044359629966 => re-scaled = 0.51000000000000000 : 0.9610282450807063
// Vf = 0.510 : 0.9610282450807063 => re-scaled = 0.52000000000000000 : 0.8533685036915879
// Vf = 0.520 : 0.8533685036915879 => re-scaled = 0.54000000000000000 : 0.5339350573256072
// Vf = 0.530 : 0.7010695821260757 => re-scaled = 0.56000000000000000 : 0.2493759965099207
// Vf = 0.540 : 0.5339350573256072 => re-scaled = 0.58000000000000010 : 0.08893025377807817
// Vf = 0.550 : 0.3779515959639896 => re-scaled = 0.60000000000000010 : 0.024684421529272083

describe('Estimate district competitiveness (COMPRESSED)', () =>
{
  const bCompress = true;

  test('45.00% share', () =>
  {
    expect(estDistrictCompetitiveness(0.450000, bCompress)).toBeCloseTo(0.024684);
  });
  test('46.00% share', () =>
  {
    expect(estDistrictCompetitiveness(0.460000, bCompress)).toBeCloseTo(0.088930);
  });
  test('47.00% share', () =>
  {
    expect(estDistrictCompetitiveness(0.470000, bCompress)).toBeCloseTo(0.249375);
  });
  test('48.00% share', () =>
  {
    expect(estDistrictCompetitiveness(0.48000, bCompress)).toBeCloseTo(0.533935);
  });
  test('49.00% share', () =>
  {
    expect(estDistrictCompetitiveness(0.490000, bCompress)).toBeCloseTo(0.853368);
  });
  test('49.50% share', () =>
  {
    expect(estDistrictCompetitiveness(0.495000, bCompress)).toBeCloseTo(0.961028);
  });
  test('50.00% share', () =>
  {
    expect(estDistrictCompetitiveness(0.500000, bCompress)).toBeCloseTo(1.000000);
  });
  test('50.50% share', () =>
  {
    expect(estDistrictCompetitiveness(0.505000, bCompress)).toBeCloseTo(0.961028);
  });
  test('51.0000% share', () =>
  {
    expect(estDistrictCompetitiveness(0.510000, bCompress)).toBeCloseTo(0.853368);
  });
  test('52.0000% share', () =>
  {
    expect(estDistrictCompetitiveness(0.52000, bCompress)).toBeCloseTo(0.533935);
  });
  test('53.0000% share', () =>
  {
    expect(estDistrictCompetitiveness(0.530000, bCompress)).toBeCloseTo(0.249375);
  });
  test('54.0000% share', () =>
  {
    expect(estDistrictCompetitiveness(0.540000, bCompress)).toBeCloseTo(0.088930);
  });
  test('55.0000% share', () =>
  {
    expect(estDistrictCompetitiveness(0.550000, bCompress)).toBeCloseTo(0.024684);
  });
});

describe('Estimate district competitiveness (UNCOMPRESSED)', () =>
{
  test('40.1515% share', () =>
  {
    expect(estDistrictCompetitiveness(0.401515)).toBeCloseTo(0.027433);
  });
  test('45.0000% share', () =>
  {
    expect(estDistrictCompetitiveness(0.450000)).toBeCloseTo(0.377952);
  });
  test('50.1515% share', () =>
  {
    expect(estDistrictCompetitiveness(0.501515)).toBeCloseTo(0.999087);
  });
  test('55.0000% share', () =>
  {
    expect(estDistrictCompetitiveness(0.550000)).toBeCloseTo(0.377952);
  });
  test('60.1515% share', () =>
  {
    expect(estDistrictCompetitiveness(0.601515)).toBeCloseTo(0.022181);
  });
});
