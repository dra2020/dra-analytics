import * as T from '../../lib/types/all'
import * as U from '../../lib/utils/all';
import * as C from '../../lib/rate/dra-config';

import * as FU from '../../testutil/fileutils';

import
{
  estSeatProbability,
  estSeats,
  estDistrictResponsiveness,
  estFPTPSeats,
  inferSVpoints
} from '../../lib/partisan/all'


describe('Estimate seat probabilities (uncompressed)', () =>
{
  test('35.0000% share', () =>
  {
    expect(estSeatProbability(0.350000)).toBeCloseTo(0.000088);
  });
  test('35.3030% share', () =>
  {
    expect(estSeatProbability(0.353030)).toBeCloseTo(0.000119);
  });
  test('35.6061% share', () =>
  {
    expect(estSeatProbability(0.356061)).toBeCloseTo(0.000160);
  });
  test('35.9091% share', () =>
  {
    expect(estSeatProbability(0.359091)).toBeCloseTo(0.000214);
  });
  test('36.2121% share', () =>
  {
    expect(estSeatProbability(0.362121)).toBeCloseTo(0.000283);
  });
  test('36.5152% share', () =>
  {
    expect(estSeatProbability(0.365152)).toBeCloseTo(0.000374);
  });
  test('36.8182% share', () =>
  {
    expect(estSeatProbability(0.368182)).toBeCloseTo(0.000491);
  });
  test('37.1212% share', () =>
  {
    expect(estSeatProbability(0.371212)).toBeCloseTo(0.000642);
  });
  test('37.4242% share', () =>
  {
    expect(estSeatProbability(0.374242)).toBeCloseTo(0.000833);
  });
  test('37.7273% share', () =>
  {
    expect(estSeatProbability(0.377273)).toBeCloseTo(0.001077);
  });
  test('38.0303% share', () =>
  {
    expect(estSeatProbability(0.380303)).toBeCloseTo(0.001384);
  });
  test('38.3333% share', () =>
  {
    expect(estSeatProbability(0.383333)).toBeCloseTo(0.001769);
  });
  test('38.6364% share', () =>
  {
    expect(estSeatProbability(0.386364)).toBeCloseTo(0.002249);
  });
  test('38.9394% share', () =>
  {
    expect(estSeatProbability(0.389394)).toBeCloseTo(0.002845);
  });
  test('39.2424% share', () =>
  {
    expect(estSeatProbability(0.392424)).toBeCloseTo(0.003579);
  });
  test('39.5455% share', () =>
  {
    expect(estSeatProbability(0.395455)).toBeCloseTo(0.004479);
  });
  test('39.8485% share', () =>
  {
    expect(estSeatProbability(0.398485)).toBeCloseTo(0.005576);
  });
  test('40.1515% share', () =>
  {
    expect(estSeatProbability(0.401515)).toBeCloseTo(0.006906);
  });
  test('40.4545% share', () =>
  {
    expect(estSeatProbability(0.404545)).toBeCloseTo(0.008508);
  });
  test('40.7576% share', () =>
  {
    expect(estSeatProbability(0.407576)).toBeCloseTo(0.010427);
  });
  test('41.0606% share', () =>
  {
    expect(estSeatProbability(0.410606)).toBeCloseTo(0.012714);
  });
  test('41.3636% share', () =>
  {
    expect(estSeatProbability(0.413636)).toBeCloseTo(0.015422);
  });
  test('41.6667% share', () =>
  {
    expect(estSeatProbability(0.416667)).toBeCloseTo(0.018610);
  });
  test('41.9697% share', () =>
  {
    expect(estSeatProbability(0.419697)).toBeCloseTo(0.022344);
  });
  test('42.2727% share', () =>
  {
    expect(estSeatProbability(0.422727)).toBeCloseTo(0.026691);
  });
  test('42.5758% share', () =>
  {
    expect(estSeatProbability(0.425758)).toBeCloseTo(0.031722);
  });
  test('42.8788% share', () =>
  {
    expect(estSeatProbability(0.428788)).toBeCloseTo(0.037513);
  });
  test('43.1818% share', () =>
  {
    expect(estSeatProbability(0.431818)).toBeCloseTo(0.044140);
  });
  test('43.4848% share', () =>
  {
    expect(estSeatProbability(0.434848)).toBeCloseTo(0.051679);
  });
  test('43.7879% share', () =>
  {
    expect(estSeatProbability(0.437879)).toBeCloseTo(0.060208);
  });
  test('44.0909% share', () =>
  {
    expect(estSeatProbability(0.440909)).toBeCloseTo(0.069801);
  });
  test('44.3939% share', () =>
  {
    expect(estSeatProbability(0.443939)).toBeCloseTo(0.080530);
  });
  test('44.6970% share', () =>
  {
    expect(estSeatProbability(0.446970)).toBeCloseTo(0.092460);
  });
  test('45.0000% share', () =>
  {
    expect(estSeatProbability(0.450000)).toBeCloseTo(0.105650);
  });
  test('45.3030% share', () =>
  {
    expect(estSeatProbability(0.453030)).toBeCloseTo(0.120149);
  });
  test('45.6061% share', () =>
  {
    expect(estSeatProbability(0.456061)).toBeCloseTo(0.135996);
  });
  test('45.9091% share', () =>
  {
    expect(estSeatProbability(0.459091)).toBeCloseTo(0.153218);
  });
  test('46.2121% share', () =>
  {
    expect(estSeatProbability(0.462121)).toBeCloseTo(0.171827);
  });
  test('46.5152% share', () =>
  {
    expect(estSeatProbability(0.465152)).toBeCloseTo(0.191819);
  });
  test('46.8182% share', () =>
  {
    expect(estSeatProbability(0.468182)).toBeCloseTo(0.213175);
  });
  test('47.1212% share', () =>
  {
    expect(estSeatProbability(0.471212)).toBeCloseTo(0.235856);
  });
  test('47.4242% share', () =>
  {
    expect(estSeatProbability(0.474242)).toBeCloseTo(0.259807);
  });
  test('47.7273% share', () =>
  {
    expect(estSeatProbability(0.477273)).toBeCloseTo(0.284956);
  });
  test('48.0303% share', () =>
  {
    expect(estSeatProbability(0.480303)).toBeCloseTo(0.311210);
  });
  test('48.3333% share', () =>
  {
    expect(estSeatProbability(0.483333)).toBeCloseTo(0.338461);
  });
  test('48.6364% share', () =>
  {
    expect(estSeatProbability(0.486364)).toBeCloseTo(0.366586);
  });
  test('48.9394% share', () =>
  {
    expect(estSeatProbability(0.489394)).toBeCloseTo(0.395446);
  });
  test('49.2424% share', () =>
  {
    expect(estSeatProbability(0.492424)).toBeCloseTo(0.424892);
  });
  test('49.5455% share', () =>
  {
    expect(estSeatProbability(0.495455)).toBeCloseTo(0.454763);
  });
  test('49.8485% share', () =>
  {
    expect(estSeatProbability(0.498485)).toBeCloseTo(0.484892);
  });
  test('50.1515% share', () =>
  {
    expect(estSeatProbability(0.501515)).toBeCloseTo(0.515108);
  });
  test('50.4545% share', () =>
  {
    expect(estSeatProbability(0.504545)).toBeCloseTo(0.545237);
  });
  test('50.7576% share', () =>
  {
    expect(estSeatProbability(0.507576)).toBeCloseTo(0.575108);
  });
  test('51.0606% share', () =>
  {
    expect(estSeatProbability(0.510606)).toBeCloseTo(0.604554);
  });
  test('51.3636% share', () =>
  {
    expect(estSeatProbability(0.513636)).toBeCloseTo(0.633414);
  });
  test('51.6667% share', () =>
  {
    expect(estSeatProbability(0.516667)).toBeCloseTo(0.661539);
  });
  test('51.9697% share', () =>
  {
    expect(estSeatProbability(0.519697)).toBeCloseTo(0.688790);
  });
  test('52.2727% share', () =>
  {
    expect(estSeatProbability(0.522727)).toBeCloseTo(0.715044);
  });
  test('52.5758% share', () =>
  {
    expect(estSeatProbability(0.525758)).toBeCloseTo(0.740193);
  });
  test('52.8788% share', () =>
  {
    expect(estSeatProbability(0.528788)).toBeCloseTo(0.764144);
  });
  test('53.1818% share', () =>
  {
    expect(estSeatProbability(0.531818)).toBeCloseTo(0.786825);
  });
  test('53.4848% share', () =>
  {
    expect(estSeatProbability(0.534848)).toBeCloseTo(0.808181);
  });
  test('53.7879% share', () =>
  {
    expect(estSeatProbability(0.537879)).toBeCloseTo(0.828173);
  });
  test('54.0909% share', () =>
  {
    expect(estSeatProbability(0.540909)).toBeCloseTo(0.846782);
  });
  test('54.3939% share', () =>
  {
    expect(estSeatProbability(0.543939)).toBeCloseTo(0.864004);
  });
  test('54.6970% share', () =>
  {
    expect(estSeatProbability(0.546970)).toBeCloseTo(0.879851);
  });
  test('55.0000% share', () =>
  {
    expect(estSeatProbability(0.550000)).toBeCloseTo(0.894350);
  });
  test('55.3030% share', () =>
  {
    expect(estSeatProbability(0.553030)).toBeCloseTo(0.907540);
  });
  test('55.6061% share', () =>
  {
    expect(estSeatProbability(0.556061)).toBeCloseTo(0.919470);
  });
  test('55.9091% share', () =>
  {
    expect(estSeatProbability(0.559091)).toBeCloseTo(0.930199);
  });
  test('56.2121% share', () =>
  {
    expect(estSeatProbability(0.562121)).toBeCloseTo(0.939792);
  });
  test('56.5152% share', () =>
  {
    expect(estSeatProbability(0.565152)).toBeCloseTo(0.948321);
  });
  test('56.8182% share', () =>
  {
    expect(estSeatProbability(0.568182)).toBeCloseTo(0.955860);
  });
  test('57.1212% share', () =>
  {
    expect(estSeatProbability(0.571212)).toBeCloseTo(0.962487);
  });
  test('57.4242% share', () =>
  {
    expect(estSeatProbability(0.574242)).toBeCloseTo(0.968278);
  });
  test('57.7273% share', () =>
  {
    expect(estSeatProbability(0.577273)).toBeCloseTo(0.973309);
  });
  test('58.0303% share', () =>
  {
    expect(estSeatProbability(0.580303)).toBeCloseTo(0.977656);
  });
  test('58.3333% share', () =>
  {
    expect(estSeatProbability(0.583333)).toBeCloseTo(0.981390);
  });
  test('58.6364% share', () =>
  {
    expect(estSeatProbability(0.586364)).toBeCloseTo(0.984578);
  });
  test('58.9394% share', () =>
  {
    expect(estSeatProbability(0.589394)).toBeCloseTo(0.987286);
  });
  test('59.2424% share', () =>
  {
    expect(estSeatProbability(0.592424)).toBeCloseTo(0.989573);
  });
  test('59.5455% share', () =>
  {
    expect(estSeatProbability(0.595455)).toBeCloseTo(0.991492);
  });
  test('59.8485% share', () =>
  {
    expect(estSeatProbability(0.598485)).toBeCloseTo(0.993094);
  });
  test('60.1515% share', () =>
  {
    expect(estSeatProbability(0.601515)).toBeCloseTo(0.994424);
  });
  test('60.4545% share', () =>
  {
    expect(estSeatProbability(0.604545)).toBeCloseTo(0.995521);
  });
  test('60.7576% share', () =>
  {
    expect(estSeatProbability(0.607576)).toBeCloseTo(0.996421);
  });
  test('61.0606% share', () =>
  {
    expect(estSeatProbability(0.610606)).toBeCloseTo(0.997155);
  });
  test('61.3636% share', () =>
  {
    expect(estSeatProbability(0.613636)).toBeCloseTo(0.997751);
  });
  test('61.6667% share', () =>
  {
    expect(estSeatProbability(0.616667)).toBeCloseTo(0.998231);
  });
  test('61.9697% share', () =>
  {
    expect(estSeatProbability(0.619697)).toBeCloseTo(0.998616);
  });
  test('62.2727% share', () =>
  {
    expect(estSeatProbability(0.622727)).toBeCloseTo(0.998923);
  });
  test('62.5758% share', () =>
  {
    expect(estSeatProbability(0.625758)).toBeCloseTo(0.999167);
  });
  test('62.8788% share', () =>
  {
    expect(estSeatProbability(0.628788)).toBeCloseTo(0.999358);
  });
  test('63.1818% share', () =>
  {
    expect(estSeatProbability(0.631818)).toBeCloseTo(0.999509);
  });
  test('63.4848% share', () =>
  {
    expect(estSeatProbability(0.634848)).toBeCloseTo(0.999626);
  });
  test('63.7879% share', () =>
  {
    expect(estSeatProbability(0.637879)).toBeCloseTo(0.999717);
  });
  test('64.0909% share', () =>
  {
    expect(estSeatProbability(0.640909)).toBeCloseTo(0.999786);
  });
  test('64.3939% share', () =>
  {
    expect(estSeatProbability(0.643939)).toBeCloseTo(0.999840);
  });
  test('64.6970% share', () =>
  {
    expect(estSeatProbability(0.646970)).toBeCloseTo(0.999881);
  });
  test('65.0000% share', () =>
  {
    expect(estSeatProbability(0.650000)).toBeCloseTo(0.999912);
  });
});

