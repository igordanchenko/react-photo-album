import MinHeap, { RankingFunctionComparator } from "./heap";

type Element = string;

type HeapElement = {
    id: string;
    weight: number;
};

type ElementToElementMap = {
    [key: Element]: Element;
};

type ElementToNumberMap = {
    [key: Element]: number;
};

type GraphFunction = (node: string) => { [key: string]: number };

const buildPrecedentsMap = (graph: GraphFunction, startNode: Element, endNode: Element) => {
    // store the previous vertex of the shortest path of arrival
    const precedentsMap: ElementToElementMap = {};

    // store nodes already visited
    const visited: ElementToNumberMap = {};

    // store/update only the shortest edge weights measured
    // the purpose of this is object is constant time lookup vs. binary heap lookup O(n)
    const storedShortestPaths: ElementToNumberMap = {};
    storedShortestPaths[startNode] = 0;

    // priority queue of ALL nodes and storedShortestPaths
    // don't bother to delete them because it's faster to look at visited?
    const pQueue = MinHeap<HeapElement>(RankingFunctionComparator((el: HeapElement): number => el.weight));
    pQueue.push({ id: startNode, weight: 0 });

    let shortestNode;
    // pop a node with the shortest total weight from start node
    while ((shortestNode = pQueue.pop()) !== undefined) {
        const shortestNodeId = shortestNode.id;

        // if already visited, continue
        if (visited[shortestNodeId]) continue;

        // visit neighboring nodes
        const neighboringNodes = graph(shortestNodeId);
        visited[shortestNodeId] = 1;

        // meet the neighbors, looking for shorter paths
        for (const neighbor in neighboringNodes) {
            // weight of path from startNode to this neighbor
            const newTotalWeight = shortestNode.weight + neighboringNodes[neighbor];

            // if this is the first time meeting the neighbor OR if the new total weight from
            // start node to this neighbor node is greater than the old weight path, update it,
            // and update precedent node
            //
            // introducing deterministic tiebreaker to guard against edge cases where path weight difference can be
            // as low as 1e-12, which leads to visual flickering during subsequent re-renders as layout continues to
            // shift back and forth
            if (
                storedShortestPaths[neighbor] === undefined ||
                (storedShortestPaths[neighbor] > newTotalWeight &&
                    (storedShortestPaths[neighbor] / newTotalWeight > 1.005 ||
                        precedentsMap[neighbor] < shortestNodeId))
            ) {
                storedShortestPaths[neighbor] = newTotalWeight;
                pQueue.push({ id: neighbor, weight: newTotalWeight });
                precedentsMap[neighbor] = shortestNodeId;
            }
        }
    }

    if (typeof storedShortestPaths[endNode] === "undefined") {
        // encountered impossible layout
        return undefined;
    }

    return precedentsMap;
};

// build the route from precedent node vertices
const getPathFromPrecedentsMap = (precedentsMap: ElementToElementMap, endNode: Element) => {
    const nodes = [];
    let n = endNode;
    while (n) {
        nodes.push(n);
        n = precedentsMap[n];
    }
    return nodes.reverse();
};

// build the precedentsMap and find the shortest path from it
export const findShortestPath = (graph: GraphFunction, startNode: Element, endNode: Element) => {
    const precedentsMap = buildPrecedentsMap(graph, startNode, endNode);
    return precedentsMap !== undefined ? getPathFromPrecedentsMap(precedentsMap, endNode) : undefined;
};
