//
// GENERAL UTILITIES
//

// Deal with decimal census "counts" due to disagg/re-agg
export function areRoughlyEqual(x: number, y: number, tolerance: number): boolean
{
  let delta = Math.abs(x - y);
  let result = (delta < tolerance) ? true : false;

  return result;
}

export function deepCopy(src: any): any
{
  if (Array.isArray(src))
  {
    let dst: any[] = [];

    for (let i: number = 0; i < src.length; i++)
      dst.push(deepCopy(src[i]));
    return dst;
  }
  else if (typeof src === 'object')
  {
    let dst: any = {};
    for (var p in src) if (src.hasOwnProperty(p))
      dst[p] = deepCopy(src[p]);
    return dst;
  }
  else
    return src;
}