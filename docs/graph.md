# Graph

This library checks that districts
are contiguous and not embedded within other districts.

## Exports

### isConnected

``` TypeScript
export declare function isConnected(featureIDs: T.FeatureGroup, graph: T.ContiguityGraph): boolean;
```

Checks whether a set of feature IDs is connnected in the contiguity graph.

### isEmbedded

``` TypeScript
export declare function isEmbedded(districtID: number, featureIDs: T.FeatureGroup, plan: T.PlanByGeoID, graph: T.ContiguityGraph): boolean
```

Checks whether a set of features for one district are fully embedded within another district in a plan.
