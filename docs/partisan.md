# Partisan

This library computes measures of partisan bias & responsiveness.

## Exports

There is one main function and a few helpers. 

### makePartisanScorecard

This function takes a statewide Democratic vote share and Democratic vote shares by district and calculates many measures of bias & responsiveness.
They are enumerated & described in [Advanced Measures of Bias & Responsiveness](https://medium.com/dra-2020/advanced-measures-of-bias-responsiveness-c1bf182d29a9).
It also infers the points for a seats–cotes curves and returns those as well as the key points for drawing a rank–votes graph.
This is part of an overall DRA scorecard.
Disproportinality -- or some other measure of your choice -- can be later rated (scored).

``` TypeScript
export declare function makePartisanScorecard(Vf: number, VfArray: VfArray, bLog: boolean = false): PartisanScorecard;
``` 

While this is called a "scorecard," it simply calculates all the metrics.
Some of them depend on (effectively) inferring a seats-votes curve or a rank-votes graph,
so it's easier (and more efficient) to bundle these calculations together as opposed to exposing them individually.

### calcPartisanMetrics

TODO: Add calcPartisanMetrics

The next two functions implement the core of John Nagle's method using fractional seat probabilities.
The details are in [this white paper](https://lipid.phys.cmu.edu/nagle/Technical/FractionalSeats2.pdf).

### estSeatProbability

This function uses a probability curve to estimate the likelihood of winning given a Democratic vote share.

``` TypeScript
export declare function estSeatProbability(Vf: number, range?: number[]): number
``` 

### estDistrictResponsiveness

This function uses a complementary probability curve to estimate the likelihood that a district will "swing" given a Democratic vote share.

``` TypeScript
export declare function estDistrictResponsiveness(Vf: number): number;
``` 
  
### fptpWin

This function does simple first-past-the-post / all-or-nothing accounting given a Democratic vote share, returning either 0 or 1.

``` TypeScript
export declare function fptpWin(Vf: number): number;
``` 