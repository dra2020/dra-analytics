import
{
  weightCompactness, scoreReock, scorePolsbyPopper,
  weightSplitting, scoreCountySplitting, scoreDistrictSplitting, countySplitBest, countySplitWorst
} from '../../lib/score/all';

import * as C from '../../lib/score/dra-config';
import * as S from '../../lib/score/settings';
import * as T from '../../lib/types/all'


// COMPACTNESS SCORING

describe('Weight compactness measures', () =>
{
  test('Weight Reock & Polsby-Popper compactness', () =>
  {
    expect(weightCompactness(30, 60)).toBeCloseTo(45);
  });
})


describe('Reock compactness scorer', () =>
{
  test('Reock: in range (AL)', () =>
  {
    expect(scoreReock(0.3848)).toBe(54);
  });

  test('Reock: in range (NC)', () =>
  {
    expect(scoreReock(0.3373)).toBe(35);
  });

  test('Reock: min', () =>
  {
    expect(scoreReock(C.reockRange()[C.BEG])).toBe(0);
  });

  test('Reock: max', () =>
  {
    expect(scoreReock(C.reockRange()[C.END])).toBe(100);
  });

  test('Reock: too low', () =>
  {
    expect(scoreReock(C.reockRange()[C.BEG] - S.EPSILON)).toBe(0);
  });

  test('Reock: too high', () =>
  {
    expect(scoreReock(C.reockRange()[C.END] + S.EPSILON)).toBe(100);
  });
});

describe('Polsby-Popper compactness scorer', () =>
{
  test('Polsby-Popper: in range (AL)', () =>
  {
    expect(scorePolsbyPopper(0.1860)).toBe(21);
  });

  test('Polsby-Popper: in range (NC)', () =>
  {
    expect(scorePolsbyPopper(0.2418)).toBe(35);
  });

  test('Polsby-Popper: min', () =>
  {
    expect(scorePolsbyPopper(C.polsbyRange()[C.BEG])).toBe(0);
  });

  test('Polsby-Popper: max', () =>
  {
    expect(scorePolsbyPopper(C.polsbyRange()[C.END])).toBe(100);
  });

  test('Polsby-Popper: too low', () =>
  {
    expect(scorePolsbyPopper(C.polsbyRange()[C.BEG] - S.EPSILON)).toBe(0);
  });

  test('Polsby-Popper: too high', () =>
  {
    expect(scorePolsbyPopper(C.polsbyRange()[C.END] + S.EPSILON)).toBe(100);
  });
});


// SPLITTING SCORING

describe('Weight splitting measures', () =>
{
  test('Weight county & district splitting', () =>
  {
    expect(weightSplitting(30, 60)).toBeCloseTo(45);
  });
})

describe('County-district splitting scorer', () =>
{
  test('AZ county splitting', () =>
  {
    expect(scoreCountySplitting(1.352, 15, 9)).toBe(44);
  });
  test('MD county splitting', () =>
  {
    expect(scoreCountySplitting(1.531, 24, 8)).toBe(0);
  });
  test('NC county splitting', () =>
  {
    expect(scoreCountySplitting(1.152, 100, 13)).toBe(65);
  });
  test('PA county splitting', () =>
  {
    expect(scoreCountySplitting(1.178, 67, 18)).toBe(68);
  });
  test('VA county splitting', () =>
  {
    expect(scoreCountySplitting(1.214, 133, 11)).toBe(43);
  });

  test('County splitting: min', () =>
  {
    const avgBest = countySplitBest(15, 9);
    expect(scoreCountySplitting(avgBest, 15, 9)).toBe(100);
  });

  test('County splitting: max', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(scoreCountySplitting(avgWorst, 15, 9)).toBe(0);
  });

  test('County splitting: too much', () =>
  {
    const avgBest = countySplitBest(15, 9);
    const avgWorst = countySplitWorst(avgBest);
    expect(scoreCountySplitting(avgWorst + S.EPSILON, 15, 9)).toBe(0);
  });
});

describe('District-county splitting scorer', () =>
{
  test('AZ district splitting: in range', () =>
  {
    expect(scoreDistrictSplitting(1.424)).toBe(61);
  });
  test('MD district splitting: in range', () =>
  {
    expect(scoreDistrictSplitting(1.760)).toBe(0);
  });
  test('NC district splitting: in range', () =>
  {
    expect(scoreDistrictSplitting(1.519)).toBe(38);
  });
  test('PA district splitting: in range', () =>
  {
    expect(scoreDistrictSplitting(1.690)).toBe(0);
  });
  test('VA district splitting: in range', () =>
  {
    expect(scoreDistrictSplitting(1.424)).toBe(61);
  });

  test('District splitting: min', () =>
  {
    expect(scoreDistrictSplitting(C.districtSplittingRange(T.DistrictType.Congressional)[C.END])).toBe(0);
  });

  test('District splitting: max', () =>
  {
    expect(scoreDistrictSplitting(C.districtSplittingRange(T.DistrictType.Congressional)[C.BEG])).toBe(100);
  });

  test('District splitting: too much', () =>
  {
    expect(scoreDistrictSplitting(C.districtSplittingRange(T.DistrictType.Congressional)[C.END] + S.EPSILON)).toBe(0);
  });
});
