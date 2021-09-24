//
// COMPACTNESS
//

import * as GeoJSON from 'geojson';
import {Poly} from '@dra2020/baseclient';

import {featureizePoly} from './features';
import {scoreFeatureSet} from './kiwysi';
import * as T from '../types/all';
import {ratePolsby, rateReock} from '../rate/dra-ratings';


// Use this to get average Reock, Polsby-Popper, and KIWYSI compactness and by district for a set of shapes
// This is used by DRA
export function makeCompactnessScorecard(shapes: GeoJSON.FeatureCollection, bLog: boolean = false): T.CompactnessScorecard
{
  const pca: T.PCAModel = T.PCAModel.Revised;
  const options: Poly.PolyOptions | undefined = undefined;

  // For calculating averages of by-district values
  let totReock: number = 0;
  let totPolsby: number = 0;
  let totKIWYSI: number = 0;

  // For returning compactness by district to DRA
  // Note, these use the Cartesian (flat earth) measurements
  let byDistrict: T.CompactnessByDistrict[] = [];

  for (let i = 0; i < shapes.features.length; i++)
  {
    const features: T.CompactnessFeatures = featureizePoly(shapes.features[i], options);

    const reockFlat: number = features.reockFlat;
    const polsbyFlat: number = features.polsbyFlat;

    // Note: In order to compute the by-district compactness that DRA needs,
    // you have to normalize Reock & Polsby–Popper here (vs. in DRA proper)
    // like the overall compactness rating.
    const normalizedReock: number = rateReock(reockFlat);
    const normalizedPolsby: number = ratePolsby(polsbyFlat);

    let kiwysiRank: number = scoreFeatureSet(features, pca);
    // Constrain values to the range [1–100]
    kiwysiRank = Math.min(Math.max(kiwysiRank, 1), 100);
    // Raw KIWYSI scores ("ranks") are 1–100 where smaller is better
    // Round & invert into scores where bigger is better [0–100]
    const kiwysiScore: number = 100 - Math.round(kiwysiRank) + 1

    totReock += reockFlat;
    totPolsby += polsbyFlat;
    totKIWYSI += kiwysiScore;

    const measures: T.CompactnessByDistrict = {
      rawReock: reockFlat,
      normalizedReock: normalizedReock,
      rawPolsby: polsbyFlat,
      normalizedPolsby: normalizedPolsby,
      kiwysiScore: kiwysiScore
    };

    byDistrict.push(measures);
  }

  const avgReock: number = totReock / shapes.features.length;
  const avgPolsby: number = totPolsby / shapes.features.length;
  const avgKWIWYSI: number = Math.round(totKIWYSI / shapes.features.length);

  const s: T.CompactnessScorecard = {
    avgReock: avgReock,
    avgPolsby: avgPolsby,
    avgKWIWYSI: avgKWIWYSI,
    byDistrict: byDistrict,  // Legacy format
    details: {},             // None
    // score?: 
  }

  return s;
}

// CLI
// Calculate Reock & Polsby–Popper for a shape using the typical Cartesian (flat earth) calculations.
// Also calculate the "know it when you see it" rank (smaller is better) that models human perceptions of compactness.
export function calcCompactness(shapes: GeoJSON.FeatureCollection): T.Compactness[]
{
  const pca: T.PCAModel = T.PCAModel.Revised;
  const options: Poly.PolyOptions | undefined = undefined;

  let scores: T.Compactness[] = [];

  for (let i = 0; i < shapes.features.length; i++)
  {
    const features: T.CompactnessFeatures = featureizePoly(shapes.features[i], options);

    const reockFlat: number = features.reockFlat;
    const polsbyFlat: number = features.polsbyFlat;

    // Raw KIWYSI scores ("ranks") are 1–100 where smaller is better
    let kiwysiRank: number = scoreFeatureSet(features, pca);
    // Constrain values to the range [1–100]
    kiwysiRank = Math.min(Math.max(kiwysiRank, 1), 100);

    const c: T.Compactness = {
      rawReock: reockFlat,
      rawPolsby: polsbyFlat,
      kiwysiRank: kiwysiRank
    };

    scores.push(c);
  }

  return scores;
}
