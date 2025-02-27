//
// KIWYSI COMPACTNESS - See Aaron Kaufman and Gary King's paper
//

import * as GeoJSON from 'geojson';
import {Poly} from '@dra2020/baseclient';

import {featureizePoly} from './features';
import * as T from '../types/all';
import * as M from './matrix';


// For verifying replication w/ Aaron Kaufman & Gary King's results
// Note: These scores are smaller is better (ranks) and potentially out of range
export function kiwysiScoreShapeRAW(poly: any, pca: T.PCAModel, options?: Poly.PolyOptions): number
{
  // Feature-ize the shape
  const features: T.CompactnessFeatures = featureizePoly(poly, options);

  // Score the feature set
  const score: number = scoreFeatureSet(features, pca);

  return score;
}

// Note: These scores are still smaller is better (ranks)
export function kiwysiScoreShape(poly: any, pca: T.PCAModel, options?: Poly.PolyOptions): number
{
  const rawScore = kiwysiScoreShapeRAW(poly, pca, options);
  const rangedScore = Math.min(Math.max(rawScore, 1), 100);

  return rangedScore;
}

// Use this to get KIWYSI compactness scores ("ranks") for a set of shapes
export function kiwysiScoreShapes(shapes: GeoJSON.FeatureCollection, pca: T.PCAModel, options?: Poly.PolyOptions): number[]
{
  let scores: number[] = [];

  for (let i = 0; i < shapes.features.length; i++)
  {
    const score = kiwysiScoreShape(shapes.features[i], pca, options);
    scores.push(score);
  }

  return scores;
}

// CLI

// Use this to get KIWYSI compactness features and scores ("ranks") for a set of shapes
// Note - These calculations use the geodesic (curved earth) model
export function calcKIWYSICompactness(shapes: GeoJSON.FeatureCollection): T.KiwysiJSONReady
{
  const pca: T.PCAModel = T.PCAModel.Revised;
  const options: Poly.PolyOptions | undefined = undefined;

  let totKIWYSI: number = 0;
  let byDistrict: T.KiwysiFeatures[] = [];

  for (let i = 0; i < shapes.features.length; i++)
  {
    // Feature-ize the shape
    const features: T.CompactnessFeatures = featureizePoly(shapes.features[i], options);

    // Score the feature set
    const rawScore: number = scoreFeatureSet(features, pca);
    const rangedScore = Math.min(Math.max(rawScore, 1), 100);

    totKIWYSI += rangedScore;

    const entry: T.KiwysiFeatures = {
      sym_x: features.sym_x,
      sym_y: features.sym_y,
      reock: features.reock,
      bbox: features.bbox,
      polsby: features.polsby,
      hull: features.hull,
      schwartzberg: features.schwartzberg,
      kiwysiRank: rangedScore
    };

    byDistrict.push(entry);
  }

  const avgKIWYSI: number = Math.round(totKIWYSI / shapes.features.length);

  const out: T.KiwysiJSONReady = {
    avgKIWYSI: avgKIWYSI,
    byDistrict: byDistrict
  }

  return out;
}


// KIWYSI SCORE THE FEATURES FROM A FEATURE-IZED SHAPE

export function scoreFeatureSet(features: T.CompactnessFeatures, pca: T.PCAModel): number
{
  if (pca == T.PCAModel.Revised) return applyPCAModel(features);
  else return applyPCAModel_ORIGINAL(features);
}

// Revised 01/25/21
function applyPCAModel(features: T.CompactnessFeatures): number
{
  const model: number[] = [
    3.0428861122,       // sym_x
    4.5060390447,       // sym_y
    -22.7768820155,     // reock
    -24.1176096770,     // bbox
    -107.9434473497,    // polsby
    -67.1088897240,     // hull
    -1.2981693414       // schwartzberg
  ];

  const intercept: number = 145.6420811716;

  const v: M.Vector = [
    features.sym_x,
    features.sym_y,
    features.reock,
    features.bbox,
    features.polsby,
    features.hull,
    features.schwartzberg
  ];

  const score = M.dotProduct(model, v) + intercept;
  const normalized = score;

  return normalized;
}

// The original, INCORRECT, model
function applyPCAModel_ORIGINAL(features: T.CompactnessFeatures): number
{
  const model: number[] = [
    0.317566717356693,  // sym_x
    0.32545234315137,   // sym_y
    0.32799567316863,   // reock
    0.411560782484889,  // bbox
    0.412187169816954,  // polsby
    0.420085928286392,  // hull
    0.412187169816954   // schwartzberg
  ];

  const v: M.Vector = [
    features.sym_x,
    features.sym_y,
    features.reock,
    features.bbox,
    features.polsby,
    features.hull,
    features.schwartzberg
  ];

  const score = M.dotProduct(model, v);
  const normalized = (score * 11) + 50;

  return normalized;
}

