//
// COMMAND-LINE INTERFACE (CLI)
//
/* Examples:

$ TODO

*/

import yargs from 'yargs';
// import * as fs from 'fs';
// import * as path from 'path';
// import parse from 'csv-parse/lib/sync';

// import * as FU from '../testutil/fileutils';

// TODO
let argv = yargs
  .usage('Usage: $0 command [options]')
  .example('$0 hello', 'Hello!')
  .demandCommand(1, 'You must specify a command to execute.')
  .command('hello', 'Hello!')
  .option('verbose', {
    alias: 'v',
    describe: 'Specify whether code should log to STDOUT.',
    type: 'boolean',
    default: false
  })
  .help()
  .argv;

let command = argv._[0]

// parse the args
// const xx: string = argv.state;

switch (command)
{
  case 'hello': {
    console.log("Hello!");
    break;
  }
  default: {
    console.log("Command not recognized.");

    break;
  }
}


// HELPERS

