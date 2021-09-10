//
// BIAS METRICS
//

import * as T from '../types/all';
import * as U from '../utils/all';
import * as C from '../rate/dra-config';

import
{
  estSeatProbability, estSeats,
  inferSVpoints,
  findBracketingLowerVf, findBracketingUpperVf,
  findBracketingLowerSf, findBracketingUpperSf,
  estFPTPSeats
} from './method';


/* Metrics:

* ^S# [bestS] = the Democratic seats closest to proportional
* ^S% [bestSf] = the corresponding Democratic seat share
* S! [fptpS] = the estimated number of Democratic seats using first past the post
* S# [estS] (S_V) = the estimated Democratic seats, using seat probabilities
* S% [estSf] = the estimated Democratic seat share fraction, calculated as S# / N

* BS_50 [bS50] = Seat bias as a fraction of N
* BV_50 [bV50] = Votes bias as a fraction
* decl [decl] = Declination
* GS [gSym] = Global symmetry
* ?? [gamma] = 

* EG [EG] = Efficiency gap as a fraction
* BS_V [bSV] = Seats bias @ <V> (geometric)
* PR [prop] = Disproportionality
* MM [mMs] = Mean – median difference using statewide Vf
* TO [tOf] = Turnout bias
* MM' [mMd] = Mean – median difference using average district v 
* LO [LO] = Lopsided outcomes

* B% [bias] = the bias calculated as S% – ^S%

*/


// ESTIMATE BASIC BIAS -- By convention, '+' = R bias; '-' = D bias

// ^S# - The # of Democratic seats closest to proportional @ statewide Vf
// The "expected number of seats" from http://bit.ly/2Fcuf4q
export function bestSeats(N: number, Vf: number): number
{
  return Math.round((N * Vf) - U.EPSILON);
}

// ^S% - The corresponding Democratic seat share 
export function bestSeatShare(bestS: number, N: number): number
{
  return bestS / N;
}

// S% - The estimated Democratic seat share fraction
export function estSeatShare(estS: number, N: number): number
{
  return estS / N;
}

// B% - The deviation from proportionality calculated as ^S% — S%
export function calcDisproportionalityFromBest(estSf: number, bestSf: number): number
{
  return bestSf - estSf;
}

// NOTE - Not used.
// UE# - The estimated # of unearned seats
// UE_# from http://bit.ly/2Fcuf4q
export function estUnearnedSeats(proportional: number, probable: number): number
{
  return proportional - probable;
}


// ADVANCED/ALTERNATE METRICS FOR REFERENCE

export function calcTurnoutBias(statewide: number, VfArray: T.VfArray): number
{
  const districtAvg = U.avgArray(VfArray);
  const turnoutBias = statewide - districtAvg;

  return turnoutBias;
}

// PARTISAN BIAS - I'm using John Nagle's simple seat bias below, which is what
//    PlanScore is doing:
//
//   "Partisan bias is the difference between each party’s seat share and 50 %
//    in a hypothetical, perfectly tied election.For example, if a party would
//    win 55 % of a plan’s districts if it received 50 % of the statewide vote,
//    then the plan would have a bias of 5 % in this party’s favor.To calculate
//    partisan bias, the observed vote share in each district is shifted by the
//    amount necessary to simulate a tied statewide election.Each party’s seat
//    share in this hypothetical election is then determined. The difference
//    between each party’s seat share and 50 % is partisan bias."
// 
//    This is *not* King's & others' geometric partisan bias metric per se.
//    That is below.
export function estPartisanBias(inferredSVpoints: T.SVpoint[], nDistricts: number): number
{
  return estSeatBias(inferredSVpoints, nDistricts);
}

