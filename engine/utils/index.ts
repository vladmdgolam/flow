import type { EngineNode, EngineEdge, NodeData } from "../types";

// ============================================================================
// Node Utilities
// ============================================================================

export function createNode<T extends NodeData>(
  id: string,
  data: T,
  position: { x: number; y: number } = { x: 0, y: 0 },
  type: string = "default"
): EngineNode<T> {
  return {
    id,
    type,
    position,
    data,
  };
}

export function createEdge(
  source: string,
  target: string,
  id?: string
): EngineEdge {
  return {
    id: id || `${source}-${target}`,
    source,
    target,
  };
}

// ============================================================================
// Layout Utilities
// ============================================================================

export function getNodesBounds(nodes: EngineNode[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + (node.measured?.width || 260));
    maxY = Math.max(maxY, node.position.y + (node.measured?.height || 120));
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function getConnectedNodes(
  nodes: EngineNode[],
  edges: EngineEdge[]
): { connected: EngineNode[]; unconnected: EngineNode[] } {
  const connectedIds = new Set<string>();

  for (const edge of edges) {
    connectedIds.add(edge.source);
    connectedIds.add(edge.target);
  }

  const connected: EngineNode[] = [];
  const unconnected: EngineNode[] = [];

  for (const node of nodes) {
    if (connectedIds.has(node.id)) {
      connected.push(node);
    } else {
      unconnected.push(node);
    }
  }

  return { connected, unconnected };
}

// ============================================================================
// ID Generation
// ============================================================================

let nodeIdCounter = 0;
let edgeIdCounter = 0;

export function generateNodeId(prefix: string = "node"): string {
  return `${prefix}-${++nodeIdCounter}`;
}

export function generateEdgeId(prefix: string = "edge"): string {
  return `${prefix}-${++edgeIdCounter}`;
}

export function resetIdCounters(): void {
  nodeIdCounter = 0;
  edgeIdCounter = 0;
}

// ============================================================================
// Data Transformation
// ============================================================================

export function nodesFromData<T extends NodeData>(
  data: T[],
  idKey: keyof T = "id" as keyof T,
  nodeType: string = "card"
): EngineNode<T>[] {
  return data.map((item, index) => ({
    id: String(item[idKey] || `node-${index}`),
    type: nodeType,
    position: { x: 0, y: 0 },
    data: item,
  }));
}

export function edgesFromRelations<T extends NodeData & { connections?: string[] }>(
  nodes: EngineNode<T>[]
): EngineEdge[] {
  const edges: EngineEdge[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  for (const node of nodes) {
    const connections = node.data.connections || [];
    for (const targetId of connections) {
      if (nodeIds.has(targetId)) {
        edges.push(createEdge(node.id, targetId));
      }
    }
  }

  return edges;
}
