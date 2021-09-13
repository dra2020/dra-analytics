//
// SPLITTING TYPES
//

import * as T from './general';


export type CountyProfile = CxD;
export type CxD = number[][];

export type SplittingScorecard = {
  county: number;
  district: number;
  details: T.Dict;
  rating?: number;
};

// TODO - DELETE
// export type SplittingScorecard = {
//   county: T.Measurement;
//   district: T.Measurement;
//   details: T.Dict;
//   rating?: number;
// };
