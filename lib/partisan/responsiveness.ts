//
// RESPONSIVENESS METRICS -- includes "competitiveness" metrics
//

import * as N from '../rate/normalize';
import * as T from '../types/partisan';
import * as U from '../utils/all';
import * as C from '../rate/dra-config';
import * as S from '../rate/settings';

import {estDistrictResponsiveness, estFPTPSeats, findBracketingLowerVf, findBracketingUpperVf} from './method';
import {bestSeats} from './bias';


/* Metrics:

* R [bigR] = Overall responsiveness or winner’s bonus 
* r [littleR] = The point responsiveness at V% (the slope of the S(V) curve at <V>)
* MIR [MIR] = Minimal inverse responsiveness 
* rD [rD] = the estimated # of responsive districts (using probabilities)
* rD% [rDf] = the estimated # of responsive districts, as a fraction of N

* C [c] = the number of districts that fall into the range [45–55%]
* cD [cD] = the estimated # of competitive districts, using probabilities & a narrower [0.25–0.75] range
* cD% [cDf] = the estimated # of competitive districts, as a fraction of N
* beg/end [mRange] = the 1–N indices for the first and last district that separate the likely result and the proportional result
* Md [mD] = the competitiveness of the marginal districts
* Md% [mDf] = the probability that the marginal seats will flip, so S% => ^S%

*/

// RESPONSIVENESS

// R# - Estimate responsiveness at the statewide vote share
export function estResponsiveness(Vf: number, inferredSVpoints: T.SVpoint[]): number | undefined
{
  let r: number | undefined = undefined;

  // NOTE - Seat values are already fractions [0.0–1.0] here.
  const lowerPt = findBracketingLowerVf(Vf, inferredSVpoints);
  const upperPt = findBracketingUpperVf(Vf, inferredSVpoints);

  if (lowerPt && upperPt)
  {
    if (!(U.areRoughlyEqual((upperPt.v - lowerPt.v), 0, S.EPSILON)))
    {
      r = ((upperPt.s - lowerPt.s) / (upperPt.v - lowerPt.v));
    }
  }

  return r;
}

// rD -  Estimate the number of responsive districts, given a set of Vf's
export function estResponsiveDistricts(VfArray: T.VfArray): number
{
  // Python: sum([est_district_responsiveness(vpi) for vpi in vpi_by_district])
  return U.sumArray(VfArray.map(v => estDistrictResponsiveness(v)));
}

// rD% - The estimated # of responsive districts, as a fraction of N
export function estResponsiveDistrictsShare(rD: number, N: number): number
{
  return rD / N;
}


// ESTIMATE COMPETITIVENESS (ENHANCED)

// C - Count the # of competitive districts, defined as v in [45–55%]
export function countCompetitiveDistricts(VfArray: T.VfArray): number
{
  return U.sumArray(VfArray.map(v => isCompetitive(v)));
}
function isCompetitive(v: number): number
{
  return ((v >= C.competitiveRange()[C.BEG]) && (v <= C.competitiveRange()[C.END])) ? 1 : 0;
}

// cD - The estimated # of competitive districts
export function estCompetitiveDistricts(VfArray: T.VfArray, bCompress: boolean = false): number
{
  return U.sumArray(VfArray.map(v => estDistrictCompetitiveness(v, bCompress)));
}

export function estDistrictCompetitiveness(Vf: number, bCompress: boolean = false): number
{
  const _normalizer = new N.Normalizer(Vf);

  // The end points of the probability distribution
  // NOTE - These aren't the points where races start or stop being contested,
  //   just the end points of a distribution that yields the desired behavior
  //   in the typical competitive range [45-55%].
  const distBeg = bCompress ? C.competitiveDistribution()[C.BEG] : 0.0;
  const distEnd = bCompress ? C.competitiveDistribution()[C.END] : 1.0;

  _normalizer.clip(distBeg, distEnd);
  _normalizer.unitize(distBeg, distEnd);

  const dC = estDistrictResponsiveness(_normalizer.wipNum);

  return dC;
}

// cD% - The estimated # of competitive districts, as a fraction of N
export function estCompetitiveDistrictsShare(cD: number, N: number): number
{
  return cD / N;
}

// Md - The estimated # of "marginal" districts in and around the likely FPTP
//   seats & the best seat split that are competitive.
export function estMarginalCompetitiveDistricts(Mrange: number[], VfArray: T.VfArray, bCompress: boolean = false): number
{
  const minId = Mrange[C.BEG];
  const maxId = Mrange[C.END];

  // Sort the array values, and subset it to those districts
  // NOTE - I'm *not* keeping track of the district indexes right now
  let subsetVfArray = U.deepCopy(VfArray).sort().slice(minId - 1, maxId);

  // Est. competitive districts on that array
  const Md = U.sumArray(subsetVfArray.map((v: number) => estDistrictCompetitiveness(v, bCompress)));

  return Md;
}

// Md% - The estimated competitiveness of the "marginal" districts in and around
//   the likely FPTP seats & the best seat split as a fraction
export function estMarginalCompetitiveShare(Md: number, Mrange: number[]): number
{
  const minId = Mrange[C.BEG];
  const maxId = Mrange[C.END];

  // Est. competitive district share on that result
  const MdShare = estCompetitiveDistrictsShare(Md, maxId - minId + 1);

  return MdShare;
}

export function findMarginalDistricts(Vf: number, VfArray: T.VfArray, N: number): number[]
{
  const bestS = bestSeats(N, Vf);
  const fptpS = estFPTPSeats(VfArray);

  // Find the marginal districts IDs (indexed 1–N)
  let minId: number;
  let maxId: number;

  // Bracket the marginal districts
  if (bestS > fptpS)
  {
    minId = Math.max((N - bestS) - 1, 1);
    maxId = Math.min((N - fptpS) + 1, N);
  }
  else if (fptpS > bestS)
  {
    minId = Math.max((N - fptpS) - 1, 1);
    maxId = Math.min((N - bestS) + 1, N);
  }
  else
  {
    minId = Math.max((N - bestS) - 1, 1);
    maxId = Math.min((N - bestS) + 1, N);
  }

  return [minId, maxId];
}
