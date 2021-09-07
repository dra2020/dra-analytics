//
// DRA-SPECIFIC RATINGS ("SCORES")
//

import * as C from './dra-config';
import * as N from './normalize';
import * as T from '../types/all'


// POPULATION DEVIATION

export function scorePopulationDeviation(rawValue: number, bLegislative: boolean): number
{
  const _normalizer = new N.Normalizer(rawValue);

  // Raw range in not inverted (i.e., smaller is better)
  const range = C.popdevRange(bLegislative);

  _normalizer.clip(0.0, 1.0);  // Handle deviations bigger than a whole district
  _normalizer.invert();
  _normalizer.clip(1.0 - range[C.BEG], 1.0 - range[C.END]);
  _normalizer.unitize(1.0 - range[C.BEG], 1.0 - range[C.END]);
  _normalizer.rescale();

  return _normalizer.normalizedNum as number;
}


// PROPORTIONALITY

export function scoreProportionality(deviation: number, Vf: number, Sf: number): number
{
  if (isAntimajoritarian(Vf, Sf))
  {
    return 0;
  }
  else
  {
    // Adjust bias to incorporate an acceptable winner's bonus based on Vf
    const extra = extraBonus(Vf);
    const adjusted = adjustDeviation(Vf, deviation, extra);

    // Then normalize
    const _normalizer = new N.Normalizer(adjusted);

    const worst = C.biasRange()[C.BEG];
    const best = C.biasRange()[C.END];

    _normalizer.positive();
    _normalizer.clip(worst, best);
    _normalizer.unitize(worst, best);
    _normalizer.invert();
    _normalizer.rescale();

    const score = _normalizer.normalizedNum as number;

    return score;
  }
}

export function extraBonus(Vf: number): number
{
  const over50Pct = (Vf > 0.5) ? (Vf - 0.5) : (0.5 - Vf);
  const okExtra: number = over50Pct * (C.winnerBonus() - 1.0);

  return okExtra;  // No longer trimming the result here
}

// Adjust deviation from proportionality to account for a winner's bonus
// * If the bias is in the *same* direction as the statewide vote %, then
//   discount the bias by the winner's bonus (extra).
// * But if the bias and statewide vote % go in opposite directions, leave the
//   bias unadjusted.
export function adjustDeviation(Vf: number, deviation: number, extra: number): number
{
  let adjusted: number = deviation;

  if ((Vf > 0.5) && (deviation < 0))
  {
    adjusted = Math.min(deviation + extra, 0);
  }
  else if ((Vf < 0.5) && (deviation > 0))
  {
    adjusted = Math.max(deviation - extra, 0);
  }

  return adjusted;
}

const avgSVError = 0.02;
export function isAntimajoritarian(Vf: number, Sf: number): boolean
{
  const bDem = ((Vf < (0.5 - avgSVError)) && (Sf > 0.5)) ? true : false;
  const bRep = (((1 - Vf) < (0.5 - avgSVError)) && ((1 - Sf) > 0.5)) ? true : false;

  return bDem || bRep;
}

// DEPRECATED -- "Impact" == unearned seats
/* 
export function scoreImpact(rawUE: number, Vf: number, Sf: number, N: number): number
{
  if (isAntimajoritarian(Vf, Sf))
  {
    return 0;
  }
  else
  {
    // Adjust impact to incorporate an acceptable winner's bonus based on Vf
    const extra = extraBonus(Vf);
    const adjustedBias = adjustDeviation(Vf, rawUE / N, extra);
    const adjustedImpact = adjustedBias * N;

    // Then normalize
    const _normalizer = new Normalizer(adjustedImpact);

    const worst = C.unearnedThreshold();
    const best = 0.0;

    _normalizer.positive();
    _normalizer.clip(worst, best);
    _normalizer.unitize(worst, best);
    _normalizer.invert();
    _normalizer.rescale();

    const score = _normalizer.normalizedNum as number;

    return score;
  }
}
*/

// Partisan Bias


// COMPETITIVENESS


// MINORITY REPRESENTATION


// RATE COMPACTNESS

export function scoreReock(rawValue: number): number
{
  const _normalizer = new N.Normalizer(rawValue);

  const worst = C.reockRange()[C.BEG];
  const best = C.reockRange()[C.END];

  _normalizer.clip(worst, best);
  _normalizer.unitize(worst, best);
  _normalizer.rescale();

  return _normalizer.normalizedNum as number;
}

export function scorePolsbyPopper(rawValue: number): number
{
  const _normalizer = new N.Normalizer(rawValue);

  const worst = C.polsbyRange()[C.BEG];
  const best = C.polsbyRange()[C.END];

  _normalizer.clip(worst, best);
  _normalizer.unitize(worst, best);
  _normalizer.rescale();

  return _normalizer.normalizedNum as number;
}

export function scoreCompactness(rS: number, ppS: number): number
{
  const rW = C.reockWeight();
  const ppW = C.polsbyWeight();

  const score = Math.round(((rS * rW) + (ppS * ppW)) / (rW + ppW));

  return score;
}


// SPLITTING

export function scoreCountySplitting(rawValue: number, nCounties: number, nDistricts: number, bLD: boolean = false): number
{
  const _normalizer = new N.Normalizer(rawValue);

  // The practical ideal score depends on the # of counties & districts
  const avgBest = countySplitBest(nCounties, nDistricts, bLD);
  const avgWorst = countySplitWorst(avgBest, bLD);

  _normalizer.clip(avgBest, avgWorst);
  _normalizer.unitize(avgBest, avgWorst);
  _normalizer.invert();
  _normalizer.rescale();

  return _normalizer.normalizedNum as number;
}

export function countySplitBest(nCounties: number, nDistricts: number, bLD: boolean = false): number
{
  const districtType = (bLD) ? T.DistrictType.StateLegislative : T.DistrictType.Congressional;

  const practicalBest = C.countySplittingRange(districtType)[C.BEG];
  const nAllowableSplits = Math.min(nDistricts - 1, nCounties);
  const threshold = ((nAllowableSplits * practicalBest) + ((nCounties - nAllowableSplits) * 1.0)) / nCounties;

  return threshold;
}
export function countySplitWorst(avgBest: number, bLD: boolean = false): number
{
  const districtType = (bLD) ? T.DistrictType.StateLegislative : T.DistrictType.Congressional;


  const singleBest = C.countySplittingRange(districtType)[C.BEG];
  const singleWorst = C.countySplittingRange(districtType)[C.END];

  // The practical ideal score depends on the # of counties & districts
  const avgWorst = avgBest * (singleWorst / singleBest);

  return avgWorst;
}

export function scoreDistrictSplitting(rawValue: number, bLD: boolean = false): number
{
  const districtType = (bLD) ? T.DistrictType.StateLegislative : T.DistrictType.Congressional;

  const _normalizer = new N.Normalizer(rawValue);

  const best = C.districtSplittingRange(districtType)[C.BEG];
  const worst = C.districtSplittingRange(districtType)[C.END];

  _normalizer.clip(best, worst);
  _normalizer.unitize(best, worst);
  _normalizer.invert();
  _normalizer.rescale();

  return _normalizer.normalizedNum as number;
}

export function scoreSplitting(csS: number, dsS: number): number
{
  const csW = C.countySplittingWeight();
  const dsW = C.districtSplittingWeight();

  const score = Math.round(((csS * csW) + (dsS * dsW)) / (csW + dsW));

  return score;
}