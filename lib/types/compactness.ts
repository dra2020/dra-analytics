//
// COMPACTNESS TYPES
//

import * as T from './general';

export type GeoProperties = {
  area: number,
  perimeter: number,
  diameter: number
}
export type ShapeProfile = GeoProperties[];

export type CompactnessScorecard = {
  score?: number;
  reock: T.Measurement;
  polsby: T.Measurement;
  details: T.Dict;
};

export type CompactnessByDistrict = {
  rawReock: number;
  normalizedReock: number;
  rawPolsby: number;
  normalizedPolsby: number;
  kiwysiScore?: number;
}

