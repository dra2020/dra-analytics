// Export everything here -- restrict package exports in all/types.ts

export * from './compactness';
export * from './general';
export * from './graph';
export * from './minority';
export * from './partisan';
export * from './population';
export * from './splitting';


// Overall scorecard

import {PartisanScorecard} from './partisan';
import {MinorityScorecard} from './minority';
import {CompactnessScorecard} from './compactness';
import {SplittingScorecard} from './splitting';
import {PopulationScorecard} from './population';
import {Dict} from './general';

export type Scorecard = {
  partisan: PartisanScorecard;
  minority: MinorityScorecard;
  compactness: CompactnessScorecard;
  splitting: SplittingScorecard;
  populationDeviation: PopulationScorecard;
  details: Dict;
}