// Restrict package exports

export
{
  makeCompactnessScorecard,

  // For legacy compactness calculations
  calcXSymmetry,
  calcYSymmetry,
  calcReock,
  calcBoundingBox,
  calcPolsbyPopper,
  calcConvexHullFeature,
  calcSchwartzberg,

  // For KIWYSI compactness scores (only)
  kiwysiScoreShape,
  kiwysiScoreShapes
} from '../compactness/all';

