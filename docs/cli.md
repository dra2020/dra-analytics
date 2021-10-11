# Command-Line Interface (CLI)

This library adds a command-line interface (CLI) to the main analytics functionality.

## Commands

### partisan

This command calculates all the bias & responsiveness metrics for a partisan "profile."

``` shell
./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json
``` 

This command can be batched to produce CSV output for multiple profiles, as illustrated in
analyze-2012-profiles.sh and analyze-hypothetical-profiles.sh in the scripts directory.

### compactness

This command takes a shapfile or a geojson and calculates the compactness measures for the shapes.

``` shell
./cli/compactness.js -i testdata/compactness/first20/first20.shp
``` 

``` shell
./cli/compactness.js -i ./testdata/compactness/sample.geojson
``` 

Add the -k flag to get the KIWYSI compactness measurements.

### splitting

This command calculates county- & district-splitting for a counties-by-districts matrix.

``` shell
./cli/splitting.js -i testdata/splitting/CxD.json
``` 
