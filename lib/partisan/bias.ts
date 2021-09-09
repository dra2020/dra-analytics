//
// BIAS METRICS
//

// import * as N from '../rate/normalize';
// import * as T from '../types/partisan';
// import * as U from '../utils/all';
// import * as C from '../rate/dra-config';
import * as S from '../rate/settings';


// ^S# - The # of Democratic seats closest to proportional @ statewide Vf
// The "expected number of seats" from http://bit.ly/2Fcuf4q
export function bestSeats(N: number, Vf: number): number
{
  return Math.round((N * Vf) - S.EPSILON);
}