# Graph

This library checks whether a district -- defined as a set of feature IDs -- is contiguous and (not) embedded within another district,
using a contiguity graph enhanced to include a border ring around the state
so that features on the edge of the state can be identified.

## Exports

These are used by DRA to determine whether districts meet the requirements of being contiguous and not embedded within other districts.

### isConnected

Checks whether a set of feature IDs is connnected in the contiguity graph.

``` TypeScript
export declare function isConnected(featureIDs: FeatureGroup, graph: ContiguityGraph): boolean;
```

### isEmbedded

Checks whether a set of features for one district are fully embedded within another district in the graph.

``` TypeScript
export declare function isEmbedded(districtID: number, featureIDs: FeatureGroup, plan: PlanByGeoID, graph: ContiguityGraph): boolean
```
