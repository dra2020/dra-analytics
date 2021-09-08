//
// POPULATION DEVIATION
//

import {PopulationScorecard} from '../types/population';
import {ratePopulationDeviation} from '../rate/dra-ratings';
import * as C from '../rate/dra-config';
import * as T from '../types/general';
import * as U from '../utils/all';

// TODO
// * Rename to makePopulationScorecard()
// * Pull out calcPopulationDeviation()
// * Pull out isRoughlyEqual()
//
export function doPopulationDeviation(e: number[], targetSize: number, bLegislative: boolean, bLog: boolean = false): PopulationScorecard
{
  // Remove empty districts
  const totPopByDistrict = e.filter(x => x > 0);

  let min = 0;
  let max = 0;

  // Compute the min & max district populations
  // If there's more than 1 non-empty district, calculate a non-zero deviation
  if (totPopByDistrict.length > 1)
  {
    min = U.minArray(totPopByDistrict);
    max = U.maxArray(totPopByDistrict);
  }

  // Calculate the raw population deviation - NOTE: Always >= 0.
  const popDev = (max - min) / targetSize;  // Don't trim the result here!
  // const popDev = U.trim((max - min) / targetSize);  DELETE
  const rating = ratePopulationDeviation(popDev, bLegislative);

  const threshold = C.popdevThreshold(bLegislative);

  const notes: T.Dict = {
    'maxDeviation': max - min,
    'threshold': threshold
  };

  // Populate the measurement
  const s: PopulationScorecard = {
    deviation: popDev,
    rating: rating,
    roughlyEqual: true,  // TODO
    notes: notes
  }

  return s;
}