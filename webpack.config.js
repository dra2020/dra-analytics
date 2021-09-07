var path = require('path');
var fs = require('fs');

// Don't package up these - let ultimate client do so
var externals = {};
fs.readdirSync('node_modules').filter(s => s !== '.bin').forEach(s => {externals[s] = `commonjs ${s}`});
fs.readdirSync('node_modules/@dra2020').forEach(s => {s = `@dra2020/${s}`; externals[s] = `commonjs ${s}`});

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
  devtool: "source-map",

  externals: externals,

  module: {
    rules: [
      {test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
      // {test: /\.json$/, loader: 'json-loader', exclude: /node_modules/},
      {test: /\.js$/, enforce: "pre", loader: "source-map-loader"}
    ]
  },

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  }

};

// var cliConfig = {  <<< TODO: add a CLI

var testConfig = {
  entry: {
    library: './lib/all/all.ts'
  },
  target: 'node',
  mode: 'development',
  output: {
    path: __dirname + '/testdist'
  },

  externals: {
    "yargs": "commonjs yargs"
  },

  module: {
    rules: [
      {test: /\.tsx?$/, use: 'ts-loader', exclude: '/node_modules/'},
      {test: /\.js$/, enforce: "pre", loader: "source-map-loader"}
    ]
  },

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  }
};

module.exports = [libConfig, testConfig];
