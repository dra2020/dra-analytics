# Minority

This library supports analyzing the opportunity for minority representation 
as well as the degree of racially polarized voting.

TODO

## Exports

### analyzeRacialVoting

You can use this function analyze polarization in racial &amp; ethnic voting patterns:

``` TypeScript
export function analyzeRacialVoting(points: DemographicVotingByFeature | undefined, districtID: number, groups: MinorityFilter): RPVAnalysis | undefined;
``` 

It takes arrays of points by demographic (x = demographic %, y = Democratic %) and
analyzes racial or ethnic polarization.

