import {Normalizer} from '../../lib/score/normalize';


describe('Normalizer class', () =>
{
  // Identity test
  test('Identity', () =>
  {
    const x = Math.random();
    const n = new Normalizer(x);
    n.identity();
    expect(n.wipNum).toBeCloseTo(x);
  });


  // Invert tests
  test('Invert: in range', () =>
  {
    const n = new Normalizer(0.75 / 100);
    n.invert();
    expect(n.wipNum).toBeCloseTo(0.9925);
  });

  test('Invert: min', () =>
  {
    const n = new Normalizer(0.0);
    n.invert();
    expect(n.wipNum).toBeCloseTo(1.0);
  });

  test('Invert: max', () =>
  {
    const n = new Normalizer(1.0);
    n.invert();
    expect(n.wipNum).toBeCloseTo(0.0);
  });


  // Clip tests
  test('Clip: in range', () =>
  {
    const n = new Normalizer(0.3773);
    n.clip(0.25, 0.50);
    expect(n.wipNum).toBeCloseTo(0.3773);
  });

  test('Clip: too low', () =>
  {
    const n = new Normalizer(0.2);
    n.clip(0.25, 0.50);
    expect(n.wipNum).toBeCloseTo(0.25);
  });

  test('Clip: too high', () =>
  {
    const n = new Normalizer(0.55);
    n.clip(0.25, 0.50);
    expect(n.wipNum).toBeCloseTo(0.5);
  });

  test('Clip: min', () =>
  {
    const n = new Normalizer(0.25);
    n.clip(0.25, 0.50);
    expect(n.wipNum).toBeCloseTo(0.25);
  });

  test('Clip: max', () =>
  {
    const n = new Normalizer(0.5);
    n.clip(0.25, 0.50);
    expect(n.wipNum).toBeCloseTo(0.5);
  });


  // Rebase tests
  test('Rebase: at baseline', () =>
  {
    const n = new Normalizer(1.0);
    n.rebase(1.0);
    expect(n.wipNum).toBeCloseTo(0.0);
  });

  test('Rebase: above baseline', () =>
  {
    const n = new Normalizer(1.5);
    n.rebase(1.0);
    expect(n.wipNum).toBeCloseTo(0.5);
  });

  test('Rebase: below baseline', () =>
  {
    const n = new Normalizer(0.5);
    n.rebase(1.0);
    expect(n.wipNum).toBeCloseTo(-0.5);
  });

  test('Rebase: negative', () =>
  {
    const n = new Normalizer(-2.0);
    n.rebase(1.0);
    expect(n.wipNum).toBeCloseTo(-3.0);
  });


  // Unitize tests
  test('Unitize: in range', () =>
  {
    const n = new Normalizer(1.5);
    n.unitize(1.0, 2.0);
    expect(n.wipNum).toBeCloseTo(0.5);
  });

  test('Unitize: min', () =>
  {
    const n = new Normalizer(1.0);
    n.unitize(1.0, 2.0);
    expect(n.wipNum).toBeCloseTo(0.0);
  });

  test('Unitize: max', () =>
  {
    const n = new Normalizer(2.0);
    n.unitize(1.0, 2.0);
    expect(n.wipNum).toBeCloseTo(1.0);
  });


  // Decay tests
  test('Decay: in range', () =>
  {
    const n = new Normalizer(0.90);
    n.decay();
    expect(n.wipNum).toBeCloseTo(0.81);
  });

  test('Decay: min', () =>
  {
    const n = new Normalizer(0.00);
    n.decay();
    expect(n.wipNum).toBeCloseTo(0.0);
  });

  test('Decay: max', () =>
  {
    const n = new Normalizer(1.00);
    n.decay();
    expect(n.wipNum).toBeCloseTo(1.00);
  });


  // Rescale tests
  test('Rescale: in range', () =>
  {
    const n = new Normalizer(0.63);
    n.rescale();
    expect(n.normalizedNum).toBe(63);
  });

  test('Rescale: round up', () =>
  {
    const n = new Normalizer(0.6372);
    n.rescale();
    expect(n.normalizedNum).toBe(64);
  });

  test('Rescale: round down', () =>
  {
    const n = new Normalizer(0.6312);
    n.rescale();
    expect(n.normalizedNum).toBe(63);
  });

  test('Rescale: min', () =>
  {
    const n = new Normalizer(0.0);
    n.rescale();
    expect(n.normalizedNum).toBe(0);
  });

  test('Rescale: round down', () =>
  {
    const n = new Normalizer(1.0);
    n.rescale();
    expect(n.normalizedNum).toBe(100);
  });
});
