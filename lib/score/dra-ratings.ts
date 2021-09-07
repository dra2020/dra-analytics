//
// DRA-SPECIFIC RATINGS ("SCORES")
//

import * as C from './dra-config';
import * as N from './normalize';


// POPULATION DEVIATION


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

export function weightCompactness(rS: number, ppS: number): number
{
  const rW = C.reockWeight();
  const ppW = C.polsbyWeight();

  const score = Math.round(((rS * rW) + (ppS * ppW)) / (rW + ppW));

  return score;
}


// SPLITTING

export function weightSplitting(csS: number, dsS: number): number
{
  const csW = C.countySplittingWeight();
  const dsW = C.districtSplittingWeight();

  const score = Math.round(((csS * csW) + (dsS * dsW)) / (csW + dsW));

  return score;
}