import
{
  ratePopulationDeviation,
  rateProportionality, extraBonus, adjustDeviation, isAntimajoritarian,
  ratePartisanBias,
  rateCompetitiveness,
  rateMinorityRepresentation,
  _rateCompactness, rateReock, ratePolsby,
  _rateSplitting, rateCountySplitting, rateDistrictSplitting, countySplitBest, countySplitWorst
} from '../../lib/rate/dra-ratings';

import * as C from '../../lib/rate/dra-config';
import * as S from '../../lib/rate/settings';
import * as T from '../../lib/types/all'


// POPULATION DEVIATION SCORING

describe('Population Deviation scorer', () =>
{
  const bLegislative = false;
  test('Population Deviation: in range', () =>
  {
    expect(ratePopulationDeviation(0.50 / 100, bLegislative)).toBe(45);
  });

  test('Population Deviation: min', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.BEG], bLegislative)).toBe(0);
  });

  test('Population Deviation: max', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.END], bLegislative)).toBe(100);
  });

  test('Population Deviation: too big', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.BEG] + S.EPSILON, bLegislative)).toBe(0);
  });

  test('Population Deviation: unnecessarily small', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.END] - S.EPSILON, bLegislative)).toBe(100);
  });
  test('Population Deviation: very large', () =>
  {
    expect(ratePopulationDeviation(2.3006, false)).toBe(0);
  });
});

describe('Population Deviation scorer (LD)', () =>
{
  const bLegislative = true;
  // Population for state legislative districting plans (w/ differnet threshold) 
  test('Population Deviation (LD): in range', () =>
  {
    expect(ratePopulationDeviation(5.00 / 100, bLegislative)).toBe(68);
  });

  test('Population Deviation (LD): min', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.BEG], bLegislative)).toBe(0);
  });

  test('Population Deviation (LD): max', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.END], bLegislative)).toBe(100);
  });

  test('Population Deviation (LD): too big', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.BEG] + S.EPSILON, bLegislative)).toBe(0);
  });

  test('Population Deviation (LD): unnecessarily small', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.END] - S.EPSILON, bLegislative)).toBe(100);
  });
});


// PROPORTIONALITY SCORING

describe('Acceptable extra seat share fraction', () =>
{
  test('Vf = 0.50', () =>
  {
    expect(extraBonus(0.50)).toBeCloseTo(0.00);
  });
  test('Vf = 0.55', () =>
  {
    expect(extraBonus(0.55)).toBeCloseTo(0.10 / 2);
  });
  test('Vf = 0.60', () =>
  {
    expect(extraBonus(0.60)).toBeCloseTo(0.20 / 2);
  });
  test('Vf = 0.45', () =>
  {
    expect(extraBonus(0.45)).toBeCloseTo(0.10 / 2);
  });
  test('Vf = 0.40', () =>
  {
    expect(extraBonus(0.40)).toBeCloseTo(0.20 / 2);
  });
})

describe('Adjust disproportionality for statewide vote share', () =>
{
  test('CA', () =>
  {
    const Vf = 0.64037;
    const bias = -0.1714;
    const extra = extraBonus(Vf);
    expect(extra).toBeCloseTo(0.1404);
    expect(adjustDeviation(Vf, bias, extra)).toBeCloseTo(-0.0310);
  });
  test('NC', () =>
  {
    const Vf = 0.488799;
    const bias = 0.2268;
    const extra = extraBonus(Vf);
    expect(extra).toBeCloseTo(0.0112);
    expect(adjustDeviation(Vf, bias, extra)).toBeCloseTo(0.2156);
  });
  test('OH', () =>
  {
    const Vf = 0.486929;
    const bias = 0.2367;
    const extra = extraBonus(Vf);
    expect(extra).toBeCloseTo(0.0131);
    expect(adjustDeviation(Vf, bias, extra)).toBeCloseTo(0.2236);
  });
  test('PA', () =>
  {
    const Vf = 0.51148;
    const bias = 0.0397;
    const extra = extraBonus(Vf);
    expect(extra).toBeCloseTo(0.0115);
    expect(adjustDeviation(Vf, bias, extra)).toBeCloseTo(bias);
  });
  test('TX', () =>
  {
    const Vf = 0.436994;
    const bias = 0.1216;
    const extra = extraBonus(Vf);
    expect(extra).toBeCloseTo(0.0630);
    expect(adjustDeviation(Vf, bias, extra)).toBeCloseTo(0.0586);
  });
})  // From hand-calculated benchmarks

