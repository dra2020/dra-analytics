import * as FU from './fileutils';

import * as T from '../lib/types/all'
import * as U from '../lib/graph/utils';
import {isConnected} from '../lib/graph/connected';
import {isEmbedded} from '../lib/graph/embedded';

export function testContiguity(f: string, g: T.ContiguityGraph): boolean
{
  const plan: T.PlanByGeoID = FU.readPlanCSV(f);
  const invertedPlan: T.PlanByDistrictID = U.invertPlan(plan);
  const nDistricts: number = Object.keys(invertedPlan).length;

  let bContiguous: boolean = true;

  for (let i = 1; i <= nDistricts; i++)
  {
    const featureIDs: T.FeatureGroup = invertedPlan[i];
    const bConnected = isConnected(featureIDs, g);

    if (!bConnected)
    {
      bContiguous = false;
      break;
    }
  }

  return bContiguous;
}

export function testEmbeddedness(f: string, g: T.ContiguityGraph): boolean
{
  const plan: T.PlanByGeoID = FU.readPlanCSV(f);
  const invertedPlan: T.PlanByDistrictID = U.invertPlan(plan);
  const nDistricts: number = Object.keys(invertedPlan).length;

  let bNotEmbedded: boolean = true;

  for (let i = 1; i <= nDistricts; i++)
  {
    const featureIDs: T.FeatureGroup = invertedPlan[i];
    const bEmbedded = isEmbedded(i, featureIDs, plan, g);

    if (bEmbedded)
    {
      bNotEmbedded = false;
      break;
    }
  }

  return bNotEmbedded;
}
