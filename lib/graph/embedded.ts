//
// EMBEDDED - Is one district fully embedded w/in another district?
//

import * as T from './types'
import * as U from '../utils/all';
import * as G from './utils';

//
// A district is NOT a "donut hole" district:
// * If any neighbor is 'OUT_OF_STATE'; or
// * If there are 2 or more neighboring districts.
//


export function isEmbedded(districtID: number, featureIDs: T.FeatureGroup, plan: T.PlanByGeoID, graph: T.ContiguityGraph, bLog: boolean = false): boolean
{
  let neighboringDistricts = new Set();
  let featuresToCheck = Array.from(featureIDs);

  if (U.isArrayEmpty(featuresToCheck)) return true;

  for (let feature of featuresToCheck)
  {
    // Get its neighbors (including the virtual "out of bounds" ones)
    let neighbors = G.neighbors(feature, graph);

    for (let neighbor of neighbors)
    {
      if (G.isOutOfBounds(neighbor)) return false;

      let neighboringDistrict = G.getDistrict(neighbor, plan);

      // Assume that a missing district assignment means that the feature is 
      // "water-only" AND part of the border (vs.internal) and, therefore,
      // not in the plan / map.

      if (neighboringDistrict == undefined) return false;

      if (neighboringDistrict != districtID)
      {
        neighboringDistricts.add(neighboringDistrict);

        if (neighboringDistricts.size > 1) return false;
      }
    }
  }

  return true;
}