describe('Detect antimajoritarian results', () =>
{
  const avgSVError = 0.02;
  test('Dem antimajoritarian', () =>
  {
    expect(isAntimajoritarian(0.5 - avgSVError - S.EPSILON, 0.50 + S.EPSILON)).toBe(true);
  });
  test('Rep antimajoritarian', () =>
  {
    expect(isAntimajoritarian(0.5 + avgSVError + S.EPSILON, 0.5 - S.EPSILON)).toBe(true);
  });
  test('Majority but not antimajoritarian', () =>
  {
    expect(isAntimajoritarian(0.51, 0.53)).toBe(false);
  });
  test('Minority but not antimajoritarian', () =>
  {
    expect(isAntimajoritarian(0.49, 0.47)).toBe(false);
  });
  test('Not big enough to be called antimajoritarian', () =>
  {
    expect(isAntimajoritarian(0.5 - S.EPSILON, 0.5 - S.EPSILON)).toBe(false);
  });
})

describe('Score proportionality, no winner bonus', () =>
{
  const Vf = 0.5;
  const Sf = 0.5;
  test('Completely unbiased', () =>
  {
    expect(rateProportionality(0.00, Vf, Sf)).toBe(100);
  });
  test('5% biased', () =>
  {
    expect(rateProportionality(0.05, Vf, Sf)).toBe(75);
  });
  test('10% biased', () =>
  {
    expect(rateProportionality(0.10, Vf, Sf)).toBe(50);
  });
  test('20% biased', () =>
  {
    expect(rateProportionality(0.20, Vf, Sf)).toBe(0);
  });
  test('25% biased', () =>
  {
    expect(rateProportionality(0.25, Vf, Sf)).toBe(0);
  });
  // 2/14/20 - Made the bias threshold a straight 20%, i.e., not dependent on N
  // test('bias w/ 20 districts', () =>
  // {
  //   expect(rateProportionality(0.06, Vf, Sf, 20)).toBe(0);
  // });
  test('Dem antimajoritarian', () =>
  {
    expect(rateProportionality(0.01, 0.48 - S.EPSILON, 0.5 + S.EPSILON)).toBe(0);
  });
  test('Rep antimajoritarian', () =>
  {
    expect(rateProportionality(0.01, 1 - 0.48 + S.EPSILON, 1 - 0.5 - S.EPSILON)).toBe(0);
  });
})

