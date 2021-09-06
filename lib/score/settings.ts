//
// CONSTANTS
//


// Normalized scores [0-100]
export const NORMALIZED_RANGE: number = 100;

// Square deviations from the ideal
export const DISTANCE_WEIGHT: number = 2;

// Out of range message
export const OUT_OF_RANGE_MSG: string = "%f out of range";

// A small delta to use when testing ranges of values
export const EPSILON = 1 / Math.pow(10, 6);

// "Roughly equal" = average census block size / 2
export const AVERAGE_BLOCK_SIZE = 30;
export const EQUAL_TOLERANCE: number = AVERAGE_BLOCK_SIZE / 2;

