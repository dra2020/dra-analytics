//
// SPLITTING TYPES
//

import * as T from './general';


export type CountyProfile = CxD;
export type CxD = number[][];

export type SplittingScorecard = {
  county: number,
  district: number,
  details: T.Dict,
  score?: number
}


// CLI & OTHER USERS

export type SplittingJSONReady = {
  county: number,
  district: number
}

export type COISplits = {
  name: string,
  splits: number[]        // percentages [0–1]
}

export type COISplitting = {
  name: string,
  effectiveSplits: number,
  uncertainty: number       // uncertainty of membership
}

export type COISplittingJSONReady = {
  byCOI: COISplitting[]
}