describe('Score proportionality, with winner bonus', () =>
{
  test('CA 116th', () =>
  {
    expect(rateProportionality(-0.1714, 0.6404, 43.0850 / 53)).toBe(84);
  });
  test('CO 116th', () =>
  {
    expect(rateProportionality(0.0006, 0.5286, 3.9959 / 7)).toBe(100);
  });
  test('IL 116th', () =>
  {
    expect(rateProportionality(-0.0585, 0.5838, 12.0531 / 18)).toBe(100);
  });
  test('MA 116th', () =>
  {
    expect(rateProportionality(-0.3331, 0.6321, 8.9985 / 9)).toBe(0);
  });
  test('MD 116th', () =>
  {
    expect(rateProportionality(-0.2500, 0.6336, 7.0000 / 8)).toBe(42);
  });
  test('NC 116th', () =>
  {
    expect(rateProportionality(0.2268, 0.4888, 3.0512 / 13)).toBe(0);
  });
  test('OH 116th', () =>
  {
    expect(rateProportionality(0.2367, 0.4869, 4.2120 / 16)).toBe(0);
  });
  // NOTE - Not considered antimajoritarian w/ a 2% average S(V) error.
  // test('PA 116th', () =>  // NOTE - 0 vs. 100 (!), because antimajoritarian
  // {
  //   expect(rateProportionality(0.0397, 0.5115, 8.2862 / 18)).toBe(0);
  // });
  test('SC 116th', () =>
  {
    expect(rateProportionality(0.2857, 0.4072, 1 / 7)).toBe(4);
  });
  test('TN 116th', () =>
  {
    expect(rateProportionality(0.1111, 0.3802, 2 / 9)).toBe(100);
  });
  test('TX 116th', () =>
  {
    expect(rateProportionality(0.1216, 0.4370, 11.6218 / 36)).toBe(71);
  });
})  // From hand-calculated benchmarks


// Partisan Bias SCORING

describe('Score partisan bias', () =>
{
  test('Sample states & measurements from Nagle & Ramsay paper', () =>
  {
    expect(ratePartisanBias(-0.0190, -0.0060)).toBe(81);  // CA
    expect(ratePartisanBias(+0.0580, +0.0160)).toBe(54);  // IL
    expect(ratePartisanBias(-0.0520, -0.0100)).toBe(63);  // MD
    expect(ratePartisanBias(+0.0640, +0.0100)).toBe(60);  // MA
    expect(ratePartisanBias(+0.0020, +0.0110)).toBe(83);  // CO
    expect(ratePartisanBias(+0.1980, +0.0430)).toBe(17);  // NC
    expect(ratePartisanBias(+0.1380, +0.0310)).toBe(27);  // OH
    expect(ratePartisanBias(+0.1610, +0.0440)).toBe(19);  // PA
    expect(ratePartisanBias(+0.1620, +0.0290)).toBe(26);  // TN
    expect(ratePartisanBias(+0.0500, +0.0120)).toBe(61);  // TX
    expect(ratePartisanBias(+0.1410, +0.0230)).toBe(33);  // SC
  });
})  // Verified these benchmarks w/ John Nagle


// Impact SCORING <<< DEPRECATED
/*
describe('Score impact, no winner bonus', () =>
{
  const Vf = 0.5;
  const Sf = 0.5;
  const N = 10;

  test('No impact', () =>
  {
    expect(scoreImpact(0.0, Vf, Sf, N)).toBe(100);
  });
  test('1 seat impact', () =>
  {
    expect(scoreImpact(1.0, Vf, Sf, N)).toBe(75);
  });
  test('2 seats impact', () =>
  {
    expect(scoreImpact(2.0, Vf, Sf, N)).toBe(50);
  });
  test('3 seats impact', () =>
  {
    expect(scoreImpact(3.0, Vf, Sf, N)).toBe(25);
  });
  test('4 seats impact', () =>
  {
    expect(scoreImpact(3.0, Vf, Sf, N)).toBe(25);
  });
  test('Threshold impact', () =>
  {
    expect(scoreImpact(C.unearnedThreshold(), Vf, Sf, N)).toBe(0);
  });
  test('Excessive impact', () =>
  {
    expect(scoreImpact(C.unearnedThreshold() + S.EPSILON, Vf, Sf, N)).toBe(0);
  });
})

describe('Score impact, with winner bonus', () =>
{
  test('CA 116th', () =>
  {
    expect(scoreImpact(-9.0850, 0.6404, 0.8129, 53)).toBe(59);
  });
  test('MA 116th', () =>
  {
    expect(scoreImpact(-2.9985, 0.6321, 0.9998, 9)).toBe(55);
  });
  test('IL 116th', () =>
  {
    expect(scoreImpact(-1.0531, 0.5838, 0.6696, 18)).toBe(100);
  });
  test('CO 116th', () =>
  {
    expect(scoreImpact(0.0041, 0.5286, 0.5708, 7)).toBe(100);
  });
  test('MD 116th', () =>
  {
    expect(scoreImpact(-2.0000, 0.6336, 0.8750, 8)).toBe(77);
  });
  // NOTE - Not considered antimajoritarian w/ a 2% average S(V) error.
  // test('PA 116th', () =>  // NOTE - 0 vs. 100, because antimajoritarian
  // {
  //   expect(scoreImpact(0.7138, 0.5115, 0.4603, 18)).toBe(0);
  // });
  test('NC 116th', () =>
  {
    expect(scoreImpact(2.9488, 0.4888, 0.2347, 13)).toBe(30);
  });
  test('OH 116th', () =>
  {
    expect(scoreImpact(3.7880, 0.4869, 0.2633, 16)).toBe(11);
  });
  test('SC 116th', () =>
  {
    expect(scoreImpact(2.0000, 0.4072, 0.1429, 7)).toBe(66);
  });
  test('TN 116th', () =>
  {
    expect(scoreImpact(1.0000, 0.3802, 0.2222, 9)).toBe(100);
  });
  test('TX 116th', () =>
  {
    expect(scoreImpact(4.3782, 0.4370, 0.3228, 36)).toBe(47);
  });
})  // From hand-calculated benchmarks
*/