// SEATS BIAS -- John Nagle's simple seat bias @ 50% (alpha), a fractional # of seats.
export function estSeatBias(inferredSVpoints: T.SVpoint[], nDistricts: number): number
{
  const half: number = 0.5;
  const tolerance: number = 0.001;

  let dSeats: number = 0;

  for (let pt of inferredSVpoints)
  {
    if (U.areRoughlyEqual(pt.v, half, tolerance))
    {
      dSeats = pt.s * nDistricts;

      break;
    }
  }

  const rSeats: number = nDistricts - dSeats;

  const Bs = (rSeats - dSeats) / 2.0;

  // NOTE - That is the same as (N/2) - S(0.5).
  // const BsAlt = (nDistricts / 2.0) - dSeats;

  return Bs;
}

// VOTES BIAS -- John Nagle's simple vote bias @ 50% (alpha2), a percentage.
export function estVotesBias(inferredSVpoints: T.SVpoint[], nDistricts: number): number | undefined
{
  let extraVf: number | undefined = undefined;

  // Interpolate the extra Vf required @ Sf = 0.5
  const lowerPt = findBracketingLowerSf(0.5, inferredSVpoints);
  const upperPt = findBracketingUpperSf(0.5, inferredSVpoints);

  if (lowerPt && upperPt)
  {
    extraVf = 0.0;

    if ((upperPt.s - lowerPt.s) != 0)
    {
      const ratio = (upperPt.v - lowerPt.v) / (upperPt.s - lowerPt.s);
      const deltaS = 0.5 - lowerPt.s;

      extraVf = lowerPt.v + (ratio * deltaS) - 0.5;
    }
  }

  return extraVf;
}

// GEOMETRIC SEATS BIAS (@ V = statewide vote share)
export function estGeometricSeatsBias(Vf: number, dSVpoints: T.SVpoint[], rSVpoints: T.SVpoint[]): number | undefined
{
  let BsGf: number | undefined = undefined;

  const bgsSVpoints: T.SVpoint[] = inferGeometricSeatsBiasPoints(dSVpoints, rSVpoints);

  // Interpolate the seat fraction @ Vf
  const lowerPt = findBracketingLowerVf(Vf, bgsSVpoints);
  const upperPt = findBracketingUpperVf(Vf, bgsSVpoints);

  if (lowerPt && upperPt)
  {
    const ratio = (upperPt.s - lowerPt.s) / (upperPt.v - lowerPt.v);
    const deltaV = Vf - lowerPt.v;
    const deltaS = ratio * deltaV;

    BsGf = lowerPt.s + deltaS;
  }

  return BsGf;
}

export function inferGeometricSeatsBiasPoints(dSVpoints: T.SVpoint[], rSVpoints: T.SVpoint[]): T.SVpoint[]
{
  const nPoints = dSVpoints.length;

  let bgsSVpoints: T.SVpoint[] = [];

  for (let i = 0; i < nPoints; i++)
  {
    const Vf = dSVpoints[i].v;

    const sD = dSVpoints[i].s;
    const sR = rSVpoints[i].s;
    const BsGf = 0.5 * (sR - sD);

    bgsSVpoints.push({v: Vf, s: BsGf});
  }

  return bgsSVpoints;
}

export function invertSVPoints(inferredSVpoints: T.SVpoint[]): T.SVpoint[]
{
  let invertedSVpoints: T.SVpoint[] = [];

  for (let pt of inferredSVpoints)
  {
    const Vd: number = pt.v;
    const Sd: number = pt.s;
    const Vr: number = 1.0 - Vd;
    const Sr: number = 1.0 - Sd;

    invertedSVpoints.push({v: Vr, s: Sr});
  }

  invertedSVpoints.sort(function (a, b)
  {
    return a.v - b.v;
  });

  return invertedSVpoints;
}

// EFFICIENCY GAP -- note the formulation used. Also, to accommodate turnout bias,
//   we would need to have D & R votes, not just shares.
export function calcEfficiencyGap(Vf: number, Sf: number, shareType = T.Party.Democratic): number
{
  let efficiencyGap: number;

  if (shareType == T.Party.Republican)
  {
    // NOTE - This is the  common formulation:
    //
    //   EG = (Sf – 0.5)  – (2 × (Vf – 0.5))
    //
    //   in which it is implied that '-' = R bias; '+' = D bias.

    efficiencyGap = (Sf - 0.5) - (2.0 * (Vf - 0.5));
  }
  else
  {
    // NOTE - This is the alternate formulation in which '+' = R bias; '-' = D bias,
    //   which is consistent with all our other metrics.

    efficiencyGap = (2.0 * (Vf - 0.5)) - (Sf - 0.5);
  }

  return efficiencyGap;
}

