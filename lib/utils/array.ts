//
// ARRAY UTILITIES
//

import * as U from './general';

export function sumArray(arr: number[]): number
{
  return arr.reduce((a, b) => a + b, 0);
}

export function avgArray(arr: number[]): number
{
  return (arr.reduce((a, b) => a + b, 0)) / arr.length;
}

export function minArray(arr: number[]): number
{
  return Math.min(...arr);
}

export function maxArray(arr: number[]): number
{
  return Math.max(...arr);
}

// Modified from https://jsfiddle.net/Lucky500/3sy5au0c/
// NOTE - Copy the array, because arr.sort() sorts in place!
export function medianArray(arr: number[]): number
{
  if (arr.length === 0) return 0;

  let copyArr = U.deepCopy(arr);

  copyArr.sort(function (a: number, b: number)
  {
    return a - b;
  });

  var half = Math.floor(copyArr.length / 2);

  if (copyArr.length % 2)
    return copyArr[half];

  return (copyArr[half - 1] + copyArr[half]) / 2.0;
}

export function initArray(n: number, value: any): any[]
{
  return Array.from(Array(n), () => value);
}