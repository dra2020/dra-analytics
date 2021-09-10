import * as T from '../../lib/types/all'

import * as FU from '../../testutil/fileutils';

import
{
  estSeats,
  estFPTPSeats,
  inferSVpoints
} from '../../lib/partisan/method';

import
{
  estSeatShare,
  estSeatBias, estVotesBias,
  calcEfficiencyGap,
  keyRVpoints
} from '../../lib/partisan/bias';

import
{
  estResponsiveness, estResponsiveDistricts
} from '../../lib/partisan/responsiveness';

import
{
  makePartisanScorecard
} from '../../lib/partisan/all';


// PA SCOPA-7S PLAN

describe('PA SCOPA-7S plan', () =>
{
  // NOTE - I'm not sure this is *actually* the SCOPA plan w/ Nagle's 7S data
  //   -- I *think* it might be an "Aga" plan -- but that's what I call it in
  //   the dra2020/nagle Python repo. Because I can replicate these outputs w/
  //   these inputs, I've confirmed that I've re-implemented Nagle's core method
  //   correctly in TypeScript.
  const partisanProfile = FU.readJSON('testdata/partisan/nagle/partisan-PA-SCOPA-7S.json');

  const rV: T.VfArray = partisanProfile.byDistrict;
  const N: number = rV.length;
  const Vf: number = partisanProfile.statewide;
  const inferredSVpoints: T.SVpoint[] = inferSVpoints(Vf, rV, T.Shift.Proportional);

  test('Infer Seats-Votes curve', () =>
  {
    const correctSVpoints: T.SVpoint[] = [
      {v: 0.250000, s: 0.001285},
      {v: 0.255000, s: 0.002078},
      {v: 0.260000, s: 0.003237},
      {v: 0.265000, s: 0.004857},
      {v: 0.270000, s: 0.007030},
      {v: 0.275000, s: 0.009826},
      {v: 0.280000, s: 0.013279},
      {v: 0.285000, s: 0.017380},
      {v: 0.290000, s: 0.022071},
      {v: 0.295000, s: 0.027248},
      {v: 0.300000, s: 0.032781},
      {v: 0.305000, s: 0.038531},
      {v: 0.310000, s: 0.044370},
      {v: 0.315000, s: 0.050200},
      {v: 0.320000, s: 0.055961},
      {v: 0.325000, s: 0.061632},
      {v: 0.330000, s: 0.067222},
      {v: 0.335000, s: 0.072754},
      {v: 0.340000, s: 0.078258},
      {v: 0.345000, s: 0.083754},
      {v: 0.350000, s: 0.089255},
      {v: 0.355000, s: 0.094764},
      {v: 0.360000, s: 0.100280},
      {v: 0.365000, s: 0.105810},
      {v: 0.370000, s: 0.111371},
      {v: 0.375000, s: 0.116996},
      {v: 0.380000, s: 0.122730},
      {v: 0.385000, s: 0.128634},
      {v: 0.390000, s: 0.134771},
      {v: 0.395000, s: 0.141205},
      {v: 0.400000, s: 0.147996},
      {v: 0.405000, s: 0.155195},
      {v: 0.410000, s: 0.162841},
      {v: 0.415000, s: 0.170965},
      {v: 0.420000, s: 0.179590},
      {v: 0.425000, s: 0.188731},
      {v: 0.430000, s: 0.198400},
      {v: 0.435000, s: 0.208604},
      {v: 0.440000, s: 0.219347},
      {v: 0.445000, s: 0.230633},
      {v: 0.450000, s: 0.242462},
      {v: 0.455000, s: 0.254833},
      {v: 0.460000, s: 0.267741},
      {v: 0.465000, s: 0.281180},
      {v: 0.470000, s: 0.295141},
      {v: 0.475000, s: 0.309616},
      {v: 0.480000, s: 0.324591},
      {v: 0.485000, s: 0.340052},
      {v: 0.490000, s: 0.355983},
      {v: 0.495000, s: 0.372361},
      {v: 0.500000, s: 0.389162},
      {v: 0.505000, s: 0.406351},
      {v: 0.510000, s: 0.423888},
      {v: 0.515000, s: 0.441723},
      {v: 0.520000, s: 0.459797},
      {v: 0.525000, s: 0.478042},
      {v: 0.530000, s: 0.496382},
      {v: 0.535000, s: 0.514734},
      {v: 0.540000, s: 0.533010},
      {v: 0.545000, s: 0.551119},
      {v: 0.550000, s: 0.569931},
      {v: 0.555000, s: 0.591386},
      {v: 0.560000, s: 0.612788},
      {v: 0.565000, s: 0.634024},
      {v: 0.570000, s: 0.655012},
      {v: 0.575000, s: 0.675697},
      {v: 0.580000, s: 0.696061},
      {v: 0.585000, s: 0.716114},
      {v: 0.590000, s: 0.735887},
      {v: 0.595000, s: 0.755425},
      {v: 0.600000, s: 0.774768},
      {v: 0.605000, s: 0.793940},
      {v: 0.610000, s: 0.812933},
      {v: 0.615000, s: 0.831697},
      {v: 0.620000, s: 0.850135},
      {v: 0.625000, s: 0.868103},
      {v: 0.630000, s: 0.885421},
      {v: 0.635000, s: 0.901885},
      {v: 0.640000, s: 0.917287},
      {v: 0.645000, s: 0.931435},
      {v: 0.650000, s: 0.944176},
      {v: 0.655000, s: 0.955405},
      {v: 0.660000, s: 0.965080},
      {v: 0.665000, s: 0.973220},
      {v: 0.670000, s: 0.979902},
      {v: 0.675000, s: 0.985251},
      {v: 0.680000, s: 0.989422},
      {v: 0.685000, s: 0.992591},
      {v: 0.690000, s: 0.994935},
      {v: 0.695000, s: 0.996621},
      {v: 0.700000, s: 0.997802},
      {v: 0.705000, s: 0.998606},
      {v: 0.710000, s: 0.999138},
      {v: 0.715000, s: 0.999481},
      {v: 0.720000, s: 0.999696},
      {v: 0.725000, s: 0.999826},
      {v: 0.730000, s: 0.999904},
      {v: 0.735000, s: 0.999948},
      {v: 0.740000, s: 0.999973},
      {v: 0.745000, s: 0.999986},
      {v: 0.750000, s: 0.999993}
    ];
    // NOTE - Map the full [0.0–1.0] range to the partial [0.25–0.75] range.
    expect(inferredSVpoints[0].s).toBeCloseTo(correctSVpoints[0].s);
    expect(inferredSVpoints[50].s).toBeCloseTo(correctSVpoints[50].s);
    expect(inferredSVpoints[100].s).toBeCloseTo(correctSVpoints[100].s);
  });
  test('Estimate # of responsive districts', () =>
  {
    expect(estResponsiveDistricts(rV)).toBeCloseTo(6.57);
  });
  test('Estimate responsive at statewide Vf', () =>
  {
    expect(estResponsiveness(Vf, inferredSVpoints)).toBeCloseTo(3.76);
  });
  test('Estimate simple seat bias @ V = 50%', () =>
  {
    expect(estSeatBias(inferredSVpoints, N)).toBeCloseTo(2.0);
  });
  test('Estimate simple votes bias @ V = 50%', () =>
  {
    expect(estVotesBias(inferredSVpoints, N)).toBeCloseTo(0.0310);
  });
  test('Calculate the efficiency gap (FPTP)', () =>
  {
    const fptpSf: number = estFPTPSeats(rV) / N;
    expect(calcEfficiencyGap(Vf, fptpSf, N)).toBeCloseTo(0.0418);
  });
  test('Calculate the efficiency gap (w/ seat probabilities)', () =>
  {
    const range = undefined;
    const estS = estSeats(rV, range);
    const estSf = estSeatShare(estS, N);
    expect(calcEfficiencyGap(Vf, estSf, N)).toBeCloseTo(0.033);
  });
})

