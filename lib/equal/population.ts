//
// POPULATION DEVIATION
//

import {PopulationScorecard} from '../types/all';
import {ratePopulationDeviation} from '../rate/dra-ratings';
import * as C from '../rate/dra-config';
import * as T from '../types/all';
import * as U from '../utils/all';


// MMD - Generalize for different #'s of reps per district
export function calcPopulationDeviation(max: number, min: number, targetSize: number): number
{
  return (max - min) / targetSize;  // Don't trim the result here!
}

export function isRoughlyEqual(devation: number, bLegislative: boolean): boolean
{
  const threshold = C.popdevThreshold(bLegislative);

  return (devation <= threshold) ? true : false;
}

// MMD - Add optional # of reps per district
export function makePopulationScorecard(totPopByDistrict: number[], targetSize: number, bLegislative: boolean, repsByDistrict?: number[], bLog: boolean = false): PopulationScorecard
{
  const nonEmptyDistricts = totPopByDistrict.filter(x => x > 0);

  let min = 0;
  let max = 0;

  // MMD - Generalize min/max for different #'s of reps per district
  if (nonEmptyDistricts.length > 1)
  {
    min = U.minArray(nonEmptyDistricts);
    max = U.maxArray(nonEmptyDistricts);
  }

  const deviation = calcPopulationDeviation(max, min, targetSize);
  // const rating = ratePopulationDeviation(deviation, bLegislative);
  const roughlyEqual = ((nonEmptyDistricts.length > 1) && isRoughlyEqual(deviation, bLegislative)) ? true : false;

  const threshold = C.popdevThreshold(bLegislative);

  const notes: T.Dict = {
    'maxDeviation': max - min,
    'threshold': threshold
  };

  // Populate the measurement
  const s: PopulationScorecard = {
    deviation: deviation,
    // rating: rating,
    roughlyEqual: roughlyEqual,
    notes: notes
  }

  return s;
}