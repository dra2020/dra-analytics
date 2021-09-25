// Restrict package exports

export
{
  // For a DRA-style scorecard
  makeSplittingScorecard,
  // For the CLI & other users
  calcSplitting,

  // For COI splitting analysis
  effectiveSplits, uncertaintyOfMembership
} from '../splitting/all';