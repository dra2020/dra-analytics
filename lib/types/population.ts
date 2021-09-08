//
// POPULATION TYPES
//

import * as T from './general';


// export type PopulationScorecard = T.Measurement;  DELETE

export type PopulationScorecard = {
  deviation: number;
  rating: number;
  roughlyEqual: boolean;
  notes: T.Dict;
}