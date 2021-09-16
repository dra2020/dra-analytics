//
// UTILITIES
//

import * as fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse/lib/sync';
import * as GeoJSON from 'geojson';

import * as T from '../lib/types/all'
// import * as M from '../lib/minority/types'
// import * as G from '../lib/graph/types'
// import * as C from '../lib/types/all'


// HELPERS TO LOAD SAMPLE DATA FROM DISK

// A clone of 'carefulRead' in DRA-CLI
export function readTXTcareful(file: string): any
{
  try
  {
    const s: string = fs.readFileSync(file, 'utf8');
    // let o: any = JSON.parse(s);
    return s;
  }
  catch (err)
  {
    console.log("Error reading text file ...");
    return null;
  }
}

export function readTXT(file: string): any
{
  let fullPath: string;
  if (path.isAbsolute(file))
  {
    fullPath = file;
  }
  else
  {
    fullPath = path.resolve(file);
  }

  return readTXTcareful(fullPath);
}

function parseString(value: string): string
{
  // Remove surrounding single or double quotes
  value = value.replace(/^"(.*)"$/, '$1')
  value = value.replace(/^'(.*)'$/, '$1')

  return value;
}

// Following the clone above, except for CSV, using the csv-parse/sync API
export function readCSV(file: string): any
{
  try
  {
    let input: string = fs.readFileSync(file, 'utf8');
    let dictRows: any = parse(input, {
      columns: true,
      skip_empty_lines: true
    });
    return dictRows;
  }
  catch (err)
  {
    console.log("Error reading CSV file ...");
    return null;
  }
}

// A clone of 'carefulRead' in DRA-CLI
export function readJSONcareful(file: string): any
{
  try
  {
    let s: string = fs.readFileSync(file, 'utf8');
    let o: any = JSON.parse(s);
    return o;
  }
  catch (err)
  {
    console.log("Error reading JSON file ...");
    return null;
  }
}

export function readJSON(file: string): any
{
  let fullPath: string;
  if (path.isAbsolute(file))
  {
    fullPath = file;
  }
  else
  {
    fullPath = path.resolve(file);
  }

  return readJSONcareful(fullPath);
}


// COMPACTNESS-specific helpers

function fileToPath(file: string): string
{
  let fullPath: string;
  if (path.isAbsolute(file))
  {
    fullPath = file;
  }
  else
  {
    fullPath = path.resolve(file);
  }

  return fullPath;
}

export function readFeatureSets(file: string): T.FeaturesEntry[]
{
  let featureEntries: T.FeaturesEntry[] = [];

  const fullPath: string = fileToPath(file);
  const csvArray: any = readCSV(fullPath);

  for (let dictRow of csvArray)
  {
    const featuresEntry: T.FeaturesEntry = {
      n: Number(dictRow['n']),
      features: {
        sym_x: Number(dictRow['sym_x']),
        sym_y: Number(dictRow['sym_y']),
        reock: Number(dictRow['reock']),
        bbox: Number(dictRow['bbox']),
        polsby: Number(dictRow['polsby']),
        hull: Number(dictRow['hull']),
        schwartzberg: Number(dictRow['schwartzberg']),
        reockFlat: 0,  // Hack to make samples on file work w/ new 'flat' Reock & Polsby–Popper
        polsbyFlat: 0  // Ditto
      },
      score: Number(dictRow['score'])
    };

    featureEntries.push(featuresEntry);
  }

  return featureEntries;
}

// Read sample shapes

var shp = require('shapefile');
// https://www.npmjs.com/package/shapefile
// https://digital-geography.com/gis-with-javascript-tutorial-part-1/

export function readShapefile(file: string): Promise<GeoJSON.FeatureCollection>
{
  const fullPath: string = fileToPath(file);
  const buf = fs.readFileSync(fullPath);

  return shp.read(buf).catch((err: any) => console.error(err.stack));
}


// GRAPH-specific helper For exercising GRAPH functionality at the CLI

export function readPlanCSV(file: string): T.PlanByGeoID
{
  var plan = {} as T.PlanByGeoID;

  let fullPath: string;
  if (path.isAbsolute(file))
  {
    fullPath = file;
  }
  else
  {
    fullPath = path.resolve(file);
  }

  var csvArray: any = readCSV(fullPath);

  for (let dictRow of csvArray)
  {
    let geoID: string = dictRow['GEOID'];
    let districtID: number = Number(dictRow['DISTRICT']);

    plan[geoID] = districtID;
  }

  return plan;
}


// RPV-specific helper

export function readDemographicCSV(file: string, groups: T.MinorityFilter): T.DemographicVotingByFeature /* | undefined */
{
  let fullPath: string;
  if (path.isAbsolute(file))
  {
    fullPath = file;
  }
  else
  {
    fullPath = path.resolve(file);
  }

  let csvArray: any = readCSV(fullPath);

  // 12-29-2020
  // if (csvArray.length == 0) return undefined;
  // Convert the non-empty CSV to dictPoints by demographic

  let ids: string[] = [];
  let whitePts: T.dictPoint[] = [];
  let minorityPts: T.dictPoint[] = [];
  let blackPts: T.dictPoint[] = [];
  let hispanicPts: T.dictPoint[] = [];
  let pacificPts: T.dictPoint[] = [];
  let asianPts: T.dictPoint[] = [];
  let nativePts: T.dictPoint[] = [];

  let i = 0;
  for (let dictRow of csvArray)
  {
    i += 1;
    let id: string = "Feature-" + i;
    let w: number = Number(dictRow['White']);
    let m: number = Number(dictRow['Minority']);
    let b: number = Number(dictRow['Black']);
    let h: number = Number(dictRow['Hispanic']);
    let p: number = Number(dictRow['Pacific']);
    let a: number = Number(dictRow['Asian']);
    let n: number = Number(dictRow['Native']);
    let d: number = Number(dictRow['Democratic']);

    ids.push(id);
    whitePts.push({x: w, y: d});
    if (groups.minority) minorityPts.push({x: m, y: d});
    if (groups.black) blackPts.push({x: b, y: d});
    if (groups.hispanic) hispanicPts.push({x: h, y: d});
    if (groups.pacific) pacificPts.push({x: p, y: d});
    if (groups.asian) asianPts.push({x: a, y: d});
    if (groups.native) nativePts.push({x: n, y: d});
  }

  const vbf: T.DemographicVotingByFeature = {
    ids: ids,
    comparison: whitePts,
    minority: groups.minority ? minorityPts : [],
    black: groups.black ? blackPts : [],
    hispanic: groups.hispanic ? hispanicPts : [],
    pacific: groups.pacific ? pacificPts : [],
    asian: groups.asian ? asianPts : [],
    native: groups.native ? nativePts : []
  }

  return vbf;
}
