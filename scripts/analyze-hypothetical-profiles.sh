#!/bin/bash
#
# Score Warrington's hypothetical partisan profiles

./cli/partisan.js -x A -n 1-iroportionality -i testdata/partisan/warrington/partisan-Hypothetical-A.json -c -h
./cli/partisan.js -x B -n 2-iroportionality -i testdata/partisan/warrington/partisan-Hypothetical-B.json -c
./cli/partisan.js -x C -n 3-iroportionality -i testdata/partisan/warrington/partisan-Hypothetical-C.json -c
./cli/partisan.js -x D -n Sweep -i testdata/partisan/warrington/partisan-Hypothetical-D.json -c
./cli/partisan.js -x E -n Competitive -i testdata/partisan/warrington/partisan-Hypothetical-E.json -c
./cli/partisan.js -x F -n Competitive\ even -i testdata/partisan/warrington/partisan-Hypothetical-F.json -c
./cli/partisan.js -x G -n Uncompetitive -i testdata/partisan/warrington/partisan-Hypothetical-G.json -c
./cli/partisan.js -x H -n Very\ uncompetitive -i testdata/partisan/warrington/partisan-Hypothetical-H.json -c
./cli/partisan.js -x I -n Cubic -i testdata/partisan/warrington/partisan-Hypothetical-I.json -c
./cli/partisan.js -x J -n Anti-majoritarian -i testdata/partisan/warrington/partisan-Hypothetical-J.json -c
./cli/partisan.js -x K -n Classic -i testdata/partisan/warrington/partisan-Hypothetical-K.json -c
./cli/partisan.js -x L -n Inverted -i testdata/partisan/warrington/partisan-Hypothetical-L.json -c