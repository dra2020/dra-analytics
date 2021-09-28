//
// COMMAND TO CALCULATE PARTISAN METRICS
//
/* Examples:

$ ./cli/compactness.js -i testdata/compactness/first20/first20.shp

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
// TODO - Add KIWYSI option
const doit = async () =>
{
  // PARSE THE ARGS

  const shpPath: string = argv.input;
  const shapes: GeoJSON.FeatureCollection = await FU.readShapefile(shpPath);

  // EXECUTE THE COMMAND

  const output = calcCompactness(shapes);

  console.log(JSON.stringify(output));
}
doit();
