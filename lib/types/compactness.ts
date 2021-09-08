//
// COMPACTNESS TYPES
//

import * as T from './general';


// For backward compatibility
export type GeoProperties = {
  area: number,
  perimeter: number,
  diameter: number
}

export type CompactnessScorecard = {
  avgReock: number;
  avgPolsbyPopper: number;
  byDistrict: CompactnessByDistrict;
  details: T.Dict;
  rating?: number;
};

export type CompactnessByDistrict = {
  rawReock: number;
  normalizedReock: number;
  rawPolsby: number;
  normalizedPolsby: number;
  kiwysiScore?: number;
}

