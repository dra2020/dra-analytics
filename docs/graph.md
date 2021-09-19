# Graph

This library checks whether a district (a set of feature IDs) is contiguous and (not) embedded within another district,
using a contiguity graph enhanced to include the border ring around the state.

## Exports

### isConnected

Checks whether a set of feature IDs is connnected in the contiguity graph.

``` TypeScript
export declare function isConnected(featureIDs: FeatureGroup, graph: ContiguityGraph): boolean;
```

### isEmbedded

Checks whether a set of features for one district are fully embedded within another district in a plan.

``` TypeScript
export declare function isEmbedded(districtID: number, featureIDs: FeatureGroup, plan: PlanByGeoID, graph: ContiguityGraph): boolean
```
