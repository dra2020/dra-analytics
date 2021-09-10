//
// MINORITY REPRESENTATION
//

import * as T from '../types/minority'
import * as U from '../utils/all';
import * as C from '../rate/dra-config';

import {Normalizer} from '../rate/normalize';
import {estSeatProbability} from '../partisan/method';


// MINORITY SCORECARD

// evalMinorityOpportunity: Pivot the by-district profile into a 2D array:
// * Demographic dimension
// * VAP % bucket dimension + statewide VAP % and proportional seats
// Then convert the 2D array back into a static structure.

const enum Demographic
{
  Minority,                            // 'Minority'
  Black,                               // 'Black'
  Hispanic,                            // 'Hispanic'
  Pacific,                             // 'Pacific'
  Asian,                               // 'Asian'
  Native                               // 'Native'
}

// See bucketVAPPct() for the 6 VAP % buckets.
const enum PivotField
{
  L35_40,
  L40_45,
  L45_50,
  L50_55,
  L55_60,
  L60Plus,
  VAPPct,    // Statewide VAP %
  PropSeats  // Proportional # of seats for VAP %
}

const MINORITY = 1 - 1;                // Demographic dimension offset
const PROPSEATS = 8 - 1;               // Pivot dimension offset

export function evalMinorityOpportunity(statewideDemos: T.Demographics, demosByDistrict: T.Demographics[], bLog: boolean = false): T.MinorityScorecard
{
  const nDemos = 6;          // Profile includes 'White'
  const offset: number = 1;  // But don't process 'White'
  const nDistricts = demosByDistrict.length;

  // Initialize the demographic buckets
  // Get the statewide minority VAP/CVAP % (ignore 'White')
  const vapPctArray = Object.values(statewideDemos).slice(1);

  // Determine proportional minority districts by demographic (ignoring'White')
  const districtsByDemo: number[] = calcDistrictsByDemo(vapPctArray, nDistricts);

  let bucketsByDemo = new Array(nDemos);
  let totalProportional: number = 0;

  for (let j = 0; j < nDemos; j++)
  {
    const vapPct = vapPctArray[j];
    const prop = districtsByDemo[j];

    bucketsByDemo[j] = [0, 0, 0, 0, 0, 0, vapPct, prop];

    // Sum the prop for each individual race/ethnicity demographic
    if (j > 0)
      totalProportional += prop;
  }

  let opptyByDemo = U.initArray(nDemos, 0.0);   // State-level values

  // For each district
  for (let i = 0; i < nDistricts; i++)
  {
    const districtDemos = Object.values(demosByDistrict[i]);

    // Find the opportunities for minority representation
    for (let j = 0; j < nDemos; j++)
    {
      const Mf = districtDemos[j + offset];  // Skip the 'White' entries

      const bucket: number = bucketVAPPct(Mf);
      if (bucket > 0)
      {
        // Bucket opportunity districts for each demographic
        bucketsByDemo[j][bucket - 1] += 1;  // Zero-based array

        // Accumulate seat probabilities
        opptyByDemo[j] += estMinorityOpportunity(Mf, j);
      }
    }
  }

  const table: T.DemographicPivot = convertArrayToTable(bucketsByDemo);

  // The # of opportunity districts for each separate demographic and all minorities
  const oD: number = U.sumArray(opptyByDemo.slice(1));     // Sum individual demos, skipping all minorities
  const cD: number = opptyByDemo[MINORITY];  // All minorities

  // The # of proportional districts for each separate demographic and all minorities
  const pOd: number = totalProportional;
  const pCd: number = bucketsByDemo[MINORITY][PROPSEATS];

  let s: T.MinorityScorecard = {
    pivotByDemographic: table,
    opportunityDistricts: oD,
    proportionalOpportunities: pOd,
    coalitionDistricts: cD,
    proportionalCoalitions: pCd,
    details: {},             // None
    // rating?: 
  }

  return s;
}


// HELPERS

