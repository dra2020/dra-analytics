//
// COMMAND TO CALCULATE COUNTY-DISTRICT SPLITTING METRICS
//
/* Examples:

$ ./cli/splitting.js -i testdata/splitting/CxD.json
$ ./cli/splitting.js -i testdata/splitting/CxD.json > temp/partisan.json

*/

import yargs from 'yargs';

import * as T from '../lib/types/all'
import * as FU from '../testutil/fileutils';

import {calcSplitting} from '../lib/splitting/all';


// SPECIFY THE ARGS

let argv = yargs
  .usage('Usage: $0 command [options]')
  .example('$0 ./cli/splitting.js', 'Calculates county-district splitting metrics')
  .option('input', {
    alias: 'i',
    describe: 'A county x district breakdown in JSON',
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


// PARSE THE ARGS

const profilePath: string = argv.input;
const profile = FU.readJSON(profilePath);

const CxD: T.CxD = profile.countyByDistrict;


// EXECUTE THE COMMAND

const output = calcSplitting(CxD);


// OUTPUT THE RESULTS

console.log(JSON.stringify(output));
