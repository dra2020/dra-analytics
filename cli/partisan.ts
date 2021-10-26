//
// COMMAND TO CALCULATE PARTISAN METRICS
//
/* Examples:

$ ./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json
$ ./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json -j > temp/partisan.json

$ ./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json -x PA -n SCOPA -c -h
$ ./cli/partisan.js -i testdata/warrington/partisan-Hypothetical-A.json -x A -n 1-proportionality -c -h

$ ./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json -x PA -n SCOPA -p

*/

import yargs from 'yargs';

import * as T from '../lib/types/all'
import * as FU from '../testutil/fileutils';

import {calcPartisanMetrics, makePartisanScorecard} from '../lib/partisan/all';

import * as React from 'react';
// declare var Plotly: any;

/* plotly.js configuration:

  dra/index.html includes script "https://cdn.plot.ly/plotly-1.54.1.min.js"
*/

// Material Imports
import * as Material from '@material-ui/core';
import * as Lab from '@material-ui/lab';
import * as Icons from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

// "react-dom": "^16.8.6",
// "react-event-listener": "^0.6.6",
// "react-swipeable-views": "^0.13.9",
// "react-virtualized": "^9.21.1",

// "@types/react": "^16.8.23",
// "@types/react-dom": "^16.8.4",
// "@types/react-virtualized": "^9.21.2",


// SPECIFY THE ARGS

let argv = yargs
  .usage('Usage: $0 command [options]')
  .example('$0 ./cli/partisan.js', 'Calculates partisan metrics')
  .option('input', {
    alias: 'i',
    describe: 'A JSON profile of the partisan characteristics of a plan',
    type: 'string'
  })
  .option('state', {
    alias: 'x',
    describe: 'A two-character state code or hypothetical designation for the profile',
    type: 'string',
    default: 'XX'
  })
  .option('name', {
    alias: 'n',
    describe: 'The name of the partisan profile',
    type: 'string',
    default: 'Unspecified'
  })
  .option('csv', {
    alias: 'c',
    describe: 'Print output in CSV format',
    type: 'boolean',
    default: false
  })
  .option('header', {
    alias: 'h',
    describe: 'Print a CSV header',
    type: 'boolean',
    default: false
  })
  .option('plot', {
    alias: 'p',
    describe: 'Plot the S–V curve',
    type: 'boolean',
    default: false
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Log to STDOUT.',
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

const xx: string = argv.state;
const name: string = argv.name;
const bCSV = argv.csv as boolean;
const bHeader = argv.header as boolean;
const bPlot = argv.plot as boolean;


// EXECUTE THE COMMAND
// OUTPUT THE RESULTS

if (bCSV || bPlot)
{
  const N: number = profile.byDistrict.length;
  const s: T.PartisanScorecard = makePartisanScorecard(Vf, VfArray);

  if (bPlot) 
  {
    console.log("Plot the S–V curve ...");
  }
  else
  {
    if (bHeader) printPartisanDetailsHeader();
    printPartisanDetailsRow(xx, name, N, Vf, s);
  }

}
else
{
  const output = calcPartisanMetrics(Vf, VfArray);

  console.log(JSON.stringify(output));
}


// HELPERS

// Trim results for printing - Cloned from dra-score

// Round a fractional / floating point number to the desired level of PRECISION.
function trim(fullFraction: number, digits: number | undefined = undefined): number
{
  const PRECISION: number = 4;

  if (digits == 0)
  {
    return Math.round(fullFraction);
  }
  else
  {
    let shiftPlaces = 10 ** (digits || PRECISION);

    return Math.round(fullFraction * shiftPlaces) / shiftPlaces;
  }
}

// Generate partisan details (Table 1)
export function printPartisanDetailsHeader(): void
{
  console.log('XX, <V>, S(<V>), Rd, R, r, MIR, Cd, Cdf, BS_50, BV_50, Decl, GS, 𝛾, β, LO, EG, PR, MM, TO, MM\', B%, UE, LS, LPR, LPR\', LUE');
  // console.log('XX, <V>, S(<V>), B%, BS_50, BV_50, Decl, GS, EG, Beta, PR, MM, TO, MM\', LO, Rd, R, r, MIR, Cd, Cdf, LS, LPR, LPR\'');
}

export function printPartisanDetailsRow(xx: string, name: string, N: number, Vf: number, s: T.PartisanScorecard): void
{
  console.log('%s, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f',
    xx,

    trim(Vf),
    trim(s.bias.estSf),

    trim(s.responsiveness.rD),
    (s.responsiveness.bigR) ? trim(s.responsiveness.bigR) : s.responsiveness.bigR,           // Not shown in Table 1
    (s.responsiveness.littleR) ? trim(s.responsiveness.littleR) : s.responsiveness.littleR,  // Not shown in Table 1
    (s.responsiveness.mIR) ? trim(s.responsiveness.mIR) : s.responsiveness.mIR,              // Not shown in Table 1 <<< Zeta

    trim(s.responsiveness.cD),                                                               // Not shown in Table 1
    trim(s.responsiveness.cDf),                                                              // Not shown in Table 1

    trim(s.bias.bS50),
    (s.bias.bV50) ? trim(s.bias.bV50) : s.bias.bV50,
    (s.bias.decl) ? trim(s.bias.decl) : s.bias.decl,
    trim(s.bias.gSym),
    (s.bias.gamma) ? trim(s.bias.gamma) : s.bias.gamma,

    (s.bias.bSV) ? trim(s.bias.bSV) : s.bias.bSV,                                            // Beta
    (s.bias.lO) ? trim(s.bias.lO) : s.bias.lO,
    trim(s.bias.prop),                                                                       // PR
    trim(s.bias.eG),

    trim(s.bias.mMs),                                                                        // Not shown in Table 1
    trim(s.bias.tOf),                                                                        // Not shown in Table 1
    trim(s.bias.mMd),                                                                        // Not shown in Table 1

    trim(s.bias.deviation),                                                                  // Simple deviation from best # of seats
    trim(s.impact.unearnedS),

    // EXPERIMENTAL
    (s.experimental.lSym) ? trim(s.experimental.lSym) : s.experimental.lSym,
    (s.experimental.lProp) ? trim(s.experimental.lProp) : s.experimental.lProp,
    (s.experimental.lPropAlt) ? trim(s.experimental.lPropAlt) : s.experimental.lPropAlt,
    (s.experimental.lUE) ? trim(s.experimental.lUE) : s.experimental.lUE
  );
}
