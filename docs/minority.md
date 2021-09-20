# Minority

This library supports analyzing the opportunity for minority representation 
as well as the degree of racially polarized voting in districts.

## Exports

There are two exported functions.

### makeMinorityScorecard

This takes VAP (or CVAP) demographics statewide and by district and estimates the opportunity for minority representation.
It also "pivots" the demographic percentages by district into a structure that DRA uses in the Minority Representation section of the Advanced tab.
This is part of an overall DRA scorecard.
The opportunity can be later rated (scored).

``` TypeScript
export declare function makeMinorityScorecard(statewideDemos: Demographics, demosByDistrict: Demographics[], bLog: boolean = false): MinorityScorecard;
``` 

### analyzeRacialVoting

This function analyzes polarization in racial &amp; ethnic voting patterns.

``` TypeScript
export declare function analyzeRacialVoting(points: DemographicVotingByFeature | undefined, districtID: number, groups: MinorityFilter): RPVAnalysis | undefined;
``` 

It takes arrays of points by demographic (x = demographic %, y = Democratic %) and
analyzes racial or ethnic polarization.
