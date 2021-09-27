//
// COMMAND-LINE INTERFACE (CLI)
//
/* Examples:

$ ./cli/hello.js

*/

import yargs from 'yargs';
// import * as fs from 'fs';
// import * as path from 'path';
// import parse from 'csv-parse/lib/sync';

// import * as FU from '../testutil/fileutils';


// TODO - SPECIFY THE ARGS

let argv = yargs
  .usage('Usage: $0 command [options]')
  .example('$0 ./cli/hello.js', 'Hello!')
  // .demandCommand(1, 'You must specify a command to execute.')
  // .command('hello', 'Hello!')
  .option('verbose', {
    alias: 'v',
    describe: 'Specify whether code should log to STDOUT.',
    type: 'boolean',
    default: false
  })
  .help()
  .argv;

let command = argv._[0]

// TODO - PARSE THE ARGS

// const xx: string = argv.state;

// TODO - EXECUTE THE COMMAND

console.log("Hello!");


// TODO - HELPERS

