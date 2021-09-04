# Splitting

This library supports analysis of splitting of various geographic units by districts.

## Exports

TODO

The next two functions implement Sam Wang et al's metrics for analyzing splitting of COI.
Both take arrays of split percentages and return numbers.

### uncertaintyOfMembership

``` TypeScript
export function uncertaintyOfMembership(splits: number[]): number;
``` 

### effectiveSplits

``` TypeScript
export function effectiveSplits(splits: number[]): number;
``` 