// COMPETITIVENESS SCORING

describe('Score competitiveness', () =>
{
  test('Completely uncompetitive', () =>
  {
    expect(rateCompetitiveness(0.00)).toBe(0);
  });
  test('25% / 50% competitive', () =>
  {
    expect(rateCompetitiveness(0.25)).toBe(33);
  });
  test('50% / 50% competitive', () =>
  {
    expect(rateCompetitiveness(0.50)).toBe(67);
  });
  test('Perfectly competitive', () =>
  {
    expect(rateCompetitiveness(0.75)).toBe(100);
  });
  test('Over competitive', () =>
  {
    expect(rateCompetitiveness(0.80)).toBe(100);
  });
})


// MINORITY REPRESENTATION SCORING

describe('Score minority opportunity', () =>
{
  const bonus = 100;  // C.minorityBonus();
  test('No possibilities', () =>
  {
    expect(rateMinorityRepresentation(1, 0, 0, 0)).toBe(0);
  });
  test('No opportunities', () =>
  {
    expect(rateMinorityRepresentation(0, 10, 0, 0)).toBe(0);
  });
  test('Half', () =>
  {
    expect(rateMinorityRepresentation(5, 10, 0, 0)).toBe(Math.round(bonus / 2));
  });
  test('All', () =>
  {
    expect(rateMinorityRepresentation(10, 10, 0, 0)).toBe(bonus);
  });
  test('Extra', () =>
  {
    expect(rateMinorityRepresentation(11, 10, 0, 0)).toBe(bonus);
  });
});


// COMPACTNESS SCORING

describe('Weight compactness measures', () =>
{
  test('Weight Reock & Polsby-Popper compactness', () =>
  {
    expect(_rateCompactness(30, 60)).toBeCloseTo(45);
  });
})

describe('Reock compactness scorer', () =>
{
  test('Reock: in range (AL)', () =>
  {
    expect(rateReock(0.3848)).toBe(54);
  });

  test('Reock: in range (NC)', () =>
  {
    expect(rateReock(0.3373)).toBe(35);
  });

  test('Reock: min', () =>
  {
    expect(rateReock(C.reockRange()[C.BEG])).toBe(0);
  });

  test('Reock: max', () =>
  {
    expect(rateReock(C.reockRange()[C.END])).toBe(100);
  });

  test('Reock: too low', () =>
  {
    expect(rateReock(C.reockRange()[C.BEG] - S.EPSILON)).toBe(0);
  });

  test('Reock: too high', () =>
  {
    expect(rateReock(C.reockRange()[C.END] + S.EPSILON)).toBe(100);
  });
});