// NOTE - This is an exact copy of the previous test, except the Vf values are not
//   in any order.
describe('PA SCOPA-7S plan (UNSORTED)', () =>
{
  const partisanProfile = FU.readJSON('testdata/partisan/nagle/partisan-PA-SCOPA-7S-unsorted.json');

  const rV: T.VfArray = partisanProfile.byDistrict;
  const Vf: number = partisanProfile.statewide;
  const inferredSVpoints: T.SVpoint[] = inferSVpoints(Vf, rV, T.Shift.Proportional);

  test('Infer Seats-Votes curve', () =>
  {
    const correctSVpoints: T.SVpoint[] = [
      {v: 0.250000, s: 0.001285},
      {v: 0.255000, s: 0.002078},
      {v: 0.260000, s: 0.003237},
      {v: 0.265000, s: 0.004857},
      {v: 0.270000, s: 0.007030},
      {v: 0.275000, s: 0.009826},
      {v: 0.280000, s: 0.013279},
      {v: 0.285000, s: 0.017380},
      {v: 0.290000, s: 0.022071},
      {v: 0.295000, s: 0.027248},
      {v: 0.300000, s: 0.032781},
      {v: 0.305000, s: 0.038531},
      {v: 0.310000, s: 0.044370},
      {v: 0.315000, s: 0.050200},
      {v: 0.320000, s: 0.055961},
      {v: 0.325000, s: 0.061632},
      {v: 0.330000, s: 0.067222},
      {v: 0.335000, s: 0.072754},
      {v: 0.340000, s: 0.078258},
      {v: 0.345000, s: 0.083754},
      {v: 0.350000, s: 0.089255},
      {v: 0.355000, s: 0.094764},
      {v: 0.360000, s: 0.100280},
      {v: 0.365000, s: 0.105810},
      {v: 0.370000, s: 0.111371},
      {v: 0.375000, s: 0.116996},
      {v: 0.380000, s: 0.122730},
      {v: 0.385000, s: 0.128634},
      {v: 0.390000, s: 0.134771},
      {v: 0.395000, s: 0.141205},
      {v: 0.400000, s: 0.147996},
      {v: 0.405000, s: 0.155195},
      {v: 0.410000, s: 0.162841},
      {v: 0.415000, s: 0.170965},
      {v: 0.420000, s: 0.179590},
      {v: 0.425000, s: 0.188731},
      {v: 0.430000, s: 0.198400},
      {v: 0.435000, s: 0.208604},
      {v: 0.440000, s: 0.219347},
      {v: 0.445000, s: 0.230633},
      {v: 0.450000, s: 0.242462},
      {v: 0.455000, s: 0.254833},
      {v: 0.460000, s: 0.267741},
      {v: 0.465000, s: 0.281180},
      {v: 0.470000, s: 0.295141},
      {v: 0.475000, s: 0.309616},
      {v: 0.480000, s: 0.324591},
      {v: 0.485000, s: 0.340052},
      {v: 0.490000, s: 0.355983},
      {v: 0.495000, s: 0.372361},
      {v: 0.500000, s: 0.389162},
      {v: 0.505000, s: 0.406351},
      {v: 0.510000, s: 0.423888},
      {v: 0.515000, s: 0.441723},
      {v: 0.520000, s: 0.459797},
      {v: 0.525000, s: 0.478042},
      {v: 0.530000, s: 0.496382},
      {v: 0.535000, s: 0.514734},
      {v: 0.540000, s: 0.533010},
      {v: 0.545000, s: 0.551119},
      {v: 0.550000, s: 0.569931},
      {v: 0.555000, s: 0.591386},
      {v: 0.560000, s: 0.612788},
      {v: 0.565000, s: 0.634024},
      {v: 0.570000, s: 0.655012},
      {v: 0.575000, s: 0.675697},
      {v: 0.580000, s: 0.696061},
      {v: 0.585000, s: 0.716114},
      {v: 0.590000, s: 0.735887},
      {v: 0.595000, s: 0.755425},
      {v: 0.600000, s: 0.774768},
      {v: 0.605000, s: 0.793940},
      {v: 0.610000, s: 0.812933},
      {v: 0.615000, s: 0.831697},
      {v: 0.620000, s: 0.850135},
      {v: 0.625000, s: 0.868103},
      {v: 0.630000, s: 0.885421},
      {v: 0.635000, s: 0.901885},
      {v: 0.640000, s: 0.917287},
      {v: 0.645000, s: 0.931435},
      {v: 0.650000, s: 0.944176},
      {v: 0.655000, s: 0.955405},
      {v: 0.660000, s: 0.965080},
      {v: 0.665000, s: 0.973220},
      {v: 0.670000, s: 0.979902},
      {v: 0.675000, s: 0.985251},
      {v: 0.680000, s: 0.989422},
      {v: 0.685000, s: 0.992591},
      {v: 0.690000, s: 0.994935},
      {v: 0.695000, s: 0.996621},
      {v: 0.700000, s: 0.997802},
      {v: 0.705000, s: 0.998606},
      {v: 0.710000, s: 0.999138},
      {v: 0.715000, s: 0.999481},
      {v: 0.720000, s: 0.999696},
      {v: 0.725000, s: 0.999826},
      {v: 0.730000, s: 0.999904},
      {v: 0.735000, s: 0.999948},
      {v: 0.740000, s: 0.999973},
      {v: 0.745000, s: 0.999986},
      {v: 0.750000, s: 0.999993}
    ];
    // NOTE - Map the full [0.0–1.0] range to the partial [0.25–0.75] range.
    expect(inferredSVpoints[0].s).toBeCloseTo(correctSVpoints[0].s);
    expect(inferredSVpoints[50].s).toBeCloseTo(correctSVpoints[50].s);
    expect(inferredSVpoints[100].s).toBeCloseTo(correctSVpoints[100].s);
  });
  test('Estimate # of responsive districts', () =>
  {
    expect(estResponsiveDistricts(rV)).toBeCloseTo(6.57);
  });
  test('Estimate responsive at statewide Vf', () =>
  {
    expect(estResponsiveness(Vf, inferredSVpoints)).toBeCloseTo(3.76);
  });
})


