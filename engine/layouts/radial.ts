import type {
  EngineNode,
  EngineEdge,
  LayoutConfig,
  LayoutResult,
  NodeData,
} from "../types";
import { LAYOUT_DEFAULTS } from "../constants";

export function applyRadialLayout<T extends NodeData>(
  nodes: EngineNode<T>[],
  edges: EngineEdge[],
  config: LayoutConfig
): LayoutResult<T> {
  if (nodes.length === 0) {
    return { nodes: [], edges };
  }

  const radius = config.radialRadius || LAYOUT_DEFAULTS.radialRadius;
  const centerX = config.centerX || 0;
  const centerY = config.centerY || 0;

  // If only one node, place at center
  if (nodes.length === 1) {
    return {
      nodes: [{ ...nodes[0], position: { x: centerX, y: centerY } }],
      edges,
    };
  }

  // For connected graphs, find the root node (most connections)
  const connectionCount = new Map<string, number>();
  for (const edge of edges) {
    connectionCount.set(
      edge.source,
      (connectionCount.get(edge.source) || 0) + 1
    );
    connectionCount.set(
      edge.target,
      (connectionCount.get(edge.target) || 0) + 1
    );
  }

  // Sort nodes: root first (most connections), then others
  const sortedNodes = [...nodes].sort((a, b) => {
    const aCount = connectionCount.get(a.id) || 0;
    const bCount = connectionCount.get(b.id) || 0;
    return bCount - aCount;
  });

  const layoutNodes = sortedNodes.map((node, index) => {
    if (index === 0 && edges.length > 0) {
      // Place root at center
      return {
        ...node,
        position: { x: centerX, y: centerY },
      };
    }

    // Distribute remaining nodes in a circle
    const angle = ((index - (edges.length > 0 ? 1 : 0)) / (nodes.length - (edges.length > 0 ? 1 : 0))) * 2 * Math.PI;
    const currentRadius = edges.length > 0 ? radius : radius * 0.5;

    return {
      ...node,
      position: {
        x: centerX + Math.cos(angle) * currentRadius,
        y: centerY + Math.sin(angle) * currentRadius,
      },
    };
  });

  return { nodes: layoutNodes, edges };
}

export function applyConcentricLayout<T extends NodeData>(
  nodes: EngineNode<T>[],
  edges: EngineEdge[],
  config: LayoutConfig
): LayoutResult<T> {
  if (nodes.length === 0) {
    return { nodes: [], edges };
  }

  const baseRadius = config.radialRadius || LAYOUT_DEFAULTS.radialRadius;
  const centerX = config.centerX || 0;
  const centerY = config.centerY || 0;

  // Group nodes by connection depth
  const nodeDepth = new Map<string, number>();
  const visited = new Set<string>();
  const adjacency = new Map<string, string[]>();

  // Build adjacency list
  for (const edge of edges) {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
    adjacency.get(edge.source)!.push(edge.target);
    adjacency.get(edge.target)!.push(edge.source);
  }

  // BFS to assign depths
  const rootNode = nodes[0];
  nodeDepth.set(rootNode.id, 0);
  visited.add(rootNode.id);
  const queue = [rootNode.id];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDepth = nodeDepth.get(current)!;
    const neighbors = adjacency.get(current) || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        nodeDepth.set(neighbor, currentDepth + 1);
        queue.push(neighbor);
      }
    }
  }

  // Assign depth 0 to unvisited nodes
  for (const node of nodes) {
    if (!nodeDepth.has(node.id)) {
      nodeDepth.set(node.id, 0);
    }
  }

  // Group by depth
  const depthGroups = new Map<number, EngineNode<T>[]>();
  for (const node of nodes) {
    const depth = nodeDepth.get(node.id) || 0;
    if (!depthGroups.has(depth)) depthGroups.set(depth, []);
    depthGroups.get(depth)!.push(node);
  }

  // Position nodes
  const layoutNodes: EngineNode<T>[] = [];

  for (const [depth, groupNodes] of depthGroups) {
    const radius = depth === 0 ? 0 : baseRadius * depth;
    const angleStep = (2 * Math.PI) / groupNodes.length;

    for (let i = 0; i < groupNodes.length; i++) {
      const angle = i * angleStep;
      layoutNodes.push({
        ...groupNodes[i],
        position: {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        },
      });
    }
  }

  return { nodes: layoutNodes, edges };
}