// MEAN–MEDIAN DIFFERENCE
// 
// From PlanScore.org: "The mean-median difference is a party’s median vote share
//   minus its mean vote share, across all of a plan’s districts. For example, if
//   a party has a median vote share of 45 % and a mean vote share of 50 %, then
//   the plan has a mean - median difference of 5 % against this party. When the
//   mean and the median diverge significantly, the district distribution is skewed
//   in favor of one party and against its opponent. Conversely, when the mean and
//   the median are close, the district distribution is more symmetric."
//
// From Princeton Gerrymandering Project: "The mean-median difference is calculated
//   by subtracting the average vote share of either party across all districts from
//   the median vote share of the same party across all districts. A negative mean - 
//   median difference indicates that the examined party has an advantage; a positive
//   difference indicates that the examined party is disadvantaged."
//
// So:
// * With D VPI, '+' = R bias; '-' = D bias <<< We're using this convention.
// * With R VPI, '-' = R bias; '+' = D bias.
export function estMeanMedianDifference(VfArray: T.VfArray, Vf?: number): number
{
  const meanVf = Vf ? Vf : U.avgArray(VfArray);
  const medianVf: number = U.medianArray(VfArray);

  // NOTE - Switched order to get the signs correct
  const difference: number = meanVf - medianVf;
  // const difference: number = medianVf - meanVf;

  return difference;
}

// HELPERS FOR DECLINATION & LOPSIDED OUTCOMES

// Key r(v) points, defined in Fig. 16:
// * VfArray are Democratic seat shares (by convention).
// * But the x-axis of r(v) graphs is Republican seat share.
// * So, you have to invert the D/R axis for Vb; and
// * Invert the D/R probabilities for Va.
export function keyRVpoints(VfArray: T.VfArray): T.rVpoints
{
  const nDistricts = VfArray.length;
  const estS = estSeats(VfArray);

  const Sb = estSeatShare(estS, nDistricts);

  const Rb = Sb / 2;
  const Ra = (1 + Sb) / 2;

  let Vb = 1.0 - (U.sumArray(VfArray.map(v => estSeatProbability(v) * v))) / estS;
  let Va = (U.sumArray(VfArray.map(v => estSeatProbability(1 - v) * (1 - v)))) / (nDistricts - estS);

  // 06-24-21 - Make sure the results are in range (no floating point errors)
  Vb = Math.min(Vb, 0.50);
  Va = Math.max(Va, 0.50);

  const keyPoints: T.rVpoints = {
    Sb: Sb,
    Ra: Ra,
    Rb: Rb,
    Va: Va,
    Vb: Vb
  };

  return keyPoints;
}

export function isASweep(Sf: number, nDistricts: number): boolean
{
  const oneDistrict: number = 1 / nDistricts;
  const bSweep: boolean = ((Sf > (1 - oneDistrict)) || (Sf < oneDistrict)) ? true : false;

  return bSweep;
}

export function radiansToDegrees(radians: number): number
{
  const degrees: number = radians * (180 / Math.PI);

  return degrees;
}

// DECLINATION
// 
// Declination is calculated using the key r(v) points, defined in Fig. 16.
// Note that district vote shares are D shares, so party A = Rep & B = Dem.
export function calcDeclination(VfArray: T.VfArray): number | undefined
{
  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(VfArray);
  const bSweep: boolean = isASweep(Sb, VfArray.length);
  const bTooFewDistricts: boolean = (VfArray.length < 5) ? true : false;
  const bVaAt50: boolean = (U.areRoughlyEqual((Va - 0.5), 0.0, U.EPSILON)) ? true : false;
  const bVbAt50: boolean = (U.areRoughlyEqual((0.5 - Vb), 0.0, U.EPSILON)) ? true : false;

  let decl: number | undefined;

  if (bSweep || bTooFewDistricts || bVaAt50 || bVbAt50)
  {
    decl = undefined;
  }
  else
  {
    const lTan = (Sb - Rb) / (0.5 - Vb);
    const rTan = (Ra - Sb) / (Va - 0.5);

    const lAngle = radiansToDegrees(Math.atan(lTan));
    const rAngle = radiansToDegrees(Math.atan(rTan));
    decl = rAngle - lAngle;
    decl = decl;
  }

  return decl;
}

