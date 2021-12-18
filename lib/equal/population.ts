//
// POPULATION DEVIATION
//

import {PopulationScorecard} from '../types/all';
import {ratePopulationDeviation} from '../rate/dra-ratings';
import * as C from '../rate/dra-config';
import * as T from '../types/all';
import * as U from '../utils/all';


// MMD - This is the same for SMD & MMD. It's the calculation of min, max, and target size that differs.
export function calcPopulationDeviation(max: number, min: number, targetSize: number): number
{
  return (max - min) / targetSize;  // Don't trim the result here!
}

export function isRoughlyEqual(devation: number, bLegislative: boolean): boolean
{
  const threshold = C.popdevThreshold(bLegislative);

  return (devation <= threshold) ? true : false;
}

// MMD
// - Add optional # of reps per district. 
// - Assume targetSize has been calculated correctly per # of reps not districts.
// - If it exists, handle the MMD-specific calculations.
export function makePopulationScorecard(totPopByDistrict: number[], targetSize: number, bLegislative: boolean, repsByDistrict?: number[], bLog: boolean = false): PopulationScorecard
{
  const nDistricts = totPopByDistrict.length;

  // MMD - Validate reps per district input
  if (repsByDistrict) 
  {
    if (repsByDistrict.length != nDistricts) throw new Error("Mismatched #'s of districts passed to makePopulationScorecard()!");
    if (repsByDistrict.includes(0)) throw new Error("Zero reps for a district passed to makePopulationScorecard()!");
    // Assume a positive integer # of reps per district
  }

  // MMD - Figure out the type of districts, SMD or MMD.
  const nReps = (repsByDistrict) ? repsByDistrict.reduce((a, b) => a + b, 0) : nDistricts;
  const bSMD = (!repsByDistrict || (nReps == nDistricts)) ? true : false;

  // MMD - Generalize populations for non-empty districts to be per rep.
  // const nonEmptyDistricts = totPopByDistrict.filter(x => x > 0);
  let popPerRep: number[] = U.deepCopy(totPopByDistrict);
  if (!bSMD && repsByDistrict)
  {
    for (let i = 0; i < nDistricts; i += 1)
    {
      popPerRep[i] = totPopByDistrict[i] / repsByDistrict[i];
    }
  }
  const nonEmptyDistricts = popPerRep.filter(x => x > 0);

  let min = 0;
  let max = 0;

  // MMD - This is already generalized, because nonEmptyDistricts is generalized.
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