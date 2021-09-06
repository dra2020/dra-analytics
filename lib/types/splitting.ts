//
// SPLITTING TYPES
//

import * as T from './general';


export type CountyProfile = CxD;
export type CxD = number[][];

export type SplittingScorecard = {
  score?: number;
  county: T.Measurement;
  district: T.Measurement;
  details: T.Dict;
};
