import * as T from '../../lib/types/all'
import * as S from '../../lib/rate/settings';

import
{
  estSeats,                      // NOTE - Just a sum over a tested fn; no tests
  estSeatShare,                  // NOTE - Just a division; no tests
  estDeviation,                  // NOTE - Just a subtraction; no tests
  estUnearnedSeats,              // NOTE - Just a subtraction; no tests
} from '../../lib/partisan/bias'