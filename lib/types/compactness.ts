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
}

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
  avgReock: number,
  avgPolsby: number,
  avgKIWYSI: number,
  byDistrict: Compactness[],
  details: T.Dict,
  score?: number
}

// LEGACY - The compactness measures DRA expects by district
export type Compactness = {
  rawReock: number,
  normalizedReock: number,
  rawPolsby: number,
  normalizedPolsby: number,
  kiwysiScore?: number
}


// CLI & OTHER USERS

// Minimal set of compactness measures for a district
export type CompactnessAlt = {
  reock: number,
  polsby: number,
  kiwysiRank: number
}

// A minimal type for by-district compactness to be converted to JSON
export type CompactnessJSONReady = {
  avgReock: number,
  avgPolsby: number,
  avgKIWYSI: number,
  byDistrict: CompactnessAlt[]
}

export type KiwysiFeatures = {
  sym_x: number,
  sym_y: number,
  reock: number,
  bbox: number,
  polsby: number,
  hull: number,
  schwartzberg: number,
  kiwysiRank: number
}

// A minimal type for by-district KIWISI compactness features to be converted to JSON
export type KiwysiJSONReady = {
  avgKIWYSI: number,
  byDistrict: KiwysiFeatures[]
}

