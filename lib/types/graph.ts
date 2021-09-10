//
// GRAPH TYPES
//

// An adjacency graph is:
//
//   * Either an unweighted list of neighbors or a dictionary of neighbors, where 
//     the value for each neighbor geoID key is the the length of the shared border
//   * The graph can contain an out-of-bounds ring around the nodes in the graph
//     proper, so you can detect border features

export type ContiguityGraph = {
  [geoID: string]: UnweightedNeighbors | WeightedNeighbors;
}

export type WeightedNeighbors = {
  [geoID: string]: number;
}

export type UnweightedNeighbors = string[];


// PLAN - Numeric districtIDs indexed by geoID strings

export type PlanByGeoID = {
  [geoID: string]: number;
}

// Or inverted = sets of geoIDs by numeric districtID
export type PlanByDistrictID = {
  [districtID: number]: Set<string>;
}


// GROUP - A set of features to check

export type FeatureGroup = Set<string>;

