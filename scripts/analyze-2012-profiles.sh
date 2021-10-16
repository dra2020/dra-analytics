#!/bin/bash
#
# Score Nagle's 2012 sample states
#
# Example:
#
# ./scripts/analyze-2012-profiles.sh

./cli/partisan.js -x CA -n CA-2012 -i testdata/partisan/nagle/partisan-CA-2012.json -c -h
./cli/partisan.js -x IL -n IL-2012 -i testdata/partisan/nagle/partisan-IL-2012.json -c
./cli/partisan.js -x MD -n MD-2012 -i testdata/partisan/nagle/partisan-MD-2012.json -c
./cli/partisan.js -x MA -n MA-2012 -i testdata/partisan/nagle/partisan-MA-2012.json -c
./cli/partisan.js -x CO -n CO-2012 -i testdata/partisan/nagle/partisan-CO-2012.json -c
./cli/partisan.js -x NC -n NC-2012 -i testdata/partisan/nagle/partisan-NC-2012.json -c
./cli/partisan.js -x OH -n OH-2012 -i testdata/partisan/nagle/partisan-OH-2012.json -c
./cli/partisan.js -x PA -n PA-2012 -i testdata/partisan/nagle/partisan-PA-2012.json -c
./cli/partisan.js -x TN -n TN-2012 -i testdata/partisan/nagle/partisan-TN-2012.json -c
./cli/partisan.js -x TX -n TX-2012 -i testdata/partisan/nagle/partisan-TX-2012.json -c
./cli/partisan.js -x SC -n SC-2012 -i testdata/partisan/nagle/partisan-SC-2012.json -c