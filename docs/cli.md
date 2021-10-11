# Command-Line Interface (CLI)

The command-line interface (CLI) exposes the main analytics functionality for scripting.

## Commands

### partisan

The partisan command calculates all the bias & responsiveness metrics for a partisan "profile."

``` shell
./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json
``` 

This command can be batched to produce CSV output for multiple profiles, as illustrated in
analyze-2012-profiles.sh and analyze-hypothetical-profiles.sh in the scripts directory.

### compactness

The compactness command calculates the compactness measures for the shapes in a shapfile or a geojson.

``` shell
./cli/compactness.js -i testdata/compactness/first20/first20.shp
``` 

``` shell
./cli/compactness.js -i ./testdata/compactness/sample.geojson
``` 

Add the -k flag to get the KIWYSI compactness measurements.

### splitting

The splitting command calculates county- & district-splitting for a counties-by-districts matrix.

``` shell
./cli/splitting.js -i testdata/splitting/CxD.json
``` 

You can direct the output to a file or pipe it into another command for further processing.