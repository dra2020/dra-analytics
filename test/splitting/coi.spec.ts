import * as FU from '../../testutil/fileutils';

// import * as T from '../../lib/splitting/types'
import {uncertaintyOfMembership, effectiveSplits} from '../../lib/splitting/coi';


describe('COI splitting', () =>
{
  test('COI splitting', () =>
  {
    const splits1 = [0.33, 0.33, 0.34];
    expect(uncertaintyOfMembership(splits1)).toBeCloseTo(1.59, 1);
    expect(effectiveSplits(splits1)).toBeCloseTo(2.00);

    const splits2 = [0.92, 0.05, 0.03];
    expect(uncertaintyOfMembership(splits2)).toBeCloseTo(0.48, 1);
    expect(effectiveSplits(splits2)).toBeCloseTo(0.18);
  });
});