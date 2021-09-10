import * as FU from '../../testutil/fileutils';

import * as T from '../../lib/types/all'
import {analyzeRacialVoting} from '../../lib/minority/all';


describe('Racial polarization', () =>
{
  test('NC 116th / District 1 / White & Black', () =>
  {
    const districtID = 1;
    const groups: T.MinorityFilter = {
      white: true,
      minority: false,
      black: true,
      hispanic: false,
      pacific: false,
      asian: false,
      native: false,
      invertSelection: false
    }
    const points: T.DemographicVotingByFeature | undefined = FU.readDemographicCSV("testdata/minority/NC-116-District1.csv", groups);

    const rpv: T.RPVAnalysis | undefined = analyzeRacialVoting(points, districtID, groups);

    if (rpv === undefined) return;

    const w = rpv.comparison;
    const b = rpv.black;
    if ((w === undefined) || (b === undefined)) return;

    // Check White values
    expect(w.slope).toBeCloseTo(-0.6821);
    expect(w.intercept).toBeCloseTo(0.9708);
    expect(w.r2).toBeCloseTo(0.6612);
    expect(w.demPct).toBeCloseTo(0.2887);
    expect(w.sterr).toBeCloseTo(0.0181);

    // Check Black values
    expect(b.slope).toBeCloseTo(0.5793);
    expect(b.intercept).toBeCloseTo(0.3852);
    expect(b.r2).toBeCloseTo(0.4583);
    expect(b.demPct).toBeCloseTo(0.9644);
    expect(b.sterr).toBeCloseTo(0.0230);
  });
});
