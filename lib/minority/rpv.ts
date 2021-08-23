//
// RACIALLY POLARIZED VOTING
//

import * as T from './types'


// Analyze the degree of racially polarized voting for a district
export function analyzeRacialVoting(points: T.DemographicVotingByFeature /* | undefined */, districtID: number, groups: T.MinorityFilter): T.RPVAnalysis | undefined
{
  // 12-29-2020 - Moved these guards up into district-analytics
  // Make sure the district is not empty, there are enough points, & that a minority is specified.
  // if (points === undefined) return undefined;
  // if (points.comparison === undefined) return undefined;
  // if (points.comparison.length <= 10) return undefined;
  // if (!(groups.black || groups.hispanic || groups.pacific || groups.asian || groups.native || groups.minority)) return undefined;

  // NOTE - If (groups.invertSelection == true), the comparison points are everything 
  //   except the selected minority, i.e., 1 – <selected minority>.

  const result: T.RPVAnalysis = {
    ids: points.ids,
    comparison: characterizeDemographicVoting(points.comparison),
    hispanic: groups.hispanic ? characterizeDemographicVoting(points.hispanic) : undefined,
    black: groups.black ? characterizeDemographicVoting(points.black) : undefined,
    pacific: groups.pacific ? characterizeDemographicVoting(points.pacific) : undefined,
    asian: groups.asian ? characterizeDemographicVoting(points.asian) : undefined,
    native: groups.native ? characterizeDemographicVoting(points.native) : undefined,
    minority: groups.minority ? characterizeDemographicVoting(points.minority) : undefined
  }

  return result;
}

// https://trentrichardson.com/compute-linear-regressions-in-javascript.html
// https://www2.isye.gatech.edu/~yxie77/isye2028/lecture12.pdf
function linearRegression(points: T.Point[]): T.LinearRegression
{
  // First pass - fit the line

  const n: number = points.length;

  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let sum_yy = 0;

  for (let i = 0; i < n; i++) 
  {
    const pt = points[i];

    sum_x += pt.x;
    sum_y += pt.y;
    sum_xy += (pt.x * pt.y);
    sum_xx += (pt.x * pt.x);
    sum_yy += (pt.y * pt.y);
  }

  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  const intercept = (sum_y - slope * sum_x) / n;
  const r2 = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

  const xBar = sum_x / n;
  const yBar = sum_y / n;

  // Second pass - compute the standard errors

  let Sxx: number = 0;              // Sum of squared deviations from the mean x
  let Syy: number = 0;              // Sum of squared deviations of the residuals

  for (let i = 0; i < n; i++) 
  {
    const pt = points[i];

    Sxx += Math.pow(pt.x - xBar, 2);
    Syy += Math.pow(pt.y - yOnLine(pt.x, slope, intercept), 2);
  }

  const mse = Syy / (n - 2);

  const stErrs: any = {
    slope: Math.sqrt(mse / Sxx),
    intercept: Math.sqrt(mse * ((1 / n) + (Math.pow(xBar, 2) / Sxx))),
    regression: Math.sqrt(Syy / n)
  }

  // Combine the results

  const lr: T.LinearRegression = {
    slope: slope,
    intercept: intercept,
    r2: r2,
    sterrs: stErrs
  }

  return lr;
}

function characterizeDemographicVoting(points: T.Point[]): T.RPVFactor
{
  const lr: T.LinearRegression = linearRegression(points);
  const lrPrime: T.LinearRegression = linearRegression(points.map(invertX));

  const result: T.RPVFactor = {
    slope: lr.slope,
    intercept: lr.intercept,
    r2: lr.r2,
    demPct: lrPrime.intercept,
    sterr: lrPrime.sterrs.intercept,
    points: points
  }

  return result;
}

// For interpolating points on a line
const yOnLine = (x: number, m: number, b: number): number => {return (m * x) + b;}
const xOnLine = (y: number, m: number, b: number): number => {return (y - b) / m;}

const invertX = (pt: T.Point): T.Point => {return {x: 1 - pt.x, y: pt.y}};
