//
// UTILITIES
//

import * as fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse/lib/sync';

import * as T from '../lib/minority/types'


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


// RPV specific

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
  // Convert the non-empty CSV to points by demographic

  let ids: string[] = [];
  let whitePts: T.Point[] = [];
  let minorityPts: T.Point[] = [];
  let blackPts: T.Point[] = [];
  let hispanicPts: T.Point[] = [];
  let pacificPts: T.Point[] = [];
  let asianPts: T.Point[] = [];
  let nativePts: T.Point[] = [];

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
