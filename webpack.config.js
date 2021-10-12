var path = require('path');
var fs = require('fs');

// Don't package up these - let ultimate client do so
var commonExternals = {};
fs.readdirSync('node_modules').filter(s => s !== '.bin').forEach(s => {commonExternals[s] = `commonjs ${s}`});
fs.readdirSync('node_modules/@dra2020').forEach(s => {s = `@dra2020/${s}`; commonExternals[s] = `commonjs ${s}`});

var commonModule = {
  rules: [
    {test: /\.tsx?$/, loader: 'ts-loader'},
    // {test: /\.json$/, loader: 'json-loader'},
    {test: /\.js$/, enforce: "pre", loader: "source-map-loader"}
  ]
};

var commonResolve = {extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]};

var commonDevtool = "source-map";


// LIB

var libConfig = {
  entry: {
    library: './lib/all/all.ts'
  },
  target: 'node',
  mode: 'development',
  output: {
    library: 'dra-analytics',
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: 'dra-analytics.js'
  },

  // Enable source maps
  devtool: commonDevtool,

  externals: commonExternals,

  module: commonModule,

  resolve: commonResolve
};


// JEST

var testConfig = {
  entry: {
    library: './lib/all/all.ts'
  },
  target: 'node',
  mode: 'development',
  output: {
    path: __dirname + '/testdist'
  },

  externals: commonExternals,

  module: commonModule,

  resolve: commonResolve
};


// CLI

var cliConfigs = [
  {entry: './cli/compactness.ts', output: {filename: 'dra-compactness.bundle.js'}},
  {entry: './cli/partisan.ts', output: {filename: 'dra-partisan.bundle.js'}},
  {entry: './cli/splitting.ts', output: {filename: 'dra-splitting.bundle.js'}}
]

cliConfigs.forEach((c) =>
{
  c.target = 'node';
  c.mode = 'development';
  c.devtool = commonDevtool;
  c.externals = commonExternals;
  c.resolve = commonResolve;
  c.module = commonModule;
  c.output.path = path.resolve('testdist');
});

module.exports = [libConfig, testConfig, ...cliConfigs];
