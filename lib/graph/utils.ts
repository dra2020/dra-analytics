//
// UTILITIES
//


import * as T from './types'
import * as S from './settings';


export function getDistrict(geoID: string, plan: T.PlanByGeoID): number | undefined
{
  if (keyExists(geoID, plan)) return plan[geoID];

  return undefined;
}

export function neighbors(node: string, graph: T.ContiguityGraph): string[]
{
  if (!keyExists(node, graph)) return [];

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

    if (!(keyExists(districtID, invertedPlan))) invertedPlan[districtID] = new Set();

    invertedPlan[districtID].add(geoID);
  }

  return invertedPlan;
}


// GENERIC HELPERS

export function isArrayEmpty(a: any[]): boolean
{
  if (a === undefined || a.length == 0) return true;

  return false;
}

export function keyExists(k: any, o: object): boolean
{
  return k in o;
}

export function isObjectEmpty(o: object): boolean
{
  return Object.keys(o).length === 0;
}

