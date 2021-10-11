# Splitting

This library supports analysis of splitting of various geographic units by districts.

## County-District Splitting Exports

### makeSplittingScorecard

This function takes a 2D matrix of county populations by districts 
and returns the raw county- and district-splitting measurements. 
These measures are described in [Measuring County &amp District Splitting](https://medium.com/dra-2020/measuring-county-district-splitting-48a075bcce39).
It also includes basic county-splitting information that is used in DRA, i.e., that is DRA specific.
This is part of an overall DRA scorecard.
County-district splitting can be later rated (scored).

``` TypeScript
export declare function makeSplittingScorecard(CxD: CountyProfile, bLog: boolean = false): SplittingScorecard;
``` 

### calcSplitting

This function just gives you the reduced county- & district-splitting measurements as JSON.

``` TypeScript
export declare function calcSplitting(CxD: T.CxD): SplittingJSONReady;
``` 

The next two functions implement the county-district splitting measures used in DRA.

### _calcCountySplittingReduced

``` TypeScript
export declare function _calcCountySplittingReduced(CxD: CxD, districtTotals: number[], countyTotals: number[], bLD: boolean = false): number;
```  

### _calcDistrictSplittingReduced

``` TypeScript
export declare function _calcDistrictSplittingReduced(CxD: CxD, districtTotals: number[], countyTotals: number[], bLD: boolean = false): number;
``` 

These two functions implement the generic county-district splitting metrics 
without the preprocessing that DRA does to "reduce" the county-district matrix.

### _calcCountySplitting

``` TypeScript
export declare function _calcCountySplitting(CxD: T.CxD, countyTotals: number[], bLog: boolean = false): number;
```  

### _calcDistrictSplitting

``` TypeScript
export declare function _calcDistrictSplitting(CxD: T.CxD, districtTotals: number[], bLog: boolean = false): number;
``` 

## COI Splitting Exports

The next two functions implement Sam Wang *et al's* metrics for analyzing splitting of COI:
[Turning Communities Of Interest Into A Rigorous Standard For Fair Districting](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3828800).
Both take arrays of split percentages and return numbers.

### uncertaintyOfMembership

Defined in Footnote 121 (P. 21).

``` TypeScript
export declare function uncertaintyOfMembership(splits: number[]): number;
``` 

### effectiveSplits

Defined in Footnote 123 (P. 22).

``` TypeScript
export declare function effectiveSplits(splits: number[]): number;
``` 