describe('Estimate probable seats', () =>
{
  const rV: T.VfArray = [
    0.678999,
    0.575848,
    0.480675,
    0.389881,
    0.361222,
    0.491961,
    0.540539
  ];
  // Benchmarks from Python code
  const Sf: number[] = [
    0.9999961789873051,
    0.9710331984032442,
    0.3145034920338179,
    0.0029528202902014966,
    0.0002607625652328305,
    0.4203590611657488,
    0.8445833342516753
  ];
  test('CO districts', () =>
  {
    expect(estSeatProbability(rV[0])).toBeCloseTo(Sf[0]);
    expect(estSeatProbability(rV[1])).toBeCloseTo(Sf[1]);
    expect(estSeatProbability(rV[2])).toBeCloseTo(Sf[2]);
    expect(estSeatProbability(rV[3])).toBeCloseTo(Sf[3]);
    expect(estSeatProbability(rV[4])).toBeCloseTo(Sf[4]);
    expect(estSeatProbability(rV[5])).toBeCloseTo(Sf[5]);
    expect(estSeatProbability(rV[6])).toBeCloseTo(Sf[6]);
  });
  test('CO probable seats', () =>
  {
    expect(estSeats(rV)).toBeCloseTo(3.5536888476972255);
  });
  test('CO probable seat fraction', () =>
  {
    expect(estSeats(rV) / 7).toBeCloseTo(0.507669835);
  });
});

