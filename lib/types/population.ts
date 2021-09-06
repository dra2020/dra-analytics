//
// POPULATION TYPES
//

import * as T from './general';


export type PopulationProfile = {
  byDistrict: totalPopByDistrict;
  targetSize: number
}
export type totalPopByDistrict = number[];

export type PopulationScorecard = T.Measurement;