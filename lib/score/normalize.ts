//
// NORMALIZATION UTILITIES
//

import * as S from './settings';

export const enum DecayFn
{
  Gravity     // Decay as the square of distance
}

export class Normalizer
{
  rawNum: number;
  wipNum: number;
  normalizedNum?: number;

  constructor(rawValue: number)
  {
    this.rawNum = rawValue;
    this.wipNum = this.rawNum;
  }

  // *Don't* transform the input.
  identity(): number
  {
    return this.wipNum;
  }
  positive(): number
  {
    this.wipNum = Math.abs(this.wipNum);

    return this.wipNum;
  }
  // Invert a value in the unit range [0.0–1.0] (so that bigger is better).
  invert(): number
  {
    console.assert(((this.wipNum >= 0.0) && (this.wipNum <= 1.0)), "Inverting: " + S.OUT_OF_RANGE_MSG, this.wipNum);

    this.wipNum = 1.0 - this.wipNum;

    return this.wipNum;
  }
  // Constrain the value to be within a specified range.
  clip(begin_range: number, end_range: number): number
  {
    // Handle the ends of the range being given either order
    const min_range = Math.min(begin_range, end_range);
    const max_range = Math.max(begin_range, end_range);

    this.wipNum = Math.max(Math.min(this.wipNum, max_range), min_range);

    return this.wipNum;
  }
  // Recast the value as the delta from a baseline value. NOOP if it is zero.
  // NOTE - Values can be + or -.
  rebase(base: number): number
  {
    this.wipNum = this.wipNum - base;

    return this.wipNum;
  }
  // Re-scale a value into the [0.0 – 1.0] range, using a given range.
  // NOTE - This assumes that values have alrady been clipped into the range.
  unitize(begin_range: number, end_range: number): number
  {
    const min_range = Math.min(begin_range, end_range);
    const max_range = Math.max(begin_range, end_range)

    console.assert(((this.wipNum >= min_range) && (this.wipNum <= max_range)), "Unitizing: " + S.OUT_OF_RANGE_MSG, this.wipNum);

    const ranged = this.wipNum - min_range;
    this.wipNum = Math.abs(ranged / (end_range - begin_range));

    return this.wipNum;
  }
  // Decay a value in the unit range [0.0–1.0] by its distance from zero.
  // NOTE - If the range is already such that "bigger is better," then the closer
  //   the value is to 1.0 (the best) the *less* it will decay.
  decay(fn: DecayFn = DecayFn.Gravity): number
  {
    console.assert(((this.wipNum >= 0.0) && (this.wipNum <= 1.0)), "Decaying: " + S.OUT_OF_RANGE_MSG, this.wipNum);

    switch (fn)
    {
      case DecayFn.Gravity: {
        this.wipNum = Math.pow(this.wipNum, S.DISTANCE_WEIGHT);

        return this.wipNum;
      }
      default: {
        throw new Error("Decay function not recognized.");
      }
    }
  }
  // Translate a value in the unit range to the user-friendly range [0 – 100].
  rescale(): number
  {
    console.assert(((this.wipNum >= 0.0) && (this.wipNum <= 1.0)), "Rescaling: " + S.OUT_OF_RANGE_MSG, this.wipNum);

    this.normalizedNum = Math.round(this.wipNum * S.NORMALIZED_RANGE);

    return this.normalizedNum;
  }
}
