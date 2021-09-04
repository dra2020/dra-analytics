# Splitting

This library supports analysis of splitting of various geographic units by districts.

## Exports

TODO

The next two functions implement Sam Wang et al's metrics for analyzing splitting of COI:
[Turning Communities Of Interest Into A Rigorous Standard For Fair Districting](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3828800).
Both take arrays of split percentages and return numbers.

### uncertaintyOfMembership

Defined in Footnote 121 (P. 21).

``` TypeScript
export function uncertaintyOfMembership(splits: number[]): number;
``` 

### effectiveSplits

Defined in Footnote 123 (P. 22).

``` TypeScript
export function effectiveSplits(splits: number[]): number;
``` 

