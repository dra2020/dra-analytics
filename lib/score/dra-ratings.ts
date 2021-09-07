//
// DRA-SPECIFIC RATINGS ("SCORES")
//

import * as C from './dra-config';
import * as N from './normalize';
import * as T from '../types/all'


// RATE POPULATION DEVIATION

export function scorePopulationDeviation(rawDeviation: number, bLegislative: boolean): number
{
  const _normalizer = new N.Normalizer(rawDeviation);

  // Raw range in not inverted (i.e., smaller is better)
  const range = C.popdevRange(bLegislative);

  _normalizer.clip(0.0, 1.0);  // Handle deviations bigger than a whole district
  _normalizer.invert();
  _normalizer.clip(1.0 - range[C.BEG], 1.0 - range[C.END]);
  _normalizer.unitize(1.0 - range[C.BEG], 1.0 - range[C.END]);
  _normalizer.rescale();

  return _normalizer.normalizedNum as number;
}


// RATE PROPORTIONALITY

export function scoreProportionality(rawDisproportionality: number, Vf: number, Sf: number): number
{
  if (isAntimajoritarian(Vf, Sf))
  {
    return 0;
  }
  else
  {
    // Adjust bias to incorporate an acceptable winner's bonus based on Vf
    const extra = extraBonus(Vf);
    const adjusted = adjustDeviation(Vf, rawDisproportionality, extra);

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
export function adjustDeviation(Vf: number, disproportionality: number, extra: number): number
{
  let adjusted: number = disproportionality;

  if ((Vf > 0.5) && (disproportionality < 0))
  {
    adjusted = Math.min(disproportionality + extra, 0);
  }
  else if ((Vf < 0.5) && (disproportionality > 0))
  {
    adjusted = Math.max(disproportionality - extra, 0);
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


// RATE Impact == "unearned seats" <<< DEPRECATED
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


// RATE Partisan Bias -- an ancillary rating

export function scorePartisanBias(rawSeatsBias: number, rawVotesBias: number): number
{
  // NOTE - John Nagle specified this thresholds
  const seatsBiasRating = normalizePartisanBias(rawSeatsBias, 0.06);
  const votesBiasRating = normalizePartisanBias(rawVotesBias, 0.02);

  const partisanBiasRating = Math.round((seatsBiasRating + votesBiasRating) / 2);

  return partisanBiasRating;
}

// NOTE - John Nagle specified this function vs. simple linear normalization
function normalizePartisanBias(biasPct: number, pctAt50: number): number 
{
  const b: number = pctAt50 / Math.log(1 / 2);
  const rating: number = 100 * Math.exp(-Math.abs(biasPct / b));

  return Math.round(rating);
}


// RATE COMPETITIVENESS

// Normalize overall competitiveness - Raw values are in the range [0.0–1.0]. 
// But the practical max is more like 3/4's, so unitize that range to [0.0–1.0].
// Then scale the values to [0–100].
export function scoreCompetitiveness(rawCdf: number): number
{
  const _normalizer = new N.Normalizer(rawCdf);

  let worst = C.overallCompetitivenessRange()[C.BEG];
  let best = C.overallCompetitivenessRange()[C.END];

  _normalizer.clip(worst, best);
  _normalizer.unitize(worst, best);
  _normalizer.rescale();

  const score = _normalizer.normalizedNum as number;

  return score;
}


// RATE MINORITY REPRESENTATION

// NOTE - The probable # of opportunity & coalition districts can be *larger* than
//   what would be a proportional # based on the statewide percentage, because of
//   how minority opportunities are estimated (so that 37% minority shares score
//   like 52% share).
export function scoreMinority(rawOd: number, pOd: number, rawCd: number, pCd: number): number
{
  // Score minority opportunity [0–100]
  const cDWeight = C.coalitionDistrictWeight();

  // Cap opportunity & coalition districts
  const oDCapped = Math.min(rawOd, pOd);
  const cdCapped = Math.min(rawCd, pCd);

  const opportunityScore = (pOd > 0) ? Math.round((oDCapped / pOd) * 100) : 0;
  const coalitionScore = (pCd > 0) ? Math.round((cdCapped / pCd) * 100) : 0;

  const score = Math.round(Math.min(opportunityScore + cDWeight * Math.max(coalitionScore - opportunityScore, 0), 100));

  return score;
}


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

export function scoreCompactnessInternal(rS: number, ppS: number): number
{
  const rW = C.reockWeight();
  const ppW = C.polsbyWeight();

  const score = Math.round(((rS * rW) + (ppS * ppW)) / (rW + ppW));

  return score;
}

export function scoreCompactness(rawReock: number, rawPolsbyPopper: number): number
{
  return scoreCompactnessInternal(rawReock, rawPolsbyPopper);
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

export function scoreSplittingInternal(csS: number, dsS: number): number
{
  const csW = C.countySplittingWeight();
  const dsW = C.districtSplittingWeight();

  const score = Math.round(((csS * csW) + (dsS * dsW)) / (csW + dsW));

  return score;
}

export function scoreSplitting(rawCountySplitting: number, rawDistrictSplitting: number): number
{
  return scoreSplittingInternal(rawCountySplitting, rawDistrictSplitting);
}