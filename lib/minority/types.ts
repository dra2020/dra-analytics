//
// MINORITY TYPES
//

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

export type Point = {x: number, y: number};  // % VAP, % Dem

export type DemographicVotingByFeature = {
  ids: string[];
  comparison: Point[];
  minority: Point[];
  black: Point[];
  hispanic: Point[];
  pacific: Point[];
  asian: Point[];
  native: Point[];
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
  points: Point[];
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

