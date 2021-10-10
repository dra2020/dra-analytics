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
// AL	67	7	1.1100	1.4470	35	1.4200	1.4500	105	1.6400	1.2600	1.02	1.20	73	38	56	1.10	1.20	13	38	26	1.20	1.13	0	64	32
// AZ	15	9	1.3520	1.4240	30	1.7100	1.2000				1.11	1.20	33	44	39	1.20	1.09	0	71	36	 	 	 	 	 
// CA	58	53	1.7890	1.2530	40	1.7400	1.3400	80	1.7000	1.1900	1.18	1.20	0	87	44	1.13	1.20	0	65	33	1.20	1.14	0	88	44
// CO	64	7	1.1960	1.5010	35	1.2100	1.0800	65	1.2500	1.0700	1.02	1.20	48	25	37	1.11	1.20	72	100	86	1.20	1.19	88	100	94
// CT	8	5	1.4800	1.5310	36	2.0800	1.1700	151	1.6800	1.0500	1.10	1.20	0	17	9	1.20	1.04	0	62	31	1.20	1.01	0	88	44
// GA	159	14	1.2960	1.6400	56	1.5800	1.3900	180	1.7800	1.2700	1.02	1.20	17	0	9	1.07	1.20	0	53	27	1.20	1.18	0	76	38
// IA	99	4	1.0000	1.0000	50	1.3300	1.2900	100	1.2600	1.2000	1.01	1.20	100	100	100	1.10	1.20	37	78	58	1.20	1.20	85	99	92
// KY	120	6	1.0360	1.2230	38	1.2100	1.0800	100	1.4300	1.2000	1.01	1.20	92	94	93	1.06	1.20	58	100	79	1.17	1.20	32	100	66
// PA	67	18	1.1780	1.4080	50	1.5200	1.3000	203	1.6500	1.1300	1.05	1.20	64	48	56	1.15	1.20	2	75	39	1.20	1.07	0	82	41
// TN	95	9	1.0710	1.2670	33	1.1400	1.1000	99	1.1000	1.1400	1.02	1.20	84	83	84	1.07	1.20	80	100	90	1.20	1.19	100	100	100
// TX	254	36	1.5790	1.4280	31	1.4600	1.3300	150	1.0800	1.0400	1.03	1.20	0	43	22	1.02	1.20	0	68	34	1.12	1.20	100	100	100
// VA	133	11	1.2140	1.6900	40	1.6400	1.7000	100	1.8400	1.4200	1.02	1.20	41	0	21	1.06	1.20	0	0	0	1.15	1.20	0	45	23