describe('Estimate seat probabilities (competitive)', () =>
{
  const range: number[] = C.competitiveDistribution()

  test('Below 45.00% share', () =>
  {
    expect(estSeatProbability(0.400, range)).toBeCloseTo(0.0);
  });
  test('45.00% share', () =>
  {
    expect(estSeatProbability(0.450, range)).toBeCloseTo(estSeatProbability(0.400));
  });
  test('46.00% share', () =>
  {
    expect(estSeatProbability(0.460, range)).toBeCloseTo(estSeatProbability(0.420));
  });
  test('47.00% share', () =>
  {
    expect(estSeatProbability(0.470, range)).toBeCloseTo(estSeatProbability(0.440));
  });
  test('48.00% share', () =>
  {
    expect(estSeatProbability(0.480, range)).toBeCloseTo(estSeatProbability(0.460));
  });
  test('49.00% share', () =>
  {
    expect(estSeatProbability(0.490, range)).toBeCloseTo(estSeatProbability(0.480));
  });
  test('49.50% share', () =>
  {
    expect(estSeatProbability(0.495, range)).toBeCloseTo(estSeatProbability(0.490));
  });
  test('50.00% share', () =>
  {
    expect(estSeatProbability(0.500, range)).toBeCloseTo(estSeatProbability(0.500));
  });
  test('50.50% share', () =>
  {
    expect(estSeatProbability(0.505, range)).toBeCloseTo(estSeatProbability(0.510));
  });
  test('51.00% share', () =>
  {
    expect(estSeatProbability(0.510, range)).toBeCloseTo(estSeatProbability(0.520));
  });
  test('52.00% share', () =>
  {
    expect(estSeatProbability(0.520, range)).toBeCloseTo(estSeatProbability(0.540));
  });
  test('53.00% share', () =>
  {
    expect(estSeatProbability(0.530, range)).toBeCloseTo(estSeatProbability(0.560));
  });
  test('54.00% share', () =>
  {
    expect(estSeatProbability(0.540, range)).toBeCloseTo(estSeatProbability(0.580));
  });
  test('55.00% share', () =>
  {
    expect(estSeatProbability(0.550, range)).toBeCloseTo(estSeatProbability(0.600));
  });
  test('Above 55.00% share', () =>
  {
    expect(estSeatProbability(0.600, range)).toBeCloseTo(1.0);
  });
});

