# Command-Line Interface (CLI)

The command-line interface (CLI) exposes the main analytics functionality for scripting.

## Commands

You can direct the output of these commands to a file or pipe it into another command for further processing.

### partisan

The partisan command calculates all the bias & responsiveness metrics for a partisan "profile."

``` shell
./cli/partisan.js -i testdata/partisan/nagle/partisan-PA-SCOPA-7S.json
``` 

This command can be batched to produce CSV output for multiple profiles, as illustrated in
analyze-2012-profiles.sh and analyze-hypothetical-profiles.sh in the scripts directory.

Use the --help option to show help.

### compactness

The compactness command calculates the compactness measures for the shapes in a shapfile or a geojson.

``` shell
./cli/compactness.js -i testdata/compactness/first20/first20.shp
``` 

``` shell
./cli/compactness.js -i ./testdata/compactness/sample.geojson
``` 

Use the --help option to show help.
The -k flag produces KIWYSI compactness measurements.

### splitting

The splitting command calculates county- & district-splitting for a counties-by-districts matrix.

``` shell
./cli/splitting.js -i testdata/splitting/CxD.json
``` 

Use the --help option to show help.