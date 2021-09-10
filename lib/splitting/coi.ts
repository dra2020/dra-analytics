//
// COI SPLITTING -- using Sam Wang's metrics
//

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

