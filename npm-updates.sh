#!/bin/bash
#
# Update node/npm dependencies
#
# - Use "node-check-updates" (or ncu) to see which dependencies are out of date. 
#   It will show you the latest version (x.y.z).
#
# - If z is out of date, just "npm install [lib] will install the update.
# - If y is out of date, "npm install [lib]@latest" will install the update.
# - If x is out of date, "npm install [lib]@<new x>"" will install the update.
#
# For example:
#
# ./npm-updates.sh
#

# I bumped the version number to 4.1.0.

# Initial ncu check:

#  @dra2020/baseclient    ^1.0.67  →     ^1.0.89     
#  @types/geojson       ^7946.0.8  →  ^7946.0.10     
#  @types/jest            ^27.0.3  →     ^29.2.3     
#  @types/node          ^12.20.20  →    ^18.11.9     
#  @types/yargs           ^16.0.4  →    ^17.0.13     
#  csv-parse              ^4.16.0  →      ^5.3.2     
#  jest                   ^27.4.3  →     ^29.3.1     
#  prettier                ^2.3.2  →      ^2.7.1     
#  source-map-loader       ^3.0.0  →      ^4.0.1     
#  ts-jest                ^27.1.1  →     ^29.0.3     
#  ts-loader               ^9.2.6  →      ^9.4.1     
#  typescript              ^4.5.2  →      ^4.9.3     
#  webpack                ^5.65.0  →     ^5.75.0     
#  webpack-cli             ^4.9.1  →     ^4.10.0     
#  yargs                  ^17.1.1  →     ^17.6.2  

# Initial updates:

npm install @dra2020/baseclient 
npm install @types/geojson
npm install @types/node
npm install @types/yargs@12
npm install csv-parse
npm install prettier@latest
npm install source-map-loader@4
npm install ts-loader@latest
npm install typescript@latest
npm install webpack@latest
npm install webpack-cli@latest
npm install yargs@12

npm uninstall @types/jest
npm uninstall jest
npm uninstall ts-jest

npm install @types/jest@26
npm install jest@26
npm install ts-jest@26

# This yielded:

#  @types/jest    ^26.0.24  →   ^29.2.3     
#  jest            ^26.6.3  →   ^29.3.1     
#  ts-jest         ^26.5.6  →   ^29.0.3     
#  @types/node   ^12.20.55  →  ^18.11.9     
#  @types/yargs   ^12.0.20  →  ^17.0.13     
#  csv-parse       ^4.16.3  →    ^5.3.2     
#  yargs           ^12.0.5  →   ^17.6.2   

# with status:
# - builds
# - tests run & pass

# 