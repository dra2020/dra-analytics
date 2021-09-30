//
// COMMAND TO CALCULATE PARTISAN METRICS
//
/* Examples:

$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp
$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp > temp/compactness.json

$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp -k
$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp -k > temp/compactness.json

$ ./cli/compactness.js -i ./testdata/compactness/sample.geojson

*/

import yargs from 'yargs';

import * as T from '../lib/types/all'
import * as FU from '../testutil/fileutils';

import {calcCompactness, calcKIWYSICompactness} from '../lib/compactness/all';


// SPECIFY THE ARGS

let argv = yargs
  .usage('Usage: $0 command [options]')
  .example('$0 ./cli/compactness.js', 'Calculates compactness metrics')
  .option('input', {
    alias: 'i',
    describe: 'A shapefile that defines district shapes',
    type: 'string'
  })
  .option('kiwysi', {
    alias: 'k',
    describe: 'Calculate KIWYSI compactness',
    type: 'boolean',
    default: false
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Specify whether code should log to STDOUT.',
    type: 'boolean',
    default: false
  })
  .demandOption(['input'],
    'Please specify all the args.')
  .help()
  .argv;


// PARSE THE ARGS

let shpPath: string = argv.input;
let bShp = true;                   // Default is .shp; .geojson is an alternative
const ext = shpPath.split('.').pop();
if (ext && (ext == 'geojson')) bShp = false;

const bKIWYSI: boolean = argv.kiwysi;


const doIt = async () =>
{
  if (!bShp) shpPath = FU.fileToPath(shpPath);  // Canonicalize the input

  const shapes: GeoJSON.FeatureCollection = (bShp) ? await FU.readShapefile(shpPath) : FU.readJSON(shpPath) as GeoJSON.FeatureCollection;

  // EXECUTE THE COMMAND
  const output = bKIWYSI ? calcKIWYSICompactness(shapes) : calcCompactness(shapes);

  // OUTPUT THE RESULTS
  console.log(JSON.stringify(output));
}
doIt();  // HACK to enable shapefiles to be read asynchronously
