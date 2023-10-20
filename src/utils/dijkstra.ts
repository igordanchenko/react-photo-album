import MinHeap, { rankingFunctionComparator } from "./heap";

export type GraphFunction<T> = (node: T) => Map<T, number>;

function buildPrecedentsMap<T>(graph: GraphFunction<T>, startNode: T, endNode: T) {
  // store the previous vertex of the shortest path of arrival
  const precedentsMap = new Map<T, T>();

  // store nodes already visited
  const visited = new Set<T>();

  // store/update only the shortest edge weights measured
  // the purpose of this is object is constant time lookup vs. binary heap lookup O(n)
  const storedShortestPaths = new Map<T, number>();
  storedShortestPaths.set(startNode, 0);

  // priority queue of ALL nodes and storedShortestPaths
  const queue = new MinHeap<{ id: T; weight: number }>(rankingFunctionComparator((el) => el.weight));
  queue.push({ id: startNode, weight: 0 });

  // pop a node with the shortest total weight from start node
  while (queue.size() > 0) {
    const { id, weight } = queue.pop()!;

    // if already visited, continue
    if (!visited.has(id)) {
      // visit neighboring nodes
      const neighboringNodes = graph(id);
      visited.add(id);

      // meet the neighbors, looking for shorter paths
      neighboringNodes.forEach((neighborWeight, neighbor) => {
        // weight of path from startNode to this neighbor
        const newWeight = weight + neighborWeight;

        // if this is the first time meeting the neighbor OR if the new total weight from
        // start node to this neighbor node is greater than the old weight path, update it,
        // and update precedent node
        //
        // introducing deterministic tiebreaker to guard against edge cases where path weight difference can be
        // as low as 1e-12, which leads to visual flickering during subsequent re-renders as layout continues to
        // shift back and forth
        const currentId = precedentsMap.get(neighbor);
        const currentWeight = storedShortestPaths.get(neighbor);
        if (
          currentWeight === undefined ||
          (currentWeight > newWeight &&
            (currentWeight / newWeight > 1.005 || (currentId !== undefined && currentId! < id)))
        ) {
          storedShortestPaths.set(neighbor, newWeight);
          queue.push({ id: neighbor, weight: newWeight });
          precedentsMap.set(neighbor, id);
        }
      });
    }
  }

  return storedShortestPaths.has(endNode) ? precedentsMap : undefined;
}

// build the route from precedent node vertices
function getPathFromPrecedentsMap<T>(precedentsMap: Map<T, T>, endNode: T) {
  const nodes = [];
  for (let node: T | undefined = endNode; node !== undefined; node = precedentsMap.get(node)) {
    nodes.push(node);
  }
  return nodes.reverse();
}

// build the precedentsMap and find the shortest path from it
export default function findShortestPath<T>(graph: GraphFunction<T>, startNode: T, endNode: T) {
  const precedentsMap = buildPrecedentsMap(graph, startNode, endNode);
  return precedentsMap ? getPathFromPrecedentsMap(precedentsMap, endNode) : undefined;
}
