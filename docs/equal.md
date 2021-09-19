# Equal

This library supports analysis of population deviation & 'roughly' equal population.

## Exports

There is one high-level export.

### makePopulationScorecard

This calculates the population deviation and determines whether it meets the 'roughly' equal population threshold.
This is used as part of constructing an overall DRA scorecard.

``` TypeScript
export declare function makePopulationScorecard(totPopByDistrict: number[], targetSize: number, bLegislative: boolean, bLog: boolean = false): PopulationScorecard;
``` 

### calcPopulationDeviation

This is the formula for population deviation.

``` TypeScript
export declare function calcPopulationDeviation(max: number, min: number, targetSize: number): number;
``` 

### isRoughlyEqual

This checks whether a population deviation meets the 'rough' equal threshold,
taking into account the kind of districts (congressional or state legislative).

``` TypeScript
export declare function isRoughlyEqual(devation: number, bLegislative: boolean): boolean;
``` 
