import
{
  ratePopulationDeviation,
  rateProportionality, isAntimajoritarian,
  ratePartisanBias,
  rateCompetitiveness,
  rateMinorityRepresentation
} from '../../lib/rate/all';

import
{
  extraBonus, adjustDeviation,
  rateCompactness, rateReock, ratePolsby,
  rateSplitting, rateCountySplitting, rateDistrictSplitting, bestTarget,
  // Legacy ratings
  rateSplittingLegacy, rateCountySplittingLegacy, rateDistrictSplittingLegacy, countySplitBest, countySplitWorst
} from '../../lib/rate/dra-ratings';

import * as C from '../../lib/rate/dra-config';
import * as U from '../../lib/utils/all';
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
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.BEG] + U.EPSILON, bLegislative)).toBe(0);
  });

  test('Population Deviation: unnecessarily small', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.END] - U.EPSILON, bLegislative)).toBe(100);
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
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.BEG] + U.EPSILON, bLegislative)).toBe(0);
  });

  test('Population Deviation (LD): unnecessarily small', () =>
  {
    expect(ratePopulationDeviation(C.popdevRange(bLegislative)[C.END] - U.EPSILON, bLegislative)).toBe(100);
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
    expect(isAntimajoritarian(0.5 - avgSVError - U.EPSILON, 0.50 + U.EPSILON)).toBe(true);
  });
  test('Rep antimajoritarian', () =>
  {
    expect(isAntimajoritarian(0.5 + avgSVError + U.EPSILON, 0.5 - U.EPSILON)).toBe(true);
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
    expect(isAntimajoritarian(0.5 - U.EPSILON, 0.5 - U.EPSILON)).toBe(false);
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
    expect(rateProportionality(0.01, 0.48 - U.EPSILON, 0.5 + U.EPSILON)).toBe(0);
  });
  test('Rep antimajoritarian', () =>
  {
    expect(rateProportionality(0.01, 1 - 0.48 + U.EPSILON, 1 - 0.5 - U.EPSILON)).toBe(0);
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
    expect(scoreImpact(C.unearnedThreshold() + U.EPSILON, Vf, Sf, N)).toBe(0);
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

  test('Combined score', () =>
  {
    // * Opportunity districts = (12.56 / 18) * 100 <<< 70
    // * Coalition districts = (22.92 / 18) * 100 <<< capped
    // * Combined = 70 + [0.5 * (100 - 70)]
    const correct = 85;
    expect(rateMinorityRepresentation(12.56, 18, 22.92, 18)).toBe(correct);
  });
});


// COMPACTNESS SCORING

describe('Weight compactness measures', () =>
{
  test('Weight Reock & Polsby-Popper compactness', () =>
  {
    expect(rateCompactness(30, 60)).toBeCloseTo(45);
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
    expect(rateReock(C.reockRange()[C.BEG] - U.EPSILON)).toBe(0);
  });

  test('Reock: too high', () =>
  {
    expect(rateReock(C.reockRange()[C.END] + U.EPSILON)).toBe(100);
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
    expect(ratePolsby(C.polsbyRange()[C.BEG] - U.EPSILON)).toBe(0);
  });

  test('Polsby-Popper: too high', () =>
  {
    expect(ratePolsby(C.polsbyRange()[C.END] + U.EPSILON)).toBe(100);
  });
});


// SPLITTING SCORING

describe('Combine splitting ratings', () =>
{
  test('Some county- & district splitting', () =>
  {
    expect(rateSplitting(30, 60)).toBe(45);
  });
  test('Little county- & district- splitting', () =>
  {
    expect(rateSplitting(99, 100)).toBe(99);
  });
  test('No county- & district- splitting', () =>
  {
    expect(rateSplitting(100, 100)).toBe(100);
  });
});

