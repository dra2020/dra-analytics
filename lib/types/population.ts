//
// POPULATION TYPES
//

import * as T from './general';


export type PopulationScorecard = {
  deviation: number;
  roughlyEqual: boolean;
  rating?: number;
  notes: T.Dict;
}