// Convert the 2D working array to a fixed table, so the rows & columns can be
// addressed logically by name as opposed to using array indices.
function convertArrayToTable(a: number[][]): T.DemographicPivot
{
  const minority: T.DemoBreakdown = {
    pct35_40: a[Demographic.Minority][PivotField.L35_40],
    pct40_45: a[Demographic.Minority][PivotField.L40_45],
    pct45_50: a[Demographic.Minority][PivotField.L45_50],
    pct50_55: a[Demographic.Minority][PivotField.L50_55],
    pct55_60: a[Demographic.Minority][PivotField.L55_60],
    pct60Plus: a[Demographic.Minority][PivotField.L60Plus],
    vapPct: a[Demographic.Minority][PivotField.VAPPct],
    propSeats: a[Demographic.Minority][PivotField.PropSeats]
  }
  const black: T.DemoBreakdown = {
    pct35_40: a[Demographic.Black][PivotField.L35_40],
    pct40_45: a[Demographic.Black][PivotField.L40_45],
    pct45_50: a[Demographic.Black][PivotField.L45_50],
    pct50_55: a[Demographic.Black][PivotField.L50_55],
    pct55_60: a[Demographic.Black][PivotField.L55_60],
    pct60Plus: a[Demographic.Black][PivotField.L60Plus],
    vapPct: a[Demographic.Black][PivotField.VAPPct],
    propSeats: a[Demographic.Black][PivotField.PropSeats]
  }
  const hispanic: T.DemoBreakdown = {
    pct35_40: a[Demographic.Hispanic][PivotField.L35_40],
    pct40_45: a[Demographic.Hispanic][PivotField.L40_45],
    pct45_50: a[Demographic.Hispanic][PivotField.L45_50],
    pct50_55: a[Demographic.Hispanic][PivotField.L50_55],
    pct55_60: a[Demographic.Hispanic][PivotField.L55_60],
    pct60Plus: a[Demographic.Hispanic][PivotField.L60Plus],
    vapPct: a[Demographic.Hispanic][PivotField.VAPPct],
    propSeats: a[Demographic.Hispanic][PivotField.PropSeats]
  }
  const pacific: T.DemoBreakdown = {
    pct35_40: a[Demographic.Pacific][PivotField.L35_40],
    pct40_45: a[Demographic.Pacific][PivotField.L40_45],
    pct45_50: a[Demographic.Pacific][PivotField.L45_50],
    pct50_55: a[Demographic.Pacific][PivotField.L50_55],
    pct55_60: a[Demographic.Pacific][PivotField.L55_60],
    pct60Plus: a[Demographic.Pacific][PivotField.L60Plus],
    vapPct: a[Demographic.Pacific][PivotField.VAPPct],
    propSeats: a[Demographic.Pacific][PivotField.PropSeats]
  }
  const asian: T.DemoBreakdown = {
    pct35_40: a[Demographic.Asian][PivotField.L35_40],
    pct40_45: a[Demographic.Asian][PivotField.L40_45],
    pct45_50: a[Demographic.Asian][PivotField.L45_50],
    pct50_55: a[Demographic.Asian][PivotField.L50_55],
    pct55_60: a[Demographic.Asian][PivotField.L55_60],
    pct60Plus: a[Demographic.Asian][PivotField.L60Plus],
    vapPct: a[Demographic.Asian][PivotField.VAPPct],
    propSeats: a[Demographic.Asian][PivotField.PropSeats]
  }
  const native: T.DemoBreakdown = {
    pct35_40: a[Demographic.Native][PivotField.L35_40],
    pct40_45: a[Demographic.Native][PivotField.L40_45],
    pct45_50: a[Demographic.Native][PivotField.L45_50],
    pct50_55: a[Demographic.Native][PivotField.L50_55],
    pct55_60: a[Demographic.Native][PivotField.L55_60],
    pct60Plus: a[Demographic.Native][PivotField.L60Plus],
    vapPct: a[Demographic.Native][PivotField.VAPPct],
    propSeats: a[Demographic.Native][PivotField.PropSeats]
  }

  const t: T.DemographicPivot = {
    minority: minority,
    black: black,
    hispanic: hispanic,
    pacific: pacific,
    asian: asian,
    native: native
  };

  return t;
}

