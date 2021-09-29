//
// COMMAND TO CALCULATE PARTISAN METRICS
//
/* Examples:

$ ./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json
$ ./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json -j > results.json

*/

import yargs from 'yargs';

import * as T from '../lib/types/all'
import * as FU from '../testutil/fileutils';

import {calcPartisanMetrics} from '../lib/partisan/all';


// SPECIFY THE ARGS

let argv = yargs
  .usage('Usage: $0 command [options]')
  .example('$0 ./cli/partisan.js', 'Calculates partisan metrics')
  .option('input', {
    alias: 'i',
    describe: 'A JSON profile of the partisan characteristics of a plan',
    type: 'string'
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


// PARSE THE ARGS

const profilePath: string = argv.input;
const profile = FU.readJSON(profilePath);

const Vf: number = profile.statewide;
const VfArray: T.VfArray = profile.byDistrict;

const bStringify: boolean = argv.json;


// EXECUTE THE COMMAND

const output = calcPartisanMetrics(Vf, VfArray);


// OUTPUT THE RESULTS

if (bStringify)
  console.log(JSON.stringify(output));
else
  console.log(output);
