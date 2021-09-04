//
// COMPACTNESS TYPES  
//

export type Point = [number, number];

export type CompactnessFeatures = {
  sym_x: number,
  sym_y: number,
  reock: number,
  bbox: number,
  polsby: number,
  hull: number,
  schwartzberg: number
};

// For reading features CSV file
export type FeaturesEntry = {
  n: number,
  features: CompactnessFeatures,
  score: number
};

export const enum PCAModel
{
  Revised,
  Original
};
