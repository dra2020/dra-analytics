import * as FU from '../../testutil/fileutils';
import * as GeoJSON from 'geojson';

import {scoreFeatureSet} from '../../lib/compactness/kiwysi';
import {featureizePoly} from '../../lib/compactness/features';

import * as T from '../../lib/types/all'


// TEST SCORING REFERENCE FEATURE-IZED SHAPES

describe('Score the feature sets for the first 20 reference shapes', () =>
{
  const featureEntries = FU.readFeatureSets('testdata/compactness/first20/smartfeats_first20.csv');

  test('Loop', () =>
  {
    for (let i in featureEntries)
    {
      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const featureSet: T.CompactnessFeatures = featureEntry.features;
      const score: number = featureEntry.score;

      const prediction: number = scoreFeatureSet(featureSet, T.PCAModel.Original);

      expect(prediction).toBeCloseTo(score);
    }
  });
});

describe('Score the feature sets for the evenly spaced 20 reference shapes', () =>
{
  const featureEntries = FU.readFeatureSets('testdata/compactness/evenlyspaced20/evenlyspaced20.csv');

  test('Loop', () =>
  {
    for (let i in featureEntries)
    {
      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const featureSet: T.CompactnessFeatures = featureEntry.features;
      const score: number = featureEntry.score;

      const prediction: number = scoreFeatureSet(featureSet, T.PCAModel.Revised);

      expect(prediction).toBeCloseTo(score);
    }
  });
});


// TEST FEATURE-IZING REFERENCE SHAPES 

describe('Feature-ize the first 20 reference shapes', () =>
{
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/compactness/first20/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/compactness/first20/first20.shp');

    for (let i = 0; i < shapes.features.length; i++)
    {
      const correct = featureEntries[i].features;
      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);

      // Compare computed feature values to the correct answers
      expect(features.reock).toBeCloseTo(correct.reock);
      expect(features.polsby).toBeCloseTo(correct.polsby);
      expect(features.hull).toBeCloseTo(correct.hull);
      // TODO - Why is only one digit matching?
      expect(features.schwartzberg).toBeCloseTo(correct.schwartzberg, 1);

      expect(features.sym_x).toBeCloseTo(correct.sym_x);
      // TODO - Why is only one digit matching?
      expect(features.sym_y).toBeCloseTo(correct.sym_y, 1);

      expect(features.bbox).toBeCloseTo(correct.bbox);
    }
  });
});


describe('Feature-ize the evenly-spaced 20 reference shapes', () =>
{
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/compactness/evenlyspaced20/evenlyspaced20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/compactness/evenlyspaced20/evenlyspaced20.shp');

    const start = 0;
    for (let i = start; i < shapes.features.length; i++)
    {
      const correct = featureEntries[i].features;
      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);

      // Compare computed feature values to the correct answers
      expect(features.reock).toBeCloseTo(correct.reock);
      expect(features.polsby).toBeCloseTo(correct.polsby);
      expect(features.hull).toBeCloseTo(correct.hull);
      // TODO - Why is only one digit matching?
      expect(features.schwartzberg).toBeCloseTo(correct.schwartzberg, 1);

      expect(features.sym_x).toBeCloseTo(correct.sym_x);
      // TODO - Why is only one digit matching?
      expect(features.sym_y).toBeCloseTo(correct.sym_y, 1);

      expect(features.bbox).toBeCloseTo(correct.bbox);
    }
  });
});


// TEST SCORING REFERENCE SHAPES (FEATURE-IZE + SCORE)

describe('Score the first 20 reference shapes', () =>
{
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/compactness/first20/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/compactness/first20/first20.shp');

    for (let i in featureEntries)
    {
      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);

      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const score: number = featureEntry.score;

      const prediction: number = scoreFeatureSet(features, T.PCAModel.Original);

      // TODO - Why is only one digit matching?
      expect(prediction).toBeCloseTo(score, 1);
    }
  });
});

describe('Score the evenly spaced 20 reference shapes', () =>
{
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/compactness/evenlyspaced20/evenlyspaced20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/compactness/evenlyspaced20/evenlyspaced20.shp');

    for (let i in featureEntries)
    {
      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);

      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const score: number = featureEntry.score;

      const prediction: number = scoreFeatureSet(features, T.PCAModel.Revised);

      // TODO - Why is only one digit matching?
      expect(prediction).toBeCloseTo(score, 0);
    }
  });
});
