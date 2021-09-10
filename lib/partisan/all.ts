export * from './erf';
export * from './method';
export * from './bias';
export * from './responsiveness';


// COMBINE EVERYTHING INTO A PARTISAN "SCORECARD"

import * as T from '../../lib/types/all'
import * as U from '../utils/all';
import * as C from '../../lib/rate/dra-config';

import
{
  estSeatProbability,
  estSeats,
  estDistrictResponsiveness,
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
  estSeatBias, estVotesBias,
  estPartisanBias,
  calcEfficiencyGap,
  invertSVPoints, isASweep, radiansToDegrees, keyRVpoints, calcDeclination,
  calcGlobalSymmetry, estGeometricSeatsBias, calcDisproportionality, estMeanMedianDifference, calcLopsidedOutcomes, calcBigR, calcGamma,
  calcMinimalInverseResponsiveness
} from '../../lib/partisan/bias'

import
{
  estResponsiveness, estResponsiveDistricts,
  estResponsiveDistrictsShare,   // NOTE - Just a division; no tests
  countCompetitiveDistricts,
  estDistrictCompetitiveness,
  estCompetitiveDistricts,       // NOTE - Just a sum over a tested fn; no tests
  estCompetitiveDistrictsShare,  // NOTE - Just a division; no tests
  estMarginalCompetitiveShare    // NOTE - Tested indirectly via the hypothetical & sample state profiles
} from '../../lib/partisan/responsiveness'


export function makePartisanScorecard(Vf: number, VfArray: T.VfArray): T.PartisanScorecard
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
  const mMs = estMeanMedianDifference(VfArray, Vf);
  const mMd = estMeanMedianDifference(VfArray);
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

  const s: T.PartisanScorecard = {
    bias: biasMeasurements,
    impact: impactMeasurements,
    responsiveness: responsivenessMeasurements,
    dSVpoints: dSVpoints,
    rSVpoints: rSVpoints,
    averageDVf: averageDVf,
    averageRVf: averageRVf,
    details: {}
  };

  return s;
}