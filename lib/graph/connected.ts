//
// CONTIGUOUS - Is a district in a plan fully connected?
//

import * as T from './types'
import * as G from './utils';


export function isConnected(featureIDs: T.FeatureGroup, graph: T.ContiguityGraph, bLog: boolean = false): boolean
{
  let visited = new Set<string>();
  let toProcess: string[] = [];

  // Start processing with the first feature in the set
  let iter = featureIDs.values();
  toProcess.push(iter.next().value);

  // While there are features in the set that haven't been processed,
  // i.e., stop when you've visited all the features in the set
  while (toProcess.length > 0)
  {
    // Grab a feature and process it
    let node = toProcess.pop() as string;
    visited.add(node);

    // Get its actual neighbors in the graph proper, i.e., ignore any virtual 
    // out-of-bounds neighbors
    let actualNeighbors = G.neighbors(node, graph).filter(x => (!G.isOutOfBounds(x)));

    // Add neighbors to visit, if they're in the same set & haven't already been visited
    let neighborsToVisit = actualNeighbors.filter(x => featureIDs.has(x) && (!visited.has(x)));
    toProcess.push(...neighborsToVisit);
  }

  const bConnected = visited.size == featureIDs.size;

  if (bLog && !bConnected)
  {
    const difference = new Set([...featureIDs.values()].filter(x => !visited.has(x)));
    console.log("Disconnected feature IDs that haven't been visited: ", difference);
  }

  return bConnected;
}
