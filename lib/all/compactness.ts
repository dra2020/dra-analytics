// Restrict package exports

export
{
  // For a DRA-style scorecard
  makeCompactnessScorecard,
  // For the CLI
  calcCompactness,
  calcKIWYSICompactness,

  // For legacy compactness calculations
  calcXSymmetry,
  calcYSymmetry,
  calcReock,
  calcBoundingBox,
  calcPolsbyPopper,
  calcConvexHullFeature,
  calcSchwartzberg,

  // For KIWYSI compactness scores (only)
  featureizePoly,
  kiwysiScoreShape,
  kiwysiScoreShapes
} from '../compactness/all';

