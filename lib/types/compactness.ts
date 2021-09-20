//
// COMPACTNESS TYPES
//

import * as T from './general';


// KIWYSI 

export type arrPoint = [number, number];

export type CompactnessFeatures = {
  sym_x: number,
  sym_y: number,
  reock: number,
  bbox: number,
  polsby: number,
  hull: number,
  schwartzberg: number,

  // For the flat-earth versions typically shared
  reockFlat: number,
  polsbyFlat: number
};

// For reading features CSV file
export type FeaturesEntry = {
  n: number,
  features: CompactnessFeatures,
  score: number
}

export const enum PCAModel
{
  Revised,
  Original
}


// SCORECARD

// For backward compatibility
export type GeoProperties = {
  area: number,
  perimeter: number,
  diameter: number
}

export type CompactnessScorecard = {
  avgReock: number;
  avgPolsby: number;
  avgKWIWYSI: number;
  byDistrict: CompactnessByDistrict[];
  details: T.Dict;
  score?: number;
};

export type CompactnessByDistrict = {
  rawReock: number;
  normalizedReock: number;
  rawPolsby: number;
  normalizedPolsby: number;
  kiwysiScore?: number;
}

export type Compactness = {
  rawReock: number;
  rawPolsby: number;
  kiwysiRank: number;
}

