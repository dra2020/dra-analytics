# Rate

This library contains the functions that DRA uses to rate (or score) various measures.

## Exports

After the raw metrics are calculated, these functions are use to add ratings (scores) to the DRA scorecard.
Ratings are integers [0–100] where bigger is always better.
Except for partisan bias, all the ratings functions use simpler, linear normalization.

### ratePopulationDeviation

``` TypeScript
export declare function ratePopulationDeviation(rawDeviation: number, bLegislative: boolean): number;
``` 

### rateProportionality

``` TypeScript
export declare function rateProportionality(rawDisproportionality: number, Vf: number, Sf: number): number;
``` 

### ratePartisanBias

The method DRA uses for rating partisan bias is described in [How We Rate Partisan Bias](https://medium.com/dra-2020/rating-partisan-bias-880646771c01).

``` TypeScript
export declare function ratePartisanBias(rawSeatsBias: number, rawVotesBias: number): number;
``` 

### rateCompetitiveness

``` TypeScript
export declare function rateCompetitiveness(rawCdf: number): number;
``` 

### rateMinorityRepresentation

This function combines the opportunity to elect minorities in each separate minority demographic
with the potential "coalition districts" and produces an overall rating (score).

``` TypeScript
export declare function rateMinorityRepresentation(rawOd: number, pOd: number, rawCd: number, pCd: number): number;
``` 

### rateCompactness

This function combines the individual Reock and Polsby–Popper ratings into a single overall rating (score).

``` TypeScript
export declare function rateCompactness(rS: number, ppS: number): number;
```  

### rateReock

``` TypeScript
export declare function rateReock(rawValue: number): number;
```  
  
### ratePolsby

``` TypeScript
export declare function ratePolsby(rawValue: number): number;
``` 

### rateSplitting

This function combines the individual county- and district-splitting ratings into a single overall rating (score).

``` TypeScript
export declare function rateSplitting(csS: number, dsS: number): number;
```  
  
### adjustSplittingRating

Initially, maps could get a 100 rating even if they split some counties or districts.
This function can be used to make the maximum rating for maps that split any counties or districts be 99.

``` TypeScript
export declare function adjustSplittingRating(rating: number, rawCountySplitting: number, rawDistrictSplitting: number): number;
``` 
  
### rateCountySplitting

``` TypeScript
export declare function rateCountySplitting(rawCountySplitting: number, nCounties: number, nDistricts: number, bLD: boolean = false): number;
```  
  
### rateDistrictSplitting

``` TypeScript
export declare function rateDistrictSplitting(rawDistrictSplitting: number, bLD: boolean = false): number;
``` 

These are some additional helpers that DRA uses in the app.

### isAntimajoritarian

This function uses the constant avgSVError that DRA sets at 2%.

``` TypeScript
export declare function isAntimajoritarian(Vf: number, Sf: number): boolean;
``` 

### popdevThreshold

``` TypeScript
export declare function popdevThreshold(bLegislative: boolean): number;
``` 
