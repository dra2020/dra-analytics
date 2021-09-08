# Equal

This library supports analysis of population deviation & 'roughly' equal population.

## Exports

TODO

### calcPopulationDeviation

``` TypeScript
export function calcPopulationDeviation(max: number, min: number, targetSize: number): number;
``` 

### isRoughlyEqual

``` TypeScript
export function isRoughlyEqual(devation: number, bLegislative: boolean): boolean;
``` 

### makePopulationScorecard

``` TypeScript
export function makePopulationScorecard(totPopByDistrict: number[], targetSize: number, bLegislative: boolean, bLog: boolean = false): PopulationScorecard;
``` 