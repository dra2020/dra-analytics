import * as FU from '../../testutil/fileutils';
import * as TU from '../../testutil/testfns';

import * as T from '../../lib/types/all'


describe('BG tests', () =>
{
  const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/SAMPLE-BG-graph.json");

  test('SAMPLE-BG-map.csv', () =>
  {
    const result = TU.testEmbeddedness("testdata/graph/SAMPLE-BG-map.csv", graph);

    expect(result).toBe(true);
  });

  test('SAMPLE-BG-map-hole.csv', () =>
  {
    const result = TU.testEmbeddedness("testdata/graph/SAMPLE-BG-map-hole.csv", graph);

    // District 1, Buncombe County (37021), is a donut hole w/in District 3.

    expect(result).toBe(false);
  });
});

describe('Grid tests', () =>
{
  const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/grid-graph.json");

  test('4-square', () =>
  {
    const result = TU.testEmbeddedness("testdata/graph/grid-4-square.csv", graph);

    expect(result).toBe(true);
  });
  test('stray-1', () =>
  {
    const result = TU.testEmbeddedness("testdata/graph/grid-stray-1.csv", graph);

    expect(result).toBe(true);
  });
  test('stray-2', () =>
  {
    const result = TU.testEmbeddedness("testdata/graph/grid-stray-2.csv", graph);

    expect(result).toBe(true);
  });
  test('corner', () =>
  {
    const result = TU.testEmbeddedness("testdata/graph/grid-corner.csv", graph);

    expect(result).toBe(true);
  });
  test('donut', () =>
  {
    const result = TU.testEmbeddedness("testdata/graph/grid-donut.csv", graph);

    expect(result).toBe(false);
  });
});