// TEST HYPOTHETICAL PARTISAN PROFILES

describe('Hypothetical A (1-proportionality)', () =>
{
  // Warrington's hypothetical A
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-A.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(14);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.6087);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(13.8076);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.6003);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.0084);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(0.8431);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(2.0833);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0906);
  });
})

describe('Hypothetical B (2-proportionality)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-B.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(15);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.6000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(17.3000);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.6920);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.0920);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.6134);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(4.3329);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.1733);
  });
})

describe('Hypothetical C (3-proportionality)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-C.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(15);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.6000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(19.9419);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.7977);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.1977);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(2.4315);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(6.5433);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.2617);
  });
})

describe('Hypothetical D (Sweep)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-D.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(6);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.6000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(9.8384);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.9838);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.3838);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(0.7471);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(0.5947);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0595);
  });
})

describe('Hypothetical E (Competitive)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-E.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(6);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(7.9977);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.6665);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.1665);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(8.0289);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(9.1389);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.7616);
  });
})

describe('Hypothetical F (Competitive even)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-F.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(5);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(5.6574);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.5657);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.0657);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(4.9970);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(4.5606);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.4561);
  });
})

describe('Hypothetical G (Uncompetitive)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-G.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(5);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(5.9932);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.5993);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.0993);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(0.0541);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(0.0273);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0027);
  });
})