// XX	C	CD	C_DC'	C_CD'	UD	U_DC'	U_CD'	LD	L_DC'	L_CD'	C_CT	C_DT	C_RC	C_RD	C_R'	U_CT	U_DT	U_RC	U_RD	U_R'	L_CT	L_DT	L_RC	L_RD	L_R'
// AL	67	7	1.1100	1.4470	35	1.4200	1.4500	105	1.6400	1.2600	1.17	1.26	100	55	78	1.21	1.26	48	55	52	1.26	1.22	10	91	51
// AZ	15	9	1.3520	1.4240	30	1.7100	1.2000				1.21	1.26	66	61	64	1.26	1.21	0	100	50	 	 	 	 	 
// CA	58	53	1.7890	1.2530	40	1.7400	1.3400	80	1.7000	1.1900	1.25	1.26	0	100	50	1.23	1.26	0	81	41	1.26	1.23	0	100	50
// CO	64	7	1.1960	1.5010	35	1.2100	1.0800	65	1.2500	1.0700	1.17	1.26	93	43	68	1.21	1.26	100	100	100	1.26	1.26	100	100	100
// CT	8	5	1.4800	1.5310	36	2.0800	1.1700	151	1.6800	1.0500	1.21	1.26	33	35	34	1.26	1.18	0	100	50	1.26	1.16	0	100	50
// GA	159	14	1.2960	1.6400	56	1.5800	1.3900	180	1.7800	1.2700	1.17	1.26	67	10	39	1.19	1.26	3	69	36	1.26	1.25	0	95	48
// IA	99	4	1.0000	1.0000	50	1.3300	1.2900	100	1.2600	1.2000	1.16	1.26	100	100	100	1.21	1.26	70	93	82	1.26	1.26	100	100	100
// KY	120	6	1.0360	1.2230	38	1.2100	1.0800	100	1.4300	1.2000	1.16	1.26	100	100	100	1.19	1.26	95	100	98	1.24	1.26	55	100	78
// PA	67	18	1.1780	1.4080	50	1.5200	1.3000	203	1.6500	1.1300	1.19	1.26	100	65	83	1.23	1.26	30	90	60	1.26	1.19	7	100	54
// TN	95	9	1.0710	1.2670	33	1.1400	1.1000	99	1.1000	1.1400	1.17	1.26	100	98	99	1.19	1.26	100	100	100	1.26	1.25	100	100	100
// TX	254	36	1.5790	1.4280	31	1.4600	1.3300	150	1.0800	1.0400	1.17	1.26	0	60	30	1.17	1.26	26	83	55	1.22	1.26	100	100	100
// VA	133	11	1.2140	1.6900	40	1.6400	1.7000	100	1.8400	1.4200	1.17	1.26	88	0	44	1.19	1.26	0	0	0	1.23	1.26	0	62	31

describe('Rate states', () =>
{
  test('AL splitting', () =>
  {
    const nC = 67;
    const nCD = 7;
    const nUD = 35;
    const nLD = 105;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.17);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.21);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.22);

    expect(rateCountySplitting(1.1100, nC, nCD)).toBe(99);
    expect(rateDistrictSplitting(1.4470, nC, nCD)).toBe(55);
    expect(rateSplitting(99, 55)).toBe(77);

    expect(rateCountySplitting(1.4200, nC, nUD)).toBe(48);
    expect(rateDistrictSplitting(1.4500, nC, nUD)).toBe(54);
    expect(rateSplitting(48, 54)).toBe(51);

    expect(rateCountySplitting(1.6400, nC, nLD)).toBe(9);
    expect(rateDistrictSplitting(1.2600, nC, nLD)).toBe(91);
    expect(rateSplitting(9, 91)).toBe(50);
  });
  test('AZ splitting', () =>
  {
    const nC = 15;
    const nCD = 9;
    const nUD = 30;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.21);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.21);

    expect(rateCountySplitting(1.3520, nC, nCD)).toBe(65);
    expect(rateDistrictSplitting(1.4240, nC, nCD)).toBe(61);
    expect(rateSplitting(65, 61)).toBe(63);

    expect(rateCountySplitting(1.7100, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.2000, nC, nUD)).toBe(99);
    expect(rateSplitting(0, 99)).toBe(50);
  });
  test('CA splitting', () =>
  {
    const nC = 58;
    const nCD = 53;
    const nUD = 40;
    const nLD = 80;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.25);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.23);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.23);

    expect(rateCountySplitting(1.7890, nC, nCD)).toBe(0);
    expect(rateDistrictSplitting(1.2530, nC, nCD)).toBe(99);
    expect(rateSplitting(0, 99)).toBe(50);

    expect(rateCountySplitting(1.7400, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.3400, nC, nUD)).toBe(81);
    expect(rateSplitting(0, 81)).toBe(41);

    expect(rateCountySplitting(1.7000, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.1900, nC, nLD)).toBe(99);
    expect(rateSplitting(0, 99)).toBe(50);
  });
  test('CO splitting', () =>
  {
    const nC = 64;
    const nCD = 7;
    const nUD = 35;
    const nLD = 65;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.17);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.21);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.26);

    expect(rateCountySplitting(1.1960, nC, nCD)).toBe(93);
    expect(rateDistrictSplitting(1.5010, nC, nCD)).toBe(42);
    expect(rateSplitting(93, 42)).toBe(68);

    expect(rateCountySplitting(1.2100, nC, nUD)).toBe(99);
    expect(rateDistrictSplitting(1.0800, nC, nUD)).toBe(99);
    expect(rateSplitting(99, 99)).toBe(99);

    expect(rateCountySplitting(1.2500, nC, nLD)).toBe(99);
    expect(rateDistrictSplitting(1.0700, nC, nLD)).toBe(99);
    expect(rateSplitting(99, 99)).toBe(99);
  });
  test('CT splitting', () =>
  {
    const nC = 8;
    const nCD = 5;
    const nUD = 36;
    const nLD = 151;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.21);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.18);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.16);

    expect(rateCountySplitting(1.4800, nC, nCD)).toBe(32);
    expect(rateDistrictSplitting(1.5310, nC, nCD)).toBe(35);
    expect(rateSplitting(33, 35)).toBe(34);

    expect(rateCountySplitting(2.0800, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.1700, nC, nUD)).toBe(99);
    expect(rateSplitting(0, 99)).toBe(50);

    expect(rateCountySplitting(1.6800, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.0500, nC, nLD)).toBe(99);
    expect(rateSplitting(0, 99)).toBe(50);
  });
  test('GA splitting', () =>
  {
    const nC = 159;
    const nCD = 14;
    const nUD = 56;
    const nLD = 180;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.17);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.19);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.25);
  });
  test('IA splitting', () =>
  {
    const nC = 99;
    const nCD = 4;
    const nUD = 50;
    const nLD = 100;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.16);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.21);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.26);
  });
  test('KY splitting', () =>
  {
    const nC = 120;
    const nCD = 6;
    const nUD = 38;
    const nLD = 100;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.16);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.19);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.24);
  });
  test('PA splitting', () =>
  {
    const nC = 67;
    const nCD = 18;
    const nUD = 50;
    const nLD = 203;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.19);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.23);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.19);
  });
  test('TN splitting', () =>
  {
    const nC = 95;
    const nCD = 9;
    const nUD = 33;
    const nLD = 99;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.17);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.19);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.25);
  });
  test('TX splitting', () =>
  {
    const nC = 254;
    const nCD = 36;
    const nUD = 31;
    const nLD = 150;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.17);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.17);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.22);
  });
  test('VA splitting', () =>
  {
    const nC = 133;
    const nCD = 11;
    const nUD = 40;
    const nLD = 100;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.17);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.19);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.23);
  });
});

