//
// BIAS TYPES
//

import * as T from './general';


// SUPPORT

export type VfArray = number[];

export type SVpoint = {
  v: number,  // A fraction [0.0–1.0]
  s: number   // A fraction [0.0–1.0]
}

export type rVpoints = {
  Sb: number,
  Ra: number,
  Rb: number,
  Va: number,
  Vb: number
}

export const enum Shift
{
  Proportional,
  Uniform
}


// BIAS

export type Bias = {
  bestS: number,
  bestSf: number,
  estS: number,
  estSf: number,
  deviation: number,
  score?: number,

  tOf: number,
  fptpS: number,
  bS50: number,
  bV50?: number,
  decl?: number | undefined,
  rvPoints?: rVpoints,
  gSym: number,
  gamma?: number,
  eG: number,
  bSV?: number,
  prop: number,
  mMs: number,
  mMd: number,
  lO: number | undefined
}


// IMPACT - Note: This is a legacy of DRA analytics that is not used.
export type Impact = {
  unearnedS: number,
  score?: number
}


// RESPONSIVENESS

export type Responsiveness = {
  bigR?: number,
  littleR?: number,
  mIR?: number,
  rD: number,
  rDf: number,

  cSimple: number,
  cD: number,
  cDf: number,
  score?: number
}


// EXPERIMENTAL

export type Experimental = {
  lSym?: number,
  lProp?: number
}


// COMBINED SCORECARD

export type PartisanScorecard = {
  bias: Bias,
  impact: Impact,
  responsiveness: Responsiveness,
  dSVpoints: SVpoint[],
  rSVpoints: SVpoint[],
  averageDVf: number | undefined,
  averageRVf: number | undefined,
  experimental: Experimental,
  details: T.Dict
}


// CLI & OTHER USERS

export type PartisanJSONReady = {
  bias: Bias,
  responsiveness: Responsiveness,
  dSVpoints: SVpoint[],
  rSVpoints: SVpoint[],
  averageDVf: number | undefined,
  averageRVf: number | undefined,
}