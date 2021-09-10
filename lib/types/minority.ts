//
// MINORITY REPRESENTATION TYPES
//

import * as T from './general';


export type MinorityFilter = {
  white: boolean;    // Always compare to White, unless invertSelection == true
  hispanic: boolean; // Infer the minority chosen, in this order
  black: boolean;
  pacific: boolean;
  asian: boolean;
  native: boolean;
  minority: boolean;
  invertSelection: boolean;  // Compare to 1 – <selected minority> instead of White
}

export type dictPoint = {x: number, y: number};  // % VAP, % Dem

export type DemographicVotingByFeature = {
  ids: string[];
  comparison: dictPoint[];
  minority: dictPoint[];
  black: dictPoint[];
  hispanic: dictPoint[];
  pacific: dictPoint[];
  asian: dictPoint[];
  native: dictPoint[];
}

export type LinearRegression = {
  slope: number;
  intercept: number;
  r2: number;         // R square
  sterrs: StErrs;
}

// Three standard errors for a linear regression
export type StErrs = {
  slope: number;
  intercept: number;
  regression: number;
}

export type RPVFactor = {
  // Select results of the straight linear regression
  slope: number;
  intercept: number;
  r2: number;         // R square
  // For the table
  demPct: number;
  sterr: number;
  // For the scatter plot
  dictPoints: dictPoint[];
}

export type RPVAnalysis = {
  ids: string[] | undefined;
  comparison: RPVFactor | undefined;
  minority: RPVFactor | undefined;
  black: RPVFactor | undefined;
  hispanic: RPVFactor | undefined;
  pacific: RPVFactor | undefined;
  asian: RPVFactor | undefined;
  native: RPVFactor | undefined;
}



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