// LOPSIDED OUTCOMES
//
// This is a measure of packing bias is:
//
//   LO = (1⁄2 - vB) - (vA – 1⁄2)     Eq. 5.4.1 on P. 26
//
// "The ideal for this measure is that the excess vote share for districts
//  won by party A averaged over those districts equals the excess vote share
//  for districts won by party B averaged over those districts.
//  A positive value of LO indicates greater packing of party B voters and,
//  therefore, indicates a bias in favor of party A."
export function calcLopsidedOutcomes(VfArray: T.VfArray): number | undefined
{
  const {Sb, Ra, Rb, Va, Vb} = keyRVpoints(VfArray);
  const bSweep: boolean = isASweep(Sb, VfArray.length);

  let LO: number | undefined;
  if (bSweep)
  {
    LO = undefined;
  }
  else
  {
    LO = (0.5 - Vb) - (Va - 0.5);
  }

  return LO;
}

// GLOBAL SYMMETRY - Fig. 17 in Section 5.1
export function calcGlobalSymmetry(dSVpoints: T.SVpoint[], rSVpoints: T.SVpoint[], S50V: number): number
{
  let gSym: number = 0.0;

  for (let i in dSVpoints)
  {
    gSym += Math.abs(dSVpoints[i].s - rSVpoints[i].s) / 2;
  }

  const sign = (S50V < 0) ? -1 : 1;
  gSym *= sign;

  return gSym / 100;
}

// RAW DISPROPORTIONALITY
//
// PR = Sf – Vf     : Eq.C.1.1 on P. 42
export function calcDisproportionality(Vf: number, Sf: number): number
{
  const prop = Vf - Sf;
  // const prop = Sf - Vf;

  return prop;
}

// BIG 'R': Defined in Footnote 22 on P. 10
export function calcBigR(Vf: number, Sf: number): number | undefined
{
  let bigR: number | undefined = undefined;

  if (!(U.areRoughlyEqual(Vf, 0.5, U.EPSILON)))
  {
    bigR = (Sf - 0.5) / (Vf - 0.5);
  }

  return bigR;
}

// MINIMAL INVERSE RESPONSIVENESS
//
// zeta = (1 / r) - (1 / r_sub_max)     : Eq. 5.2.1
//
// where r_sub_max = 10 or 20 for balanced and unbalanced states, respectively.
export function calcMinimalInverseResponsiveness(Vf: number, r: number): number | undefined
{
  let MIR: number | undefined = undefined;

  if (!(U.areRoughlyEqual(r, 0, U.EPSILON)))
  {
    const bBalanced = isBalanced(Vf);
    const ideal = bBalanced ? 0.1 : 0.2;

    MIR = (1 / r) - ideal;

    MIR = Math.max(MIR, 0.0);
  }

  return MIR;
}

function isBalanced(Vf: number): boolean
{
  const [lower, upper] = C.competitiveRange();
  const bBalanced = ((Vf > upper) || (Vf < lower)) ? false : true;

  return bBalanced;
}

// GAMMA (NEW)
// g = 50 + r<V>(<V>-50) – S(<V>)
// def calc_gamma(plan):
//     return (0.5 + plan.responsiveness * (plan.statewide_vote_share - 0.5) \
//       - (plan.predicted_D_seats / plan.districts)) \
//         * 100
export function calcGamma(Vf: number, Sf: number, r: number): number
{
  const g = 0.5 + (r * (Vf - 0.5)) - Sf;

  return g;
}
