//
// MINORITY REPRESENTATION TYPES
//

import * as T from './general';


export type Demographics = {
  white: number;
  minority: number;
  black: number;
  hispanic: number;
  pacific: number;
  asian: number;
  native: number;
}

export type DemoBreakdown = {
  pct35_40: number;
  pct40_45: number;
  pct45_50: number;
  pct50_55: number;
  pct55_60: number;
  pct60Plus: number;
  vapPct: number;     // Statewide VAP %
  propSeats: number   // Proportional # of seats for VAP %
}

export type DemographicPivot = {
  // white: DemoBreakdown;
  minority: DemoBreakdown;
  black: DemoBreakdown;
  hispanic: DemoBreakdown;
  pacific: DemoBreakdown;
  asian: DemoBreakdown;
  native: DemoBreakdown;
}

export type MinorityScorecard = {
  pivotByDemographic: DemographicPivot;
  opportunityDistricts: number;
  coalitionDistricts: number;
  score?: number;
  details: T.Dict;
}

