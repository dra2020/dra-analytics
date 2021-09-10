//
// UTILITIES
//


import * as T from './types'
import * as S from './settings';
import * as U from '../utils/all';


export function getDistrict(geoID: string, plan: T.PlanByGeoID): number | undefined
{
  if (U.keyExists(geoID, plan)) return plan[geoID];

  return undefined;
}

export function neighbors(node: string, graph: T.ContiguityGraph): string[]
{
  if (!U.keyExists(node, graph)) return [];

  // Handle both unweighted & weighted neighbors
  const n = graph[node];
  const l = (n instanceof Array) ? n : Object.keys(n);

  return l;
}

export function isOutOfBounds(geoID: string): boolean
{
  return geoID == S.OUT_OF_BOUNDS;
}


// NOTE - This is only used in the CLI and Jest tests
// Invert a plan by geoID to sets of geoIDs by districtID
export function invertPlan(plan: T.PlanByGeoID): T.PlanByDistrictID
{
  let invertedPlan = {} as T.PlanByDistrictID;

  for (let geoID in plan)
  {
    let districtID = plan[geoID];

    if (!(U.keyExists(districtID, invertedPlan))) invertedPlan[districtID] = new Set();

    invertedPlan[districtID].add(geoID);
  }

  return invertedPlan;
}