describe('Hypothetical H (Very uncompetitive)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-H.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(5);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(6.0000);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.6000);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.1000);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(0.0000);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(0.0000);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0000);
  });
})

describe('Hypothetical I (Cubic)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-I.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(6);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.6000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(7.3984);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.7398);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.1398);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.9415);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(1.7073);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.1707);
  });
})

describe('Hypothetical J (Anti-majoritarian)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-J.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(4);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.4000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(5.5598);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.5560);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.1560);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.6239);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(1.3331);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.1333);
  });
})

describe('Hypothetical K (Classic)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-K.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(5);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(3.3882);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.3388);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.1612);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.3046);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(1.2957);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.1296);
  });
})

describe('Hypothetical L (Inverted)', () =>
{
  const p = FU.readJSON('testdata/partisan/warrington/partisan-Hypothetical-L.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(3);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.3000);
  });

  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(1.7961);
  });
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.1796);
  });

  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.1204);
  });
  // More ...

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(5.025);
  });
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(2.8831);
  });
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.2883);
  });
})


// TEST PARTISAN PROFILES FOR SAMPLE STATES

describe('CA 2012', () =>
{
  // CA 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-CA-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  // const inferredSVpoints = inferSVpoints(p.statewide, p.byDistrict, options.shift);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(31);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5849);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(38.652689);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.7293);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.1444);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.006566);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(-0.01792670);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(-0.00609430);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.0330327);
  });  // From Python-generated analysis.csv

  /* NOTE - I don't have independent benchmarks to compare these against.
  test('Calculate declination', () =>
  {
    expect(s.bias.decl).toBeCloseTo(-3.00456, 1);
  });
  test('Calculate global symmetry', () =>
  {
    expect(s.bias.gSym).toBeCloseTo(-1.7654 / 100);
  });
  */
  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(-5.07 / 100);
  });  // From Python-generated benchmark

  /* NOTE - I don't have independent benchmarks to compare these against. 
  test('Calculate big R', () =>
  {
    expect(s.responsiveness.bigR).toBeCloseTo(2.6, 1);
  });
  test('Calculate minimal inverse responsiveness', () =>
  {
    expect(s.responsiveness.mIR).toBeCloseTo(0.290849505436252, 1);
  });
  */

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(-0.04511401);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(-0.00972344444444451);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(-0.003123);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(9.23242870162867 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.939018);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(8.534675);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.1610);
  });
})

