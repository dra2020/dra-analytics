import * as FU from '../../testutil/fileutils';
import * as TU from '../../testutil/testfns';

import * as T from '../../lib/graph/types'


describe('BG tests', () =>
{
  const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/SAMPLE-BG-graph.json");

  test('SAMPLE-BG-map.csv', () =>
  {
    const result = TU.testContiguity("testdata/graph/SAMPLE-BG-map.csv", graph);

    expect(result).toBe(true);
  });

  test('SAMPLE-BG-map-discontiguous.csv', () =>
  {
    const result = TU.testContiguity("testdata/graph/SAMPLE-BG-map-discontiguous.csv", graph);

    expect(result).toBe(false);
  });
});

describe('Grid tests', () =>
{
  const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/grid-graph.json");

  test('4-square', () =>
  {
    const result = TU.testContiguity("testdata/graph/grid-4-square.csv", graph);

    expect(result).toBe(true);
  });
  test('stray-1', () =>
  {
    const result = TU.testContiguity("testdata/graph/grid-stray-1.csv", graph);

    expect(result).toBe(false);
  });
  test('stray-2', () =>
  {
    const result = TU.testContiguity("testdata/graph/grid-stray-2.csv", graph);

    expect(result).toBe(false);
  });
  test('corner', () =>
  {
    const result = TU.testContiguity("testdata/graph/grid-corner.csv", graph);

    expect(result).toBe(true);
  });
  test('donut', () =>
  {
    const result = TU.testContiguity("testdata/graph/grid-donut.csv", graph);

    expect(result).toBe(true);
  });
});


// OPERATIONAL CONTIGUITY TESTS

/*
describe('AK state houses', () =>
{
  test('raw graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/AK/block_contiguity_unmodified.json");
    const result1 = TU.testContiguity("testdata/graph/examples/AK/02_AK_SLDL_2018.csv", graph);
    // Districts have non-numeric ids
    // const result2 = TU.testContiguity("testdata/graph/examples/AK/02_AK_SLDU_2018.csv", graph);

    expect(result1).toBe(false);
    // expect(result2).toBe(false);
  });
  test('modified graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/AK/block_contiguity.json");
    const result1 = TU.testContiguity("testdata/graph/examples/AK/02_AK_SLDL_2018.csv", graph);
        // Districts have non-numeric ids
    // const result2 = TU.testContiguity("testdata/graph/examples/AK/02_AK_SLDU_2018.csv", graph);

    expect(result1).toBe(true);
    // expect(result2).toBe(true);
  });
});
*/

/*
describe('CA 116th CD', () =>
{
  test('raw graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/CA/block_contiguity_unmodified.json");
    const result = TU.testContiguity("testdata/graph/examples/CA/06_CA_CD116.csv", graph);

    expect(result).toBe(false);
  });
  // TODO: This modified block graph for CA does NOT have enough connectivity!
  // test('modified graph', () =>
  // {
  //   const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/CA/block_contiguity.json");
  //   const result = TU.testContiguity("testdata/graph/examples/CA/06_CA_CD116.csv", graph);

  //   expect(result).toBe(true);
  // });
});
*/

/*
describe('FL 116th CD', () =>
{
  test('raw graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/FL/block_contiguity_unmodified.json");
    const result = TU.testContiguity("testdata/graph/examples/FL/12_FL_CD116.csv", graph);

    expect(result).toBe(false);
  });
  test('modified graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/FL/block_contiguity.json");
    const result = TU.testContiguity("testdata/graph/examples/FL/12_FL_CD116.csv", graph);

    expect(result).toBe(true);
  });
});
*/

/*
describe('HI 116th CD', () =>
{
  test('raw graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/HI/block_contiguity_unmodified.json");
    const result = TU.testContiguity("testdata/graph/examples/HI/15_HI_CD116.csv", graph);

    expect(result).toBe(false);
  });
  // TODO: This modified block graph for HI does NOT have enough connectivity!
  // test('modified graph', () =>
  // {
  //   const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/HI/block_contiguity.json");
  //   const result = TU.testContiguity("testdata/graph/examples/HI/15_HI_CD116.csv", graph);

  //   expect(result).toBe(true);
  // });
});
*/

/*
describe('RI 116th CD', () =>
{
  test('raw graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/RI/block_contiguity_unmodified.json");
    const result = TU.testContiguity("testdata/graph/examples/RI/44_RI_CD116.csv", graph);

    expect(result).toBe(false);
  });
  test('modified graph', () =>
  {
    const graph: T.ContiguityGraph = FU.readJSON("testdata/graph/examples/RI/block_contiguity.json");
    const result = TU.testContiguity("testdata/graph/examples/RI/44_RI_CD116.csv", graph);

    expect(result).toBe(true);
  });
});
*/
