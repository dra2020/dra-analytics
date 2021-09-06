//
// DRA-SPECIFIC THRESHOLDS, SCALES, AND WEIGHTS
//
// * A layer of functions over config.json, so that they could be overridden dynamically.
//   That is not implemented yet.
//

import * as T from '../types/all'
import config from './dra-config.json';

export const BEG = 0;
export const END = 1;


// PARTISAN

export function biasRange(overridesJSON?: any): number[]
{
  const range = config.partisan.bias.range;

  return range;
}

export function winnerBonus(overridesJSON?: any): number
{
  const bonus = config.partisan.bonus;

  return bonus;
}

// The maximum # of unearned seats that scores positively
export function unearnedThreshold(overridesJSON?: any): number
{
  const threshold = config.partisan.impact.threshold;

  return threshold;
}

// The simple user-facing range, i.e., 45–55%.

export function competitiveRange(overridesJSON?: any): number[]
{
  const range = config.partisan.competitiveness.simpleRange;

  return range;
}

export function competitiveDistribution(overridesJSON?: any): number[]
{
  const dist = config.partisan.competitiveness.distribution;

  return dist;
}

// The more complex internal range for normalizing Cdf.
// * 06/23/2020 - As part of relaxing the competitive range, I changed this max
//   from 0.67 to 0.75.
export function overallCompetitivenessRange(overridesJSON?: any): number[]
{
  const range = config.partisan.competitiveness.range;

  return range;
}

// export function marginalCompetitivenessRange(overridesJSON?: any): number[]
// {
//   const range = config.partisan.responsiveness.marginal.range;

//   return range;
// }

// export function marginalCompetitivenessWeight(overridesJSON?: any): number
// {
//   const mcW = config.partisan.responsiveness.marginal.weight;

//   return mcW;
// }

// export function overallCompetitivenessWeight(overridesJSON?: any): number
// {
//   const ocW = config.partisan.responsiveness.overall.weight;

//   return ocW;
// }


// MINORITY

export function minorityOpportunityRange(overridesJSON?: any): number[]
{
  const range = config.minority.range;

  return range;
}

export function minorityOpportunityDistribution(overridesJSON?: any): number[]
{
  const dist = config.minority.distribution;

  return dist;
}

// For Black VAP %
export function minorityShift(overridesJSON?: any): number
{
  const BLACK = 0;
  const shift = config.minority.shift[BLACK];

  return shift;
}

// Dilution for other demos
export function minorityShiftDilution(overridesJSON?: any): number
{
  const DILUTION = 1;
  const shift = config.minority.shift[DILUTION];

  return shift;
}

export function coalitionDistrictWeight(overridesJSON?: any): number
{
  const weight = config.minority.coalition.weight;

  return weight;
}


// COMPACTNESS

export function reockWeight(overridesJSON?: any): number
{
  const rW = config.compactness.reock.weight;

  return rW;
}

export function reockRange(overridesJSON?: any): number[]
{
  const range = config.compactness.reock.range;

  return range;
}

export function polsbyWeight(overridesJSON?: any): number
{
  const ppW = config.compactness.polsby.weight;

  return ppW;
}

export function polsbyRange(overridesJSON?: any): number[]
{
  const range = config.compactness.polsby.range;

  return range;
}


// SPLITTING

export function countySplittingWeight(overridesJSON?: any): number
{
  const csW = config.splitting.county.weight;

  return csW;
}

export function countySplittingRange(d: T.DistrictType, overridesJSON?: any): number[]
{
  const range = config.splitting.county.range[d];

  return range;
}

export function districtSplittingWeight(overridesJSON?: any): number
{
  const dsW = config.splitting.district.weight;

  return dsW;
}

export function districtSplittingRange(d: T.DistrictType, overridesJSON?: any): number[]
{
  const range = config.splitting.district.range[d];

  return range;
}


// NOTE - Raw ranges, not inverted (i.e., smaller is better)
// NOTE - This could be optimized to not calc LD values for CD's (or do it once)
export function popdevRange(bLegislative: boolean, overridesJSON?: any): number[]
{
  const cdRange = config.popdev.range[T.DistrictType.Congressional];
  const worstCD = cdRange[BEG];
  const bestCD = cdRange[END];
  const ldRange = config.popdev.range[T.DistrictType.StateLegislative];
  const iRange = bLegislative ? ldRange : cdRange;

  const worst = iRange[BEG];
  const best = bLegislative ? (bestCD / worstCD) * iRange[BEG] : iRange[END];

  // Invert the range, so bigger is better.
  return [worst, best];
}

// NOTE - Raw threshold, not inverted (i.e., smaller is better)
export function popdevThreshold(bLegislative: boolean, overridesJSON?: any): number
{
  const threshold = popdevRange(bLegislative)[BEG];

  return threshold;
}


