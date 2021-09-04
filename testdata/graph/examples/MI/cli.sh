# All should show as contiguous:
# * MI-1 - Wayne County in toto
# * MI-2 - Wayne County except w/o water-only
# * MI-3 - Wayne County except w/o water-only, but split between two districts
# * MI-4 - Wayne County including water-only precinct, but split between two districts

utils/main.js connected -g testdata/examples/MI/contiguity.json -p testdata/examples/MI/MI-1.csv
utils/main.js connected -g testdata/examples/MI/contiguity.json -p testdata/examples/MI/MI-2.csv
utils/main.js connected -g testdata/examples/MI/contiguity.json -p testdata/examples/MI/MI-3.csv
utils/main.js connected -g testdata/examples/MI/contiguity.json -p testdata/examples/MI/MI-4.csv

utils/main.js connected -g testdata/examples/MI/contiguity.json -p testdata/examples/MI/MI-anthonyfun8.csv
