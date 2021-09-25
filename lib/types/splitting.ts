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


// CLI

export type SplittingJSONReady = {
  county: number,
  district: number
}