// Convert the fixed table back to a 2D array, so test results can get compared generically.
export function convertTableToArray(t: T.DemographicPivot): number[][]
{
  const minority: number[] = [
    t.minority.pct35_40,
    t.minority.pct40_45,
    t.minority.pct45_50,
    t.minority.pct50_55,
    t.minority.pct55_60,
    t.minority.pct60Plus,
    t.minority.vapPct,
    t.minority.propSeats
  ];
  const black: number[] = [
    t.black.pct35_40,
    t.black.pct40_45,
    t.black.pct45_50,
    t.black.pct50_55,
    t.black.pct55_60,
    t.black.pct60Plus,
    t.black.vapPct,
    t.black.propSeats
  ];
  const hispanic: number[] = [
    t.hispanic.pct35_40,
    t.hispanic.pct40_45,
    t.hispanic.pct45_50,
    t.hispanic.pct50_55,
    t.hispanic.pct55_60,
    t.hispanic.pct60Plus,
    t.hispanic.vapPct,
    t.hispanic.propSeats
  ];
  const pacific: number[] = [
    t.pacific.pct35_40,
    t.pacific.pct40_45,
    t.pacific.pct45_50,
    t.pacific.pct50_55,
    t.pacific.pct55_60,
    t.pacific.pct60Plus,
    t.pacific.vapPct,
    t.pacific.propSeats
  ];
  const asian: number[] = [
    t.asian.pct35_40,
    t.asian.pct40_45,
    t.asian.pct45_50,
    t.asian.pct50_55,
    t.asian.pct55_60,
    t.asian.pct60Plus,
    t.asian.vapPct,
    t.asian.propSeats
  ];
  const native: number[] = [
    t.native.pct35_40,
    t.native.pct40_45,
    t.native.pct45_50,
    t.native.pct50_55,
    t.native.pct55_60,
    t.native.pct60Plus,
    t.native.vapPct,
    t.native.propSeats
  ];

  const a: number[][] = [minority, black, hispanic, pacific, asian, native];

  return a;
}

export function calcDistrictsByDemo(MfArray: number[], N: number): number[]
{
  const districtsByDemo = MfArray.map(v => calcProportionalDistricts(v, N));

  return districtsByDemo;
}

// NOTE - Shift minority proportions up, so 37% minority scores like 52% share,
//   but use the uncompressed seat probability distribution. This makes a 37% 
//   district have a ~70% chance of winning, and a 50% district have a >99% chance.
//   Below 37 % has no chance.
// NOTE - Sam Wang suggest 90% probability for a 37% district. That seems a little
//   too abrupt and all or nothing, so I backed off to the ~70%.
//
export function estMinorityOpportunity(Mf: number, demo?: Demographic): number
{
  // NOTE - Switch to compress the probability distribution
  const bCompress = false;
  const dist = bCompress ? C.minorityOpportunityDistribution() : [0.0, 1.0];
  const range = C.minorityOpportunityRange();

  const _normalizer = new Normalizer(Mf);

  let shift = C.minorityShift();         // For Black VAP % (and Minority)
  if (demo && (demo > 1))                // For other non-Black demos,
    shift *= C.minorityShiftDilution();  //   dilute the Black shift (by half)

  _normalizer.wipNum += shift;

  _normalizer.clip(dist[C.BEG], dist[C.END]);
  _normalizer.unitize(dist[C.BEG], dist[C.END]);

  const oppty = (Mf < range[C.BEG]) ? 0.0 : Math.min(estSeatProbability(_normalizer.wipNum, dist), 1.0);

  return oppty;
}


// HELPERS

function bucketVAPPct(Mf: number): number
{
  if (Mf < 0.35)
    return 0;
  else if ((Mf >= 0.35) && (Mf < 0.40))
    return 1;
  else if ((Mf >= 0.40) && (Mf < 0.45))
    return 2;
  else if ((Mf >= 0.45) && (Mf < 0.50))
    return 3;
  else if ((Mf >= 0.50) && (Mf < 0.55))
    return 4;
  else if ((Mf >= 0.55) && (Mf < 0.60))
    return 5;
  else // Mf >= 0.60
    return 6;
}

export function calcProportionalDistricts(proportion: number, nDistricts: number): number
{
  const roundUp = 0.0;
  const fractional = proportion * nDistricts;
  const integral = Math.round(fractional + roundUp);

  return integral;
}

/* Sources for majority-minority info:
 - https://en.wikipedia.org/wiki/List_of_majority-minority_United_States_congressional_districts
 - http://www.ncsl.org/Portals/1/Documents/Redistricting/Redistricting_2010.pdf
*/