// NOTE - These districts are *not* sorted in order by Vf. Good additional test.
describe('CO 2012', () =>
{
  // CO 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-CO-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(4);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5714);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(3.553689);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.5077);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.0638);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(0.002829);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.01355483);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.00354176);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.0137603);
  });  // From Python-generated analysis.csv

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(1.35 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(0.00345216);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0135999999999999);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.010771);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(0.313178142621696 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(3.801580);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(2.487388);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.3553);
  });
})

describe('IL 2012', () =>
{
  // IL 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-IL-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(11);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.6111);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(13.436476);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.7465);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.1354);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.005924);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.06529380);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.01767461);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.0250521);
  });  // From Python-generated analysis.csv

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(6.87 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(-0.04633487);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0216675);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.027568);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(11.6630707932444 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(3.149669);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(3.846940);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.2137);
  });
})

describe('MA 2012', () =>
{
  // MA 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-MA-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  // NOTE - Declination is undefined

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(5);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5556);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(8.622034);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.9580);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.4024);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.007300);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.06718376);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.01002969);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(-0.0303917);
  });  // From Python-generated analysis.csv
  // Declination is undefined

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(-26.02 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(-0.25746580);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0230850624999998);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.027185);
  });  // Derived from Nagle's mM benchmarks
  // Lopsided outcomes are undefined

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.972364);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(1.383189);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.1537);
  });
})

describe('MD 2012', () =>
{
  // MD 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-MD-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(5);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.6250);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(6.796640);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.8496);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(-0.2246);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.004063);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(-0.05453999);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(-0.01007575);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.0137802);
  });  // From Python-generated analysis.csv

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(-24.9 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(-0.16284202);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(-0.0109);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(-0.006817);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(4.05629795619783 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.076736);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(0.702811);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0879);
  });
})

describe('NC 2012', () =>
{
  // NC 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-NC-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(7);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5385);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(4.192437);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.3225);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.2160);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.002295);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.21716415);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.04501325);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.209849);
  });  // From Python-generated analysis.csv
  test('Calculate declination', () =>
  {
    expect(s.bias.decl).toBeCloseTo(36.51, 1);
  });  // Benchmark from Nagle

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(24.29 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(0.20757683);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0570306);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.054731);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(11.0640578002419 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(4.350382);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(4.020386);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.3093);
  });
})

describe('OH 2012', () =>
{
  // OH 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-OH-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(8);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5000);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(6.237092);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.3898);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.1102);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.003045);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.15497649);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.03334768);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.149474);
  });  // From Python-generated analysis.csv

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(16.34 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(0.13630573);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0416622777777778);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.043962);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(6.93912595785785 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(4.076508);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(6.073901);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.3796);
  });
})

describe('PA 2012', () =>
{
  // PA 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-PA-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(10);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.5556);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(7.500995);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.4167);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.1388);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(0.002316);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.16923261);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.04711839);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.155534);
  });  // From Python-generated analysis.csv

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(18.35 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(0.14212207);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0574219090909092);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.055106);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(8.73772850436113 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(3.407693);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(6.077222);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.3376);
  });
})