// With 2 minor exceptions, the test cases below are the subset above from the Excel spreadsheet I used to develop the ratings:
// - There are some minor rounding differences between Excel & Typescript; and
// - The full Typescript implementation limits the max rating to 99 if there's any splitting. Only no splitting can get 100.
describe('Rate states', () =>
{
  test('AL splitting', () =>
  {
    const nC = 67;
    const nCD = 7;
    const nUD = 35;
    const nLD = 105;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.02);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.10);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.13);

    expect(rateCountySplitting(1.1100, nC, nCD)).toBe(73);
    expect(rateDistrictSplitting(1.4470, nC, nCD)).toBe(38);
    expect(rateSplitting(73, 38)).toBe(56);

    expect(rateCountySplitting(1.4200, nC, nUD)).toBe(12);
    expect(rateDistrictSplitting(1.4500, nC, nUD)).toBe(37);
    expect(rateSplitting(12, 37)).toBe(25);

    expect(rateCountySplitting(1.6400, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.2600, nC, nLD)).toBe(64);
    expect(rateSplitting(0, 64)).toBe(32);
  });
  test('AZ splitting', () =>
  {
    const nC = 15;
    const nCD = 9;
    const nUD = 30;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.11);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.09);

    expect(rateCountySplitting(1.3520, nC, nCD)).toBe(33);
    expect(rateDistrictSplitting(1.4240, nC, nCD)).toBe(43);
    expect(rateSplitting(33, 43)).toBe(38);

    expect(rateCountySplitting(1.7100, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.2000, nC, nUD)).toBe(70);
    expect(rateSplitting(0, 70)).toBe(35);
  });
  test('CA splitting', () =>
  {
    const nC = 58;
    const nCD = 53;
    const nUD = 40;
    const nLD = 80;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.18);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.13);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.14);

    expect(rateCountySplitting(1.7890, nC, nCD)).toBe(0);
    expect(rateDistrictSplitting(1.2530, nC, nCD)).toBe(87);
    expect(rateSplitting(0, 65)).toBe(33);

    expect(rateCountySplitting(1.7400, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.3400, nC, nUD)).toBe(65);
    expect(rateSplitting(0, 81)).toBe(41);

    expect(rateCountySplitting(1.7000, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.1900, nC, nLD)).toBe(87);
    expect(rateSplitting(0, 87)).toBe(44);
  });
  test('CO splitting', () =>
  {
    const nC = 64;
    const nCD = 7;
    const nUD = 35;
    const nLD = 65;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.02);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.11);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.19);

    expect(rateCountySplitting(1.1960, nC, nCD)).toBe(47);
    expect(rateDistrictSplitting(1.5010, nC, nCD)).toBe(24);
    expect(rateSplitting(47, 24)).toBe(36);

    expect(rateCountySplitting(1.2100, nC, nUD)).toBe(72);
    expect(rateDistrictSplitting(1.0800, nC, nUD)).toBe(99);
    expect(rateSplitting(72, 99)).toBe(86);

    expect(rateCountySplitting(1.2500, nC, nLD)).toBe(87);
    expect(rateDistrictSplitting(1.0700, nC, nLD)).toBe(99);
    expect(rateSplitting(87, 99)).toBe(93);
  });
  test('CT splitting', () =>
  {
    const nC = 8;
    const nCD = 5;
    const nUD = 36;
    const nLD = 151;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.10);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.04);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.01);

    expect(rateCountySplitting(1.4800, nC, nCD)).toBe(0);
    expect(rateDistrictSplitting(1.5310, nC, nCD)).toBe(16);
    expect(rateSplitting(0, 16)).toBe(8);

    expect(rateCountySplitting(2.0800, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.1700, nC, nUD)).toBe(62);
    expect(rateSplitting(0, 62)).toBe(31);

    expect(rateCountySplitting(1.6800, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.0500, nC, nLD)).toBe(88);
    expect(rateSplitting(0, 88)).toBe(44);
  });
  test('GA splitting', () =>
  {
    const nC = 159;
    const nCD = 14;
    const nUD = 56;
    const nLD = 180;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.02);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.07);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.18);

    expect(rateCountySplitting(1.2960, nC, nCD)).toBe(17);
    expect(rateDistrictSplitting(1.6400, nC, nCD)).toBe(0);
    expect(rateSplitting(0, 17)).toBe(9);

    expect(rateCountySplitting(1.5800, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.3900, nC, nUD)).toBe(52);
    expect(rateSplitting(0, 52)).toBe(26);

    expect(rateCountySplitting(1.7800, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.2700, nC, nLD)).toBe(76);
    expect(rateSplitting(0, 76)).toBe(38);
  });
  test('IA splitting', () =>
  {
    const nC = 99;
    const nCD = 4;
    const nUD = 50;
    const nLD = 100;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.01);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.10);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.20);

    expect(rateCountySplitting(1.0000, nC, nCD)).toBe(100);
    expect(rateDistrictSplitting(1.0000, nC, nCD)).toBe(100);
    expect(rateSplitting(100, 100)).toBe(100);

    expect(rateCountySplitting(1.3300, nC, nUD)).toBe(36);
    expect(rateDistrictSplitting(1.2900, nC, nUD)).toBe(77);
    expect(rateSplitting(36, 77)).toBe(57);

    expect(rateCountySplitting(1.2600, nC, nLD)).toBe(85);
    expect(rateDistrictSplitting(1.2000, nC, nLD)).toBe(99);
    expect(rateSplitting(85, 99)).toBe(92);
  });
  test('KY splitting', () =>
  {
    const nC = 120;
    const nCD = 6;
    const nUD = 38;
    const nLD = 100;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.01);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.06);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.17);

    expect(rateCountySplitting(1.0360, nC, nCD)).toBe(92);
    expect(rateDistrictSplitting(1.2230, nC, nCD)).toBe(94);
    expect(rateSplitting(92, 94)).toBe(93);

    expect(rateCountySplitting(1.2100, nC, nUD)).toBe(58);
    expect(rateDistrictSplitting(1.0800, nC, nUD)).toBe(99);
    expect(rateSplitting(58, 99)).toBe(79);

    expect(rateCountySplitting(1.4300, nC, nLD)).toBe(31);
    expect(rateDistrictSplitting(1.2000, nC, nLD)).toBe(99);
    expect(rateSplitting(31, 99)).toBe(65);
  });
  test('PA splitting', () =>
  {
    const nC = 67;
    const nCD = 18;
    const nUD = 50;
    const nLD = 203;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.05);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.15);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.07);

    expect(rateCountySplitting(1.1780, nC, nCD)).toBe(63);
    expect(rateDistrictSplitting(1.4080, nC, nCD)).toBe(47);
    expect(rateSplitting(63, 47)).toBe(55);

    expect(rateCountySplitting(1.5200, nC, nUD)).toBe(1);
    expect(rateDistrictSplitting(1.3000, nC, nUD)).toBe(75);
    expect(rateSplitting(1, 75)).toBe(38);

    expect(rateCountySplitting(1.6500, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.1300, nC, nLD)).toBe(82);
    expect(rateSplitting(0, 82)).toBe(41);

    // The is the user Ruth's PA Lower State House map.
    // The initial intended ratings "tanked" (85 => 53).
    // With these revised ratings, the drop is only half that much (85 => 70).
    expect(rateCountySplitting(1.3100, nC, nLD)).toBe(72);
    expect(rateDistrictSplitting(1.1800, nC, nLD)).toBe(67);
    expect(rateSplitting(72, 67)).toBe(70);
  });
  test('TN splitting', () =>
  {
    const nC = 95;
    const nCD = 9;
    const nUD = 33;
    const nLD = 99;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.02);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.07);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.19);

    expect(rateCountySplitting(1.0710, nC, nCD)).toBe(84);
    expect(rateDistrictSplitting(1.2670, nC, nCD)).toBe(83);
    expect(rateSplitting(84, 83)).toBe(84);

    expect(rateCountySplitting(1.1400, nC, nUD)).toBe(79);
    expect(rateDistrictSplitting(1.1000, nC, nUD)).toBe(99);
    expect(rateSplitting(79, 99)).toBe(89);

    expect(rateCountySplitting(1.1000, nC, nLD)).toBe(99);
    expect(rateDistrictSplitting(1.1400, nC, nLD)).toBe(99);
    expect(rateSplitting(99, 99)).toBe(99);
  });
  test('TX splitting', () =>
  {
    const nC = 254;
    const nCD = 36;
    const nUD = 31;
    const nLD = 150;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.03);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.02);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.12);

    expect(rateCountySplitting(1.5790, nC, nCD)).toBe(0);
    expect(rateDistrictSplitting(1.4280, nC, nCD)).toBe(42);
    expect(rateSplitting(0, 42)).toBe(21);

    expect(rateCountySplitting(1.4600, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.3300, nC, nUD)).toBe(67);
    expect(rateSplitting(0, 67)).toBe(34);

    expect(rateCountySplitting(1.0800, nC, nLD)).toBe(99);
    expect(rateDistrictSplitting(1.0400, nC, nLD)).toBe(99);
    expect(rateSplitting(99, 99)).toBe(99);
  });
  test('VA splitting', () =>
  {
    const nC = 133;
    const nCD = 11;
    const nUD = 40;
    const nLD = 100;

    expect(bestTarget(nC, nCD)).toBeCloseTo(1.02);
    expect(bestTarget(nC, nUD)).toBeCloseTo(1.06);
    expect(bestTarget(nC, nLD)).toBeCloseTo(1.15);

    expect(rateCountySplitting(1.2140, nC, nCD)).toBe(41);
    expect(rateDistrictSplitting(1.6900, nC, nCD)).toBe(0);
    expect(rateSplitting(41, 0)).toBe(21);

    expect(rateCountySplitting(1.6400, nC, nUD)).toBe(0);
    expect(rateDistrictSplitting(1.7000, nC, nUD)).toBe(0);
    expect(rateSplitting(0, 0)).toBe(0);

    expect(rateCountySplitting(1.8400, nC, nLD)).toBe(0);
    expect(rateDistrictSplitting(1.4200, nC, nLD)).toBe(44);
    expect(rateSplitting(0, 44)).toBe(22);
  });
});


// SPLITTING SCORING - Legacy
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

*/