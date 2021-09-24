//
// POPULATION TYPES
//

import * as T from './general';


export type PopulationScorecard = {
  deviation: number,
  roughlyEqual: boolean,
  score?: number,
  notes: T.Dict
}