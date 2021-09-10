//
// COUNTY-DISTRICT SPLITTING -- building on Moon Duchin's work
//

import * as T from '../types/all';
import * as U from '../utils/all';


// TODO - Add a splitting scorecard


// CALCULATE ENHANCED SQRT ENTROPY METRIC

export function doCountySplittingReduced(CxD: T.CxD, districtTotals: number[], countyTotals: number[], bLD: boolean = false): T.Measurement
{
  const rC = reduceCSplits(CxD, districtTotals);
  const f = calcCountyFractions(rC, countyTotals);
  const w = calcCountyWeights(countyTotals);
  // const nD = districtTotals.length;
  // const nC = countyTotals.length;

  const rawSqEnt_DC = countySplitting(f, w);

  const m: T.Measurement = {
    raw: rawSqEnt_DC,
    notes: {}  // None as this time
  };

  return m;
}

export function doCountySplitting(CxD: T.CxD, countyTotals: number[], bLog: boolean = false): number
{
  const f = calcCountyFractions(CxD, countyTotals);
  const w = calcCountyWeights(countyTotals);
  const SqEnt_DC = countySplitting(f, w, bLog);

  return SqEnt_DC;
}

export function doDistrictSplittingReduced(CxD: T.CxD, districtTotals: number[], countyTotals: number[], bLD: boolean = false): T.Measurement
{
  const rD = reduceDSplits(CxD, countyTotals)
  const g = calcDistrictFractions(rD, districtTotals);
  const x = calcDistrictWeights(districtTotals);

  const rawSqEnt_CD = districtSplitting(g, x);

  const m: T.Measurement = {
    raw: rawSqEnt_CD,
    notes: {}  // None as this time
  };

  return m;
}

export function doDistrictSplitting(CxD: T.CxD, districtTotals: number[], bLog: boolean = false): number
{
  const g = calcDistrictFractions(CxD, districtTotals);
  const x = calcDistrictWeights(districtTotals);
  const SqEnt_CD = districtSplitting(g, x, bLog);

  return SqEnt_CD;
}


// HELPERS

export function totalCounties(CxD: T.CxD): number[]
{
  const nC = CxD[0].length;
  const nD = CxD.length;
  let cT: number[] = U.initArray(nC, 0);

  for (let j = 0; j < nC; j++)
  {
    for (let i = 0; i < nD; i++)
    {
      cT[j] += CxD[i][j];
    }
  }

  return cT;
}

export function totalDistricts(CxD: T.CxD): number[]
{
  const nC = CxD[0].length;
  const nD = CxD.length;
  let dT: number[] = U.initArray(nD, 0);

  for (let i = 0; i < nD; i++)
  {
    for (let j = 0; j < nC; j++)
    {
      dT[i] += CxD[i][j];
    }
  }

  return dT;
}

// NOTE - The county-district splits and the county & district totals may all,
//   in general, be fractional/decimal numbers as opposed to integers, due to
//   dissaggregation & re-aggregation. Hence, comparisons need to approximate
//   equality.

// Consolidate *whole districts* (w/in one county) UP into dummy district 0,
//   county by county.
export function reduceCSplits(CxD: T.CxD, districtTotals: number[]): number[][]
{
  // Create the reduced template
  let CxDreducedC: number[][] = U.deepCopy(CxD);
  const nC = CxDreducedC[0].length;
  const vRow: number[] = U.initArray(nC, 0);
  CxDreducedC.unshift(vRow);
  const nD = CxDreducedC.length;

  for (let j = 0; j < nC; j++)
  {
    // Skip the virtual district 0
    for (let i = 1; i < nD; i++)
    {
      let split_total = CxDreducedC[i][j];

      if (split_total > 0)
      {
        if (U.areRoughlyEqual(split_total, districtTotals[i - 1], U.EQUAL_TOLERANCE))
        {
          CxDreducedC[0][j] += split_total;
          CxDreducedC[i][j] = 0;
        }
      }
    }
  }

  return CxDreducedC;
}

// Consolidate *whole counties* (w/in one district) LEFT into the dummy county 0,
//   district by district.
export function reduceDSplits(CxD: T.CxD, countyTotals: number[]): number[][]
{
  // Create the reduced template
  let CxDreducedD: number[][] = U.deepCopy(CxD);
  CxDreducedD.map(row => row.unshift(0));
  const nC = CxDreducedD[0].length;
  const nD = CxDreducedD.length;

  for (let i = 0; i < nD; i++)
  {
    // Skip the virtual county 0
    for (let j = 1; j < nC; j++)
    {
      let split_total = CxDreducedD[i][j];

      if (split_total > 0)
      {
        if (U.areRoughlyEqual(split_total, countyTotals[j - 1], U.EQUAL_TOLERANCE))
        {
          CxDreducedD[i][0] += split_total;
          CxDreducedD[i][j] = 0;
        }
      }
    }
  }

  return CxDreducedD;
}

export function calcCountyWeights(countyTotals: number[]): number[]
{
  let nC: number = countyTotals.length;
  let cTotal: number = U.sumArray(countyTotals);

  let w: number[] = U.initArray(nC, 0.0);

  for (let j = 0; j < nC; j++)
  {
    w[j] = countyTotals[j] / cTotal;
  }

  return w;
}

export function calcDistrictWeights(districtTotals: number[]): number[]
{
  let nD = districtTotals.length;
  let dTotal: number = U.sumArray(districtTotals);

  let x: number[] = U.initArray(nD, 0.0);

  for (let i = 0; i < nD; i++)
  {
    x[i] = districtTotals[i] / dTotal;
  }

  return x;
}

export function calcCountyFractions(CxD: T.CxD, countyTotals: number[]): number[][]
{
  let nD = CxD.length;
  let nC = CxD[0].length;

  let f: number[][] = new Array(nD).fill(0.0).map(() => new Array(nC).fill(0.0));

  for (let j = 0; j < nC; j++)
  {
    for (let i = 0; i < nD; i++)
    {
      if (countyTotals[j] > 0)
      {
        f[i][j] = CxD[i][j] / countyTotals[j];
      }
      else
      {
        f[i][j] = 0.0;
      }
    }
  }

  return f;
}

export function calcDistrictFractions(CxD: T.CxD, districtTotals: number[]): number[][]
{
  let nD = CxD.length;
  let nC = CxD[0].length;

  let g: number[][] = new Array(nD).fill(0.0).map(() => new Array(nC).fill(0.0));

  for (let j = 0; j < nC; j++)
  {
    for (let i = 0; i < nD; i++)
    {
      if (districtTotals[i] > 0)
      {
        g[i][j] = CxD[i][j] / districtTotals[i];
      }
      else
      {
        g[i][j] = 0.0;
      }
    }
  }

  return g;
}

export function splitScore(splits: number[]): number
{
  let e: number;

  if (splits.length > 0)
  {
    e = U.sumArray(splits.map(Math.sqrt))
  }
  else
  {
    e = 1.0;
  }

  return e;
}

// For all districts in a county, sum the split score.
export function countySplitScore(j: number, f: number[][], bLog: boolean = false): number
{
  const numD = f.length;
  let splits: number[] = [];

  for (let i = 0; i < numD; i++)
  {
    splits.push(f[i][j]);
  }

  const score = splitScore(splits);

  return score;
}

// For all counties, sum the weighted county splits.
export function countySplitting(f: number[][], w: number[], bLog: boolean = false): number
{
  const numC = f[0].length;

  let e = 0.0;

  for (let j = 0; j < numC; j++)
  {
    let splitScore = countySplitScore(j, f, bLog);
    e += w[j] * splitScore;

    if (bLog) console.log("County splitting =", j, w[j], splitScore, e);
  }

  return e;
}

// For all counties in a district, sum the split score.
export function districtSplitScore(i: number, g: number[][], bLog: boolean = false): number
{
  const numC = g[0].length;
  let splits: number[] = [];

  for (let j = 0; j < numC; j++)
  {
    splits.push(g[i][j]);
  }

  const score = splitScore(splits);

  return score;
}

// For all districts, sum the weighted district splits.
export function districtSplitting(g: number[][], x: number[], bLog: boolean = false): number
{
  const numD = g.length;

  let e = 0.0;

  for (let i = 0; i < numD; i++)
  {
    let splitScore = districtSplitScore(i, g, bLog);
    e += x[i] * splitScore;

    if (bLog) console.log("District split score =", i, x[i], splitScore, e);
  }

  return e;
}