describe('Estimate district responsiveness', () =>
{
  test('35.0000% share', () =>
  {
    expect(estDistrictResponsiveness(0.350000)).toBeCloseTo(0.000354);
  });
  test('35.3030% share', () =>
  {
    expect(estDistrictResponsiveness(0.353030)).toBeCloseTo(0.000477);
  });
  test('35.6061% share', () =>
  {
    expect(estDistrictResponsiveness(0.356061)).toBeCloseTo(0.000640);
  });
  test('35.9091% share', () =>
  {
    expect(estDistrictResponsiveness(0.359091)).toBeCloseTo(0.000854);
  });
  test('36.2121% share', () =>
  {
    expect(estDistrictResponsiveness(0.362121)).toBeCloseTo(0.001134);
  });
  test('36.5152% share', () =>
  {
    expect(estDistrictResponsiveness(0.365152)).toBeCloseTo(0.001496);
  });
  test('36.8182% share', () =>
  {
    expect(estDistrictResponsiveness(0.368182)).toBeCloseTo(0.001964);
  });
  test('37.1212% share', () =>
  {
    expect(estDistrictResponsiveness(0.371212)).toBeCloseTo(0.002565);
  });
  test('37.4242% share', () =>
  {
    expect(estDistrictResponsiveness(0.374242)).toBeCloseTo(0.003331);
  });
  test('37.7273% share', () =>
  {
    expect(estDistrictResponsiveness(0.377273)).toBeCloseTo(0.004303);
  });
  test('38.0303% share', () =>
  {
    expect(estDistrictResponsiveness(0.380303)).toBeCloseTo(0.005528);
  });
  test('38.3333% share', () =>
  {
    expect(estDistrictResponsiveness(0.383333)).toBeCloseTo(0.007063);
  });
  test('38.6364% share', () =>
  {
    expect(estDistrictResponsiveness(0.386364)).toBeCloseTo(0.008977);
  });
  test('38.9394% share', () =>
  {
    expect(estDistrictResponsiveness(0.389394)).toBeCloseTo(0.011347);
  });
  test('39.2424% share', () =>
  {
    expect(estDistrictResponsiveness(0.392424)).toBeCloseTo(0.014265);
  });
  test('39.5455% share', () =>
  {
    expect(estDistrictResponsiveness(0.395455)).toBeCloseTo(0.017837);
  });
  test('39.8485% share', () =>
  {
    expect(estDistrictResponsiveness(0.398485)).toBeCloseTo(0.022181);
  });
  test('40.1515% share', () =>
  {
    expect(estDistrictResponsiveness(0.401515)).toBeCloseTo(0.027433);
  });
  test('40.4545% share', () =>
  {
    expect(estDistrictResponsiveness(0.404545)).toBeCloseTo(0.033742);
  });
  test('40.7576% share', () =>
  {
    expect(estDistrictResponsiveness(0.407576)).toBeCloseTo(0.041274);
  });
  test('41.0606% share', () =>
  {
    expect(estDistrictResponsiveness(0.410606)).toBeCloseTo(0.050208);
  });
  test('41.3636% share', () =>
  {
    expect(estDistrictResponsiveness(0.413636)).toBeCloseTo(0.060735);
  });
  test('41.6667% share', () =>
  {
    expect(estDistrictResponsiveness(0.416667)).toBeCloseTo(0.073056);
  });
  test('41.9697% share', () =>
  {
    expect(estDistrictResponsiveness(0.419697)).toBeCloseTo(0.087380);
  });
  test('42.2727% share', () =>
  {
    expect(estDistrictResponsiveness(0.422727)).toBeCloseTo(0.103914);
  });
  test('42.5758% share', () =>
  {
    expect(estDistrictResponsiveness(0.425758)).toBeCloseTo(0.122865);
  });
  test('42.8788% share', () =>
  {
    expect(estDistrictResponsiveness(0.428788)).toBeCloseTo(0.144424);
  });
  test('43.1818% share', () =>
  {
    expect(estDistrictResponsiveness(0.431818)).toBeCloseTo(0.168765);
  });
  test('43.4848% share', () =>
  {
    expect(estDistrictResponsiveness(0.434848)).toBeCloseTo(0.196033);
  });
  test('43.7879% share', () =>
  {
    expect(estDistrictResponsiveness(0.437879)).toBeCloseTo(0.226332);
  });
  test('44.0909% share', () =>
  {
    expect(estDistrictResponsiveness(0.440909)).toBeCloseTo(0.259716);
  });
  test('44.3939% share', () =>
  {
    expect(estDistrictResponsiveness(0.443939)).toBeCloseTo(0.296180);
  });
  test('44.6970% share', () =>
  {
    expect(estDistrictResponsiveness(0.446970)).toBeCloseTo(0.335645);
  });
  test('45.0000% share', () =>
  {
    expect(estDistrictResponsiveness(0.450000)).toBeCloseTo(0.377952);
  });
  test('45.3030% share', () =>
  {
    expect(estDistrictResponsiveness(0.453030)).toBeCloseTo(0.422853);
  });
  test('45.6061% share', () =>
  {
    expect(estDistrictResponsiveness(0.456061)).toBeCloseTo(0.470006);
  });
  test('45.9091% share', () =>
  {
    expect(estDistrictResponsiveness(0.459091)).toBeCloseTo(0.518970);
  });
  test('46.2121% share', () =>
  {
    expect(estDistrictResponsiveness(0.462121)).toBeCloseTo(0.569210);
  });
  test('46.5152% share', () =>
  {
    expect(estDistrictResponsiveness(0.465152)).toBeCloseTo(0.620098);
  });
  test('46.8182% share', () =>
  {
    expect(estDistrictResponsiveness(0.468182)).toBeCloseTo(0.670925);
  });
  test('47.1212% share', () =>
  {
    expect(estDistrictResponsiveness(0.471212)).toBeCloseTo(0.720911);
  });
  test('47.4242% share', () =>
  {
    expect(estDistrictResponsiveness(0.474242)).toBeCloseTo(0.769230);
  });
  test('47.7273% share', () =>
  {
    expect(estDistrictResponsiveness(0.477273)).toBeCloseTo(0.815024);
  });
  test('48.0303% share', () =>
  {
    expect(estDistrictResponsiveness(0.480303)).toBeCloseTo(0.857433);
  });
  test('48.3333% share', () =>
  {
    expect(estDistrictResponsiveness(0.483333)).toBeCloseTo(0.895621);
  });
  test('48.6364% share', () =>
  {
    expect(estDistrictResponsiveness(0.486364)).toBeCloseTo(0.928803);
  });
  test('48.9394% share', () =>
  {
    expect(estDistrictResponsiveness(0.489394)).toBeCloseTo(0.956274);
  });
  test('49.2424% share', () =>
  {
    expect(estDistrictResponsiveness(0.492424)).toBeCloseTo(0.977435);
  });
  test('49.5455% share', () =>
  {
    expect(estDistrictResponsiveness(0.495455)).toBeCloseTo(0.991814);
  });
  test('49.8485% share', () =>
  {
    expect(estDistrictResponsiveness(0.498485)).toBeCloseTo(0.999087);
  });
  test('50.1515% share', () =>
  {
    expect(estDistrictResponsiveness(0.501515)).toBeCloseTo(0.999087);
  });
  test('50.4545% share', () =>
  {
    expect(estDistrictResponsiveness(0.504545)).toBeCloseTo(0.991814);
  });
  test('50.7576% share', () =>
  {
    expect(estDistrictResponsiveness(0.507576)).toBeCloseTo(0.977435);
  });
  test('51.0606% share', () =>
  {
    expect(estDistrictResponsiveness(0.510606)).toBeCloseTo(0.956274);
  });
  test('51.3636% share', () =>
  {
    expect(estDistrictResponsiveness(0.513636)).toBeCloseTo(0.928803);
  });
  test('51.6667% share', () =>
  {
    expect(estDistrictResponsiveness(0.516667)).toBeCloseTo(0.895621);
  });
  test('51.9697% share', () =>
  {
    expect(estDistrictResponsiveness(0.519697)).toBeCloseTo(0.857433);
  });
  test('52.2727% share', () =>
  {
    expect(estDistrictResponsiveness(0.522727)).toBeCloseTo(0.815024);
  });
  test('52.5758% share', () =>
  {
    expect(estDistrictResponsiveness(0.525758)).toBeCloseTo(0.769230);
  });
  test('52.8788% share', () =>
  {
    expect(estDistrictResponsiveness(0.528788)).toBeCloseTo(0.720911);
  });
  test('53.1818% share', () =>
  {
    expect(estDistrictResponsiveness(0.531818)).toBeCloseTo(0.670925);
  });
  test('53.4848% share', () =>
  {
    expect(estDistrictResponsiveness(0.534848)).toBeCloseTo(0.620098);
  });
  test('53.7879% share', () =>
  {
    expect(estDistrictResponsiveness(0.537879)).toBeCloseTo(0.569210);
  });
  test('54.0909% share', () =>
  {
    expect(estDistrictResponsiveness(0.540909)).toBeCloseTo(0.518970);
  });
  test('54.3939% share', () =>
  {
    expect(estDistrictResponsiveness(0.543939)).toBeCloseTo(0.470006);
  });
  test('54.6970% share', () =>
  {
    expect(estDistrictResponsiveness(0.546970)).toBeCloseTo(0.422853);
  });
  test('55.0000% share', () =>
  {
    expect(estDistrictResponsiveness(0.550000)).toBeCloseTo(0.377952);
  });
  test('55.3030% share', () =>
  {
    expect(estDistrictResponsiveness(0.553030)).toBeCloseTo(0.335645);
  });
  test('55.6061% share', () =>
  {
    expect(estDistrictResponsiveness(0.556061)).toBeCloseTo(0.296180);
  });
  test('55.9091% share', () =>
  {
    expect(estDistrictResponsiveness(0.559091)).toBeCloseTo(0.259716);
  });
  test('56.2121% share', () =>
  {
    expect(estDistrictResponsiveness(0.562121)).toBeCloseTo(0.226332);
  });
  test('56.5152% share', () =>
  {
    expect(estDistrictResponsiveness(0.565152)).toBeCloseTo(0.196033);
  });
  test('56.8182% share', () =>
  {
    expect(estDistrictResponsiveness(0.568182)).toBeCloseTo(0.168765);
  });
  test('57.1212% share', () =>
  {
    expect(estDistrictResponsiveness(0.571212)).toBeCloseTo(0.144424);
  });
  test('57.4242% share', () =>
  {
    expect(estDistrictResponsiveness(0.574242)).toBeCloseTo(0.122865);
  });
  test('57.7273% share', () =>
  {
    expect(estDistrictResponsiveness(0.577273)).toBeCloseTo(0.103914);
  });
  test('58.0303% share', () =>
  {
    expect(estDistrictResponsiveness(0.580303)).toBeCloseTo(0.087380);
  });
  test('58.3333% share', () =>
  {
    expect(estDistrictResponsiveness(0.583333)).toBeCloseTo(0.073056);
  });
  test('58.6364% share', () =>
  {
    expect(estDistrictResponsiveness(0.586364)).toBeCloseTo(0.060735);
  });
  test('58.9394% share', () =>
  {
    expect(estDistrictResponsiveness(0.589394)).toBeCloseTo(0.050208);
  });
  test('59.2424% share', () =>
  {
    expect(estDistrictResponsiveness(0.592424)).toBeCloseTo(0.041274);
  });
  test('59.5455% share', () =>
  {
    expect(estDistrictResponsiveness(0.595455)).toBeCloseTo(0.033742);
  });
  test('59.8485% share', () =>
  {
    expect(estDistrictResponsiveness(0.598485)).toBeCloseTo(0.027433);
  });
  test('60.1515% share', () =>
  {
    expect(estDistrictResponsiveness(0.601515)).toBeCloseTo(0.022181);
  });
  test('60.4545% share', () =>
  {
    expect(estDistrictResponsiveness(0.604545)).toBeCloseTo(0.017837);
  });
  test('60.7576% share', () =>
  {
    expect(estDistrictResponsiveness(0.607576)).toBeCloseTo(0.014265);
  });
  test('61.0606% share', () =>
  {
    expect(estDistrictResponsiveness(0.610606)).toBeCloseTo(0.011347);
  });
  test('61.3636% share', () =>
  {
    expect(estDistrictResponsiveness(0.613636)).toBeCloseTo(0.008977);
  });
  test('61.6667% share', () =>
  {
    expect(estDistrictResponsiveness(0.616667)).toBeCloseTo(0.007063);
  });
  test('61.9697% share', () =>
  {
    expect(estDistrictResponsiveness(0.619697)).toBeCloseTo(0.005528);
  });
  test('62.2727% share', () =>
  {
    expect(estDistrictResponsiveness(0.622727)).toBeCloseTo(0.004303);
  });
  test('62.5758% share', () =>
  {
    expect(estDistrictResponsiveness(0.625758)).toBeCloseTo(0.003331);
  });
  test('62.8788% share', () =>
  {
    expect(estDistrictResponsiveness(0.628788)).toBeCloseTo(0.002565);
  });
  test('63.1818% share', () =>
  {
    expect(estDistrictResponsiveness(0.631818)).toBeCloseTo(0.001964);
  });
  test('63.4848% share', () =>
  {
    expect(estDistrictResponsiveness(0.634848)).toBeCloseTo(0.001496);
  });
  test('63.7879% share', () =>
  {
    expect(estDistrictResponsiveness(0.637879)).toBeCloseTo(0.001134);
  });
  test('64.0909% share', () =>
  {
    expect(estDistrictResponsiveness(0.640909)).toBeCloseTo(0.000854);
  });
  test('64.3939% share', () =>
  {
    expect(estDistrictResponsiveness(0.643939)).toBeCloseTo(0.000640);
  });
  test('64.6970% share', () =>
  {
    expect(estDistrictResponsiveness(0.646970)).toBeCloseTo(0.000477);
  });
  test('65.0000% share', () =>
  {
    expect(estDistrictResponsiveness(0.650000)).toBeCloseTo(0.000354);
  });
});

describe('Estimate FPTP seats', () =>
{
  test('Shutout 0–3', () =>
  {
    const rV: T.VfArray = [0.40, 0.40, 0.40];
    expect(estFPTPSeats(rV)).toBe(0);
  });
  test('Sweep 3–0', () =>
  {
    const rV: T.VfArray = [0.60, 0.60, 0.60];
    expect(estFPTPSeats(rV)).toBe(3);
  });
  test('Split 1–2', () =>
  {
    const rV: T.VfArray = [(0.50 - U.EPSILON), (0.50 - U.EPSILON), (0.50 + U.EPSILON)];
    expect(estFPTPSeats(rV)).toBe(1);
  });
  test('Split 2–1', () =>
  {
    const rV: T.VfArray = [(0.50 + U.EPSILON), (0.50 + U.EPSILON), (0.50 - U.EPSILON)];
    expect(estFPTPSeats(rV)).toBe(2);
  });
  test('Perfectly balanced 0–3', () =>
  {
    const rV: T.VfArray = [0.50, 0.50, 0.50];
    expect(estFPTPSeats(rV)).toBe(0);
  });
})

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
})