describe('SC 2012', () =>
{
  // SC 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-SC-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(3);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.4286);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(1.108305);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.1583);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.2702);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.001194);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.15016984);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.02378688);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(0.00651749);
  });  // From Python-generated analysis.csv

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(28.08 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(0.20172665);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0472668571428571);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.048467);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(4.24207200633289 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(0.869641);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(0.407811);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0583);
  });
})

describe('TN 2012', () =>
{
  // TN 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-TN-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(4);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.4444);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(1.896111);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.2107);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.2338);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.002074);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.18353175);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.03247332);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(-0.0320523);
  });  // From Python-generated analysis.csv
  test('Calculate declination', () =>
  {
    expect(s.bias.decl).toBeCloseTo(34.85449, 1);
  });  // Benchmark from Nagle

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(24.96 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(0.12119106);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0413316666666666);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.043432);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(0.59256529415822 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(0.472979);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(0.396007);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0440);
  });
})

describe('TX 2012', () =>
{
  // TX 2012 from research project #2 w/ John Nagle
  const p = FU.readJSON('testdata/partisan/nagle/partisan-TX-2012.json');
  const s = makePartisanScorecard(p.statewide, p.byDistrict);

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });

  test('Estimate ^S#', () =>
  {
    expect(s.bias.bestS).toBe(15);
  });
  test('Estimate ^S%', () =>
  {
    expect(s.bias.bestSf).toBeCloseTo(0.4167);
  });
  test('Estimate S#', () =>
  {
    expect(s.bias.estS).toBeCloseTo(10.417401);
  });  // From Python-generated analysis.csv
  test('S%', () =>
  {
    expect(s.bias.estSf).toBeCloseTo(0.2894);
  });
  test('Estimate B%', () =>
  {
    expect(s.bias.deviation).toBeCloseTo(0.1273);
  });

  test('Estimate turnout bias', () =>
  {
    expect(s.bias.tOf).toBeCloseTo(-0.022282);
  });  // From Python-generated analysis.csv
  test('Estimate Bs50', () =>
  {
    expect(s.bias.bS50).toBeCloseTo(0.05457906);
  });  // From Python-generated analysis.csv
  test('Estimate Bv50', () =>
  {
    expect(s.bias.bV50).toBeCloseTo(0.01354120);
  });  // From Python-generated analysis.csv
  test('Estimate Bs<V>', () =>
  {
    expect(s.bias.bSV).toBeCloseTo(-0.0833849);
  });  // From Python-generated analysis.csv

  test('Calculate NEW gamma', () =>
  {
    expect(s.bias.gamma).toBeCloseTo(9.87 / 100);
  });  // From Python-generated benchmark

  test('Estimate EG as a fraction', () =>
  {
    expect(s.bias.eG).toBeCloseTo(0.01927575);
  });  // From Python-generated analysis.csv
  test('Estimate Mean–Median Difference', () =>
  {
    expect(s.bias.mMs).toBeCloseTo(0.0213738333333333);
  });  // From Nagle's mM benchmarks
  test('Estimate Mean–Median Difference (w/ district avg)', () =>
  {
    expect(s.bias.mMd).toBeCloseTo(0.043674);
  });  // Derived from Nagle's mM benchmarks
  test('Calculate lopsided outcomes', () =>
  {
    expect(s.bias.lO).toBeCloseTo(-2.95999047419546 / 100);
  });  // From Nagle's LO benchmarks

  test('Estimate R#', () =>
  {
    expect(s.responsiveness.littleR).toBeCloseTo(1.169951);
  });  // From Python-generated analysis.csv
  test('Estimate Rd', () =>
  {
    expect(s.responsiveness.rD).toBeCloseTo(2.805144);
  });  // From Python-generated analysis.csv
  test('Estimate Rd%', () =>
  {
    expect(s.responsiveness.rDf).toBeCloseTo(0.0779);
  });
})

describe('CO 20202 Congressional Most Competitive', () =>
{
  // This map is so extreme that it broke the declination calculations

  const full = FU.readJSON('testdata/partisan/issues/profile-CO-competitive.json');
  const p = full.partisanship;

  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(p.byDistrict);
  test('Check key RV points', () =>
  {
    expect(Va).toBeGreaterThanOrEqual(0.50);
    expect(Vb).toBeLessThanOrEqual(0.50);
    expect(Rb).toBeLessThan(0.50);
    expect(Ra).toBeGreaterThan(0.50);
  });
})