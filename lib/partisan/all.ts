// Export everything here -- restrict package exports in all/partisan.ts

export * from './erf';
export * from './method';
export * from './bias';
export * from './responsiveness';


// COMBINE EVERYTHING INTO A PARTISAN "SCORECARD"
// * The bias & responsiveness calculations both depend on the same underlying method, and
//   everything is too intertwined to do separate bias & responsiveness passes & scorecards

import * as T from '../../lib/types/all'
import * as U from '../utils/all';

import
{
  estSeats,
  estFPTPSeats,
  inferSVpoints
} from '../../lib/partisan/method'

import
{
  estSeatShare,
  bestSeats, bestSeatShare,
  calcDisproportionalityFromBest,
  estUnearnedSeats,
  calcTurnoutBias,
  estVotesBias,
  estPartisanBias,
  calcEfficiencyGap,
  invertSVPoints, keyRVpoints, calcDeclination,
  calcGlobalSymmetry, estGeometricSeatsBias, calcDisproportionality, calcMeanMedianDifference, calcLopsidedOutcomes, calcBigR, calcGamma,
  calcMinimalInverseResponsiveness,
  // EXPERIMENTAL
  estLocalAsymmetry, estLocalDisproportionality, estLocalDisproportionalityAlt
} from '../../lib/partisan/bias'

import
{
  estResponsiveness, estResponsiveDistricts,
  estResponsiveDistrictsShare,
  countCompetitiveDistricts,
  estCompetitiveDistricts,
  estCompetitiveDistrictsShare
} from '../../lib/partisan/responsiveness'
import {Utils} from '../all/all';


export function makePartisanScorecard(Vf: number, VfArray: T.VfArray, bLog: boolean = false): T.PartisanScorecard
{
  const shift = T.Shift.Proportional;

  const N: number = VfArray.length;

  const bestS = bestSeats(N, Vf);
  const bestSf = bestSeatShare(bestS, N);

  const fptpS = estFPTPSeats(VfArray);

  const estS = estSeats(VfArray);
  const estSf = estSeatShare(estS, N);

  const deviation = calcDisproportionalityFromBest(estSf, bestSf);  // This is the dis-proportionality

  const unearnedS = estUnearnedSeats(bestS, estS);

  // Calculate additional alternate metrics for reference
  const dSVpoints: T.SVpoint[] = inferSVpoints(Vf, VfArray, shift);
  const rSVpoints: T.SVpoint[] = invertSVPoints(dSVpoints);

  const TOf = calcTurnoutBias(Vf, VfArray);

  const Bs50 = estPartisanBias(dSVpoints as T.SVpoint[], N);
  const Bs50f = Bs50 / N;
  const Bv50f = estVotesBias(dSVpoints as T.SVpoint[], N);
  const rvPoints = keyRVpoints(VfArray);
  const decl = calcDeclination(VfArray);
  const gSym = calcGlobalSymmetry(dSVpoints, rSVpoints, Bs50f as number);

  const EG = calcEfficiencyGap(Vf, estSf);
  const BsGf = estGeometricSeatsBias(Vf, dSVpoints, rSVpoints);
  const prop = calcDisproportionality(Vf, estSf);
  const mMs = calcMeanMedianDifference(VfArray, Vf);
  const mMd = calcMeanMedianDifference(VfArray);
  const LO = calcLopsidedOutcomes(VfArray);

  // Calculate alternate responsiveness metrics for reference
  const bigR = calcBigR(Vf, estSf);
  const littleR = estResponsiveness(Vf, dSVpoints as T.SVpoint[]);
  const MIR = littleR ? calcMinimalInverseResponsiveness(Vf, littleR as number) : undefined;
  const rD = estResponsiveDistricts(VfArray);
  const rDf = estResponsiveDistrictsShare(rD as number, N);

  const gamma = littleR ? calcGamma(Vf, estSf, littleR as number) : undefined;

  const Cn = countCompetitiveDistricts(VfArray);
  // NOTE - Cd by definition uses a *possibly* different (more narrow) probability
  //   distribution than Rd.
  const cD = estCompetitiveDistricts(VfArray);
  const cDf = estCompetitiveDistrictsShare(cD, N);

  // EXPERIMENTAL

  const lSym = estLocalAsymmetry(Vf, dSVpoints, rSVpoints);
  const lProp = estLocalDisproportionality(Vf, dSVpoints);
  const lPropAlt = estLocalDisproportionalityAlt(Vf, bestSf, dSVpoints);

  const biasMeasurements: T.Bias = {
    bestS: bestS,
    bestSf: bestSf,
    estS: estS,
    estSf: estSf,
    deviation: deviation,

    tOf: TOf,
    fptpS: fptpS,

    bS50: Bs50f,
    bV50: Bv50f,
    decl: decl,
    rvPoints: rvPoints,
    gSym: gSym,
    gamma: gamma,

    eG: EG,
    bSV: BsGf,
    prop: prop,
    mMs: mMs,
    mMd: mMd,
    lO: LO
  };

  const impactMeasurements: T.Impact = {
    unearnedS: unearnedS
  };

  const responsivenessMeasurements: T.Responsiveness = {
    cSimple: Cn,
    cD: cD,
    cDf: cDf,
    bigR: bigR,
    littleR: littleR,
    mIR: MIR,
    rD: rD,
    rDf: rDf
  }

  const DWins: T.VfArray = VfArray.filter(x => x > 0.5);
  const RWins: T.VfArray = VfArray.filter(x => x <= 0.5);  // Ties credited to R's
  const averageDVf = (DWins.length > 0) ? U.avgArray(DWins) : undefined;
  const averageRVf = (RWins.length > 0) ? U.avgArray(RWins) : undefined;

  const experimentalMetrics: T.Experimental = {
    lSym: lSym,
    lProp: lProp,
    lPropAlt: lPropAlt
  };

  const s: T.PartisanScorecard = {
    bias: biasMeasurements,
    impact: impactMeasurements,
    responsiveness: responsivenessMeasurements,
    dSVpoints: dSVpoints,
    rSVpoints: rSVpoints,
    averageDVf: averageDVf,
    averageRVf: averageRVf,
    experimental: experimentalMetrics,
    details: {}
  };

  return s;
}

export function calcPartisanMetrics(Vf: number, VfArray: T.VfArray): T.PartisanJSONReady
{
  const s: T.PartisanScorecard = makePartisanScorecard(Vf, VfArray);

  let out: any = Utils.deepCopy(s);

  delete out.impact;
  delete out.details;

  return out as T.PartisanJSONReady;
}