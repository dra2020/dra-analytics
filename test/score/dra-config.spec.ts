import * as C from '../../lib/score/dra-config';

describe('Population deviation range', () =>
{
  test('Congressional districts', () =>
  {
    const bLegislative: boolean = false;
    const range: number[] = C.popdevRange(bLegislative);

    expect(range[C.BEG]).toBeCloseTo(0.0075);
    expect(range[C.END]).toBeCloseTo(0.0020);
  });
  test('State legislative districts', () =>
  {
    const bLegislative: boolean = true;
    const range: number[] = C.popdevRange(bLegislative);

    expect(range[C.BEG]).toBeCloseTo(0.10);
    expect(range[C.END]).toBeCloseTo(0.0267);
  });
});
