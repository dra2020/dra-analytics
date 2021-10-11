//
// COI SPLITTING -- using Sam Wang's metrics
//

import * as T from '../types/all';
import * as U from './utils';


export function uncertaintyOfMembership(splits: number[]): number 
{
  // 07-29-21 -- Filter out 0% splits
  const intermediate: number[] = splits.filter(x => x > 0).map(x => x * Math.log2(x));
  let result: number = -1 * intermediate.reduce((accumulator, currentValue) => accumulator + currentValue);
  if (U.isMinusZero(result)) result = 0;
  return result;
}

export function effectiveSplits(splits: number[]): number 
{
  // 07-29-21 -- Filter out 0% splits
  const intermediate: number[] = splits.filter(x => x > 0).map(x => x ** 2);
  let result: number = (1 / intermediate.reduce((accumulator, currentValue) => accumulator + currentValue)) - 1;
  if (U.isMinusZero(result)) result = 0;
  return result;
}


// CLI & OTHER USERS  

export function calcCOISplitting(communities: T.COISplits[]): T.COISplittingJSONReady
{
  let byCOI: T.COISplitting[] = [];

  for (let coi of communities)
  {
    const es: number = effectiveSplits(coi.splits);
    const u: number = uncertaintyOfMembership(coi.splits);

    const entry: T.COISplitting = {
      name: coi.name,
      effectiveSplits: es,
      uncertainty: u
    }

    byCOI.push(entry);
  }

  const analysis: T.COISplittingJSONReady = {
    byCOI: byCOI
  }

  return analysis;
}