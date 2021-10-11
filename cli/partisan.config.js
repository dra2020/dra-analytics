var path = require('path');
var fs = require('fs');

var commonExternals = {};
fs.readdirSync('node_modules')
  .filter(function (x)
  {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod)
  {
    commonExternals[mod] = 'commonjs ' + mod;
  });

// Pull out shared stuff explicitly
fs.readdirSync('node_modules/@dra2020')
  .forEach((mod) =>
  {
    mod = '@dra2020/' + mod;
    commonExternals[mod] = 'commonjs ' + mod;
  });

var commonModule = {
  rules: [
    {test: /\.tsx?$/, loader: 'ts-loader'},
    // {test: /\.json$/, loader: 'json-loader'},  // TODO: If I enable this, the command build breaks.
    {test: /\.js$/, enforce: "pre", loader: "source-map-loader"}
  ]
};

var commonResolve = {extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]};

var commonDevtool = "source-map";

var configs = [
  {entry: './cli/partisan.ts', output: {filename: 'dra-partisan.bundle.js'}},
]

// Put the CLI outputs in testdist/
configs.forEach((c) =>
{
  c.target = 'node';
  c.mode = 'development';
  c.devtool = commonDevtool;
  c.externals = commonExternals;
  c.resolve = commonResolve;
  c.module = commonModule;
  c.output.path = path.resolve('testdist');
});

module.exports = configs;
