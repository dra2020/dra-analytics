//
// METHODOLOGY SUPPORT
//

import {approximateERF} from './erf';
import * as N from '../rate/normalize';
import * as T from '../types/partisan';
import * as U from '../utils/array';
import * as S from '../rate/settings';


// CORE CAPABILITIES FROM JOHN NAGLE'S METHOD

// Estimate the probability of a seat win for district, given a Vf
export function estSeatProbability(Vf: number, range?: number[]): number
{
  if (range)
  {
    // If a range is provided, it defines end points of a compressed probability
    // distribution. These *aren't* the points where races start or stop being
    // contested, just the end points of a distribution that yields the desired
    // probabilities in the typical competitive range [45-55%].

    const _normalizer = new N.Normalizer(Vf);

    const distBeg = range[0];
    const distEnd = range[1];

    _normalizer.clip(distBeg, distEnd);
    _normalizer.unitize(distBeg, distEnd);

    return seatProbabilityFn(_normalizer.wipNum);
  }
  else
  {
    // Otherwise, use the full probability distribution.

    return seatProbabilityFn(Vf);
  }
}

// const {erf} = require('mathjs');
// console.log("erf(0.2) =", erf(0.2));    // returns 0.22270258921047847
// console.log("erf(-0.5) =", erf(-0.5));  // returns -0.5204998778130465
// console.log("erf(4) =", erf(4));        // returns 0.9999999845827421

function seatProbabilityFn(Vf: number): number
{
  // Python: 0.5 * (1 + erf((vpi - 0.50) / (0.02 * sqrt(8))))
  return 0.5 * (1.0 + approximateERF((Vf - 0.50) / (0.02 * Math.sqrt(8))));
}

// The estimated # of Democratic seats, using seat probabilities
export function estSeats(VfArray: T.VfArray, range?: number[]): number
{
  // Python: sum([est_seat_probability(vpi) for vpi in vpi_by_district])
  return U.sumArray(VfArray.map(v => estSeatProbability(v, range)));
}

// Estimate the number of responsive districts [R(d)], given a set of Vf's
export function estDistrictResponsiveness(Vf: number): number
{
  // Python: 1 - 4 * (est_seat_probability(vpi) - 0.5)**2
  return 1.0 - 4.0 * (estSeatProbability(Vf) - 0.5) ** 2;
}

export function inferSVpoints(Vf: number, VfArray: T.VfArray, shift: T.Shift, range?: number[]): T.SVpoint[]
{
  const nDistricts = VfArray.length;
  let SVpoints: T.SVpoint[] = [];

  for (let shiftedVf of shiftRange())
  {
    const shiftedVPI: T.VfArray = shiftDistricts(Vf, VfArray, shiftedVf, shift);
    const shiftedSf = estSeats(shiftedVPI, range) / nDistricts;
    SVpoints.push({v: shiftedVf, s: shiftedSf});
  }

  return SVpoints;
}

function shiftDistricts(Vf: number, VfArray: T.VfArray, shiftedVf: number, shift: T.Shift): T.VfArray
{
  if (shift == T.Shift.Proportional)
    return shiftProportionally(Vf, VfArray, shiftedVf);
  else
    return shiftUniformly(Vf, VfArray, shiftedVf);
}

// Shift districts proportionally
function shiftProportionally(Vf: number, VfArray: T.VfArray, shiftedVf: number): T.VfArray
{
  let shiftedVfArray: T.VfArray;

  if (shiftedVf < Vf)
  {
    // Shift down: D's to R's
    const proportion = shiftedVf / Vf;
    shiftedVfArray = VfArray.map((v => v * proportion));
  }
  else if (shiftedVf > Vf)
  {
    // Shift up: R's to D's
    const proportion = (1.0 - shiftedVf) / (1.0 - Vf);
    shiftedVfArray = VfArray.map((v => (1.0 - (1.0 - v) * proportion)));
  }
  else
  {
    // No shift: shift = actual
    shiftedVfArray = VfArray;
  }

  return shiftedVfArray;
}

// Shift districts uniformly
function shiftUniformly(Vf: number, VfArray: T.VfArray, shiftedVf: number): T.VfArray
{
  const shift = shiftedVf - Vf;

  const shiftedVfArray: T.VfArray = VfArray.map((v => v + shift));

  return shiftedVfArray;
}

// Generate a range of v's in 1/2% increments
function shiftRange(): number[]
{
  const range: number[] = [0.25, 0.75];
  const axisRange: number[] = [];
  const step = (1 / 100) / 2;

  for (let v = range[0]; v <= range[1] + S.EPSILON; v += step)
  {
    axisRange.push(v);
  }

  return axisRange;
}


// Miscellaneous

// The estimated number of Democratic seats using first past the post
export function estFPTPSeats(VfArray: T.VfArray): number
{

  // Python: sum([1.0 for vpi in vpi_by_district if (vpi > 0.5)])
  return U.sumArray(VfArray.map(v => fptpWin(v)));

  /* DELETE
  return U.sumArray(VfArray.map(v =>
  {
    if (v > 0.5)
    {
      return 1.0;
    }
    else
    {
      return 0.0;
    }
  }));
  */
}

export function fptpWin(demPct: number): number
{
  // Vote shares should be fractions in the range [0.0 – 1.0]
  //assert((demPct <= 1.0) && (demPct >= 0.0));

  return ((demPct > 0.5) ? 1 : 0);
}