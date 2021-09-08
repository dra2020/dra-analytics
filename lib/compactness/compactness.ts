//
// COMPACTNESS
//

import * as GeoJSON from 'geojson';
import {Poly} from '@dra2020/baseclient';

import {featureizePoly} from './features';
import {scoreFeatureSet} from './kiwysi';
import * as T from '../types/compactness';
import {ratePolsby, rateReock} from '../rate/dra-ratings';


// Use this to get average Reock, Polsby-Popper, and KIWYSI compactness and by district for a set of shapes
export function makeCompactnessScorecard(shapes: GeoJSON.FeatureCollection): T.CompactnessScorecard
{
  const pca: T.PCAModel = T.PCAModel.Revised;
  const options: Poly.PolyOptions | undefined = undefined;

  let byDistrict: T.CompactnessByDistrict[] = [];
  let totReock: number = 0;
  let totPolsby: number = 0;
  let totKIWYSI: number = 0;

  for (let i = 0; i < shapes.features.length; i++)
  {
    const features: T.CompactnessFeatures = featureizePoly(shapes.features[i], options);

    const reock: number = features.reock;
    const normalizedReock: number = rateReock(reock);
    const polsby: number = features.polsby;
    const normalizedPolsby: number = ratePolsby(features.polsby);

    let kiwysiRank: number = scoreFeatureSet(features, pca);
    // Constrain values to the range [1–100]
    kiwysiRank = Math.min(Math.max(kiwysiRank, 1), 100);
    // Raw KIWYSI scores ("ranks") are 1–100 where smaller is better
    // Round & invert into scores where bigger is better [0–100]
    const kiwysiScore: number = 100 - Math.round(kiwysiRank) + 1

    totReock += reock;
    totPolsby += polsby;
    totKIWYSI += kiwysiScore;

    const measures: T.CompactnessByDistrict = {
      rawReock: reock,
      normalizedReock: normalizedReock,
      rawPolsby: polsby,
      normalizedPolsby: normalizedPolsby,
      kiwysiScore: kiwysiScore
    };

    byDistrict.push(measures);
  }

  const avgReock: number = totReock / shapes.features.length;
  const avgPolsby: number = totPolsby / shapes.features.length;
  const avgKWIWYSI: number = totKIWYSI / shapes.features.length;

  const s: T.CompactnessScorecard = {
    avgReock: avgReock,
    avgPolsby: avgPolsby,
    avgKWIWYSI: avgKWIWYSI,
    byDistrict: byDistrict,
    details: {},             // None
    // rating?: 
  }

  return s;
}