/*
describe('County-district splitting scorer', () =>
{
  test('AZ county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.352, 15, 9)).toBe(44);
  });
  test('MD county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.531, 24, 8)).toBe(0);
  });
  test('NC county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.152, 100, 13)).toBe(65);
  });
  test('PA county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.178, 67, 18)).toBe(68);
  });
  test('VA county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.214, 133, 11)).toBe(43);
  });

  test('County splitting: min', () =>
  {
    const avgBest = countySplitBest(15, 9);
    expect(rateCountySplittingLegacy(avgBest, 15, 9)).toBe(99);
    // expect(rateCountySplittingLegacy(avgBest, 15, 9)).toBe(100);
  });

  test('County splitting: max', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(rateCountySplittingLegacy(avgWorst, 15, 9)).toBe(0);
  });

  test('County splitting: too much', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(rateCountySplittingLegacy(avgWorst + U.EPSILON, 15, 9)).toBe(0);
  });
});

describe('District-county splitting scorer', () =>
{
  test('AZ district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.424)).toBe(61);
  });
  test('MD district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.760)).toBe(0);
  });
  test('NC district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.519)).toBe(38);
  });
  test('PA district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.690)).toBe(0);
  });
  test('VA district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.424)).toBe(61);
  });

  test('District splitting: min', () =>
  {
    expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.END])).toBe(0);
  });

  test('District splitting: max', () =>
  {
    expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.BEG])).toBe(99);
    // expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.BEG])).toBe(100);
  });

  test('District splitting: too much', () =>
  {
    expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.END] + U.EPSILON)).toBe(0);
  });
});
*/

// SPLITTING SCORING - Legacy

describe('Weight splitting measures', () =>
{
  test('Weight county & district splitting', () =>
  {
    expect(rateSplittingLegacy(30, 60)).toBeCloseTo(45);
  });
});

describe('County-district splitting scorer', () =>
{
  test('AZ county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.352, 15, 9)).toBe(44);
  });
  test('MD county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.531, 24, 8)).toBe(0);
  });
  test('NC county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.152, 100, 13)).toBe(65);
  });
  test('PA county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.178, 67, 18)).toBe(68);
  });
  test('VA county splitting', () =>
  {
    expect(rateCountySplittingLegacy(1.214, 133, 11)).toBe(43);
  });

  test('County splitting: min', () =>
  {
    const avgBest = countySplitBest(15, 9);
    expect(rateCountySplittingLegacy(avgBest, 15, 9)).toBe(99);
    // expect(rateCountySplittingLegacy(avgBest, 15, 9)).toBe(100);
  });

  test('County splitting: max', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(rateCountySplittingLegacy(avgWorst, 15, 9)).toBe(0);
  });

  test('County splitting: too much', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(rateCountySplittingLegacy(avgWorst + U.EPSILON, 15, 9)).toBe(0);
  });
});

describe('District-county splitting scorer', () =>
{
  test('AZ district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.424)).toBe(61);
  });
  test('MD district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.760)).toBe(0);
  });
  test('NC district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.519)).toBe(38);
  });
  test('PA district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.690)).toBe(0);
  });
  test('VA district splitting: in range', () =>
  {
    expect(rateDistrictSplittingLegacy(1.424)).toBe(61);
  });

  test('District splitting: min', () =>
  {
    expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.END])).toBe(0);
  });

  test('District splitting: max', () =>
  {
    expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.BEG])).toBe(99);
    // expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.BEG])).toBe(100);
  });

  test('District splitting: too much', () =>
  {
    expect(rateDistrictSplittingLegacy(C.districtSplittingRange(T.DistrictType.Congressional)[C.END] + U.EPSILON)).toBe(0);
  });
});
