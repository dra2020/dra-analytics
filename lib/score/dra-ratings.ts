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