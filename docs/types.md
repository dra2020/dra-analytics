# Types

This library defines types & enums needed by users of this package.

## Exports

This type can be used to collect the various category-specific scorecards.

``` TypeScript
export type Scorecard = {
  partisan: PartisanScorecard;
  minority: MinorityScorecard;
  compactness: CompactnessScorecard;
  splitting: SplittingScorecard;
  populationDeviation: PopulationScorecard;
  details: Dict;
  scratchpad: Dict;
}
```

These are the category-specific scorecard types.

``` TypeScript
export type PopulationScorecard = {
  deviation: number;
  roughlyEqual: boolean;
  score?: number;
  notes: Dict;
}
```

``` TypeScript
export type PartisanScorecard = {
  bias: Bias;                      // This sub-type collects measures of bias
  impact: Impact;                  // This sub-type collects measures of impact
  responsiveness: Responsiveness;  // This sub-type collects measures of responsiveness
  dSVpoints: SVpoint[];
  rSVpoints: SVpoint[];
  averageDVf: number | undefined;
  averageRVf: number | undefined;
  details: Dict;
}
```

``` TypeScript
export type MinorityScorecard = {
  pivotByDemographic: DemographicPivot;  // DRA uses this in the Minority Representation section of the Advanced tab
  opportunityDistricts: number;
  coalitionDistricts: number;
  proportionalOpportunities: number;     // Added so ratings can be calculated separately
  proportionalCoalitions: number;        // Ditto
  details: Dict;
  score?: number;
}
```

``` TypeScript
export type CompactnessScorecard = {
  avgReock: number;
  avgPolsby: number;
  avgKWIWYSI: number;
  byDistrict: CompactnessByDistrict[];
  details: Dict;
  score?: number;
}
```

``` TypeScript
export type SplittingScorecard = {
  county: number;
  district: number;
  details: Dict;
  score?: number;
}
```

This is a generic helper type.

``` TypeScript
export type Dict = {[key: string]: any}
```

This enum is for legacy KIWYSI compactness calculations.

``` TypeScript
export const enum PCAModel
{
  Revised,
  Original
}
```

This type is for evaluating the opportunity for minority representation.

``` TypeScript
export type MinorityFilter = {
  white: boolean;            // Always compare to White, unless invertSelection == true
  hispanic: boolean;         // Infer the minority chosen, in this order
  black: boolean;
  pacific: boolean;
  asian: boolean;
  native: boolean;
  minority: boolean;
  invertSelection: boolean;  // Compare to 1 – <selected minority> instead of White
}
```

These types are for racially polarized voting analysis.

``` TypeScript
export type dictPoint = {x: number, y: number}  // % VAP, % Dem
```

``` TypeScript
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
``` 

 ``` TypeScript
export type RPVFactor = {
  slope: number;
  intercept: number;
  r2: number;
  sterr: number;
  demPct: number;            // For the table in DRA
  points: dictPoint[];       // For the scatter plot in DRA
}
``` 

``` TypeScript
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
```