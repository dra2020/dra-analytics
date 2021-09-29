//
// COMMAND TO CALCULATE PARTISAN METRICS
//
/* Examples:

$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp
$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp -j > results.json

$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp -k

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
  .option('json', {
    alias: 'j',
    describe: 'Generate stringified JSON output',
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

// TODO - Explore .geojson option
const doit = async () =>
{
  // PARSE THE ARGS

  const shpPath: string = argv.input;
  const shapes: GeoJSON.FeatureCollection = await FU.readShapefile(shpPath);

  const bStringify: boolean = argv.json;
  const bKIWYSI: boolean = argv.kiwysi;

  // EXECUTE THE COMMAND

  const output = bKIWYSI ? calcKIWYSICompactness(shapes) : calcCompactness(shapes);

  // OUTPUT THE RESULTS

  if (bStringify)
    console.log(JSON.stringify(output));
  else
    console.log(output);
}
doit();