describe('Polsby-Popper compactness scorer', () =>
{
  test('Polsby-Popper: in range (AL)', () =>
  {
    expect(ratePolsby(0.1860)).toBe(21);
  });

  test('Polsby-Popper: in range (NC)', () =>
  {
    expect(ratePolsby(0.2418)).toBe(35);
  });

  test('Polsby-Popper: min', () =>
  {
    expect(ratePolsby(C.polsbyRange()[C.BEG])).toBe(0);
  });

  test('Polsby-Popper: max', () =>
  {
    expect(ratePolsby(C.polsbyRange()[C.END])).toBe(100);
  });

  test('Polsby-Popper: too low', () =>
  {
    expect(ratePolsby(C.polsbyRange()[C.BEG] - S.EPSILON)).toBe(0);
  });

  test('Polsby-Popper: too high', () =>
  {
    expect(ratePolsby(C.polsbyRange()[C.END] + S.EPSILON)).toBe(100);
  });
});


// SPLITTING SCORING

describe('Weight splitting measures', () =>
{
  test('Weight county & district splitting', () =>
  {
    expect(_rateSplitting(30, 60)).toBeCloseTo(45);
  });
})

describe('County-district splitting scorer', () =>
{
  test('AZ county splitting', () =>
  {
    expect(rateCountySplitting(1.352, 15, 9)).toBe(44);
  });
  test('MD county splitting', () =>
  {
    expect(rateCountySplitting(1.531, 24, 8)).toBe(0);
  });
  test('NC county splitting', () =>
  {
    expect(rateCountySplitting(1.152, 100, 13)).toBe(65);
  });
  test('PA county splitting', () =>
  {
    expect(rateCountySplitting(1.178, 67, 18)).toBe(68);
  });
  test('VA county splitting', () =>
  {
    expect(rateCountySplitting(1.214, 133, 11)).toBe(43);
  });

  test('County splitting: min', () =>
  {
    const avgBest = countySplitBest(15, 9);
    expect(rateCountySplitting(avgBest, 15, 9)).toBe(99);
    // expect(rateCountySplitting(avgBest, 15, 9)).toBe(100);
  });

  test('County splitting: max', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(rateCountySplitting(avgWorst, 15, 9)).toBe(0);
  });

  test('County splitting: too much', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(rateCountySplitting(avgWorst + S.EPSILON, 15, 9)).toBe(0);
  });
});

describe('District-county splitting scorer', () =>
{
  test('AZ district splitting: in range', () =>
  {
    expect(rateDistrictSplitting(1.424)).toBe(61);
  });
  test('MD district splitting: in range', () =>
  {
    expect(rateDistrictSplitting(1.760)).toBe(0);
  });
  test('NC district splitting: in range', () =>
  {
    expect(rateDistrictSplitting(1.519)).toBe(38);
  });
  test('PA district splitting: in range', () =>
  {
    expect(rateDistrictSplitting(1.690)).toBe(0);
  });
  test('VA district splitting: in range', () =>
  {
    expect(rateDistrictSplitting(1.424)).toBe(61);
  });

  test('District splitting: min', () =>
  {
    expect(rateDistrictSplitting(C.districtSplittingRange(T.DistrictType.Congressional)[C.END])).toBe(0);
  });

  test('District splitting: max', () =>
  {
    expect(rateDistrictSplitting(C.districtSplittingRange(T.DistrictType.Congressional)[C.BEG])).toBe(99);
    // expect(rateDistrictSplitting(C.districtSplittingRange(T.DistrictType.Congressional)[C.BEG])).toBe(100);
  });

  test('District splitting: too much', () =>
  {
    expect(rateDistrictSplitting(C.districtSplittingRange(T.DistrictType.Congressional)[C.END] + S.EPSILON)).toBe(0);
  });
});
