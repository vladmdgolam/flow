import Dagre from "@dagrejs/dagre";
import type {
  EngineNode,
  EngineEdge,
  LayoutConfig,
  LayoutResult,
  NodeData,
} from "../types";
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, LAYOUT_DEFAULTS } from "../constants";

export function applyDagreLayout<T extends NodeData>(
  nodes: EngineNode<T>[],
  edges: EngineEdge[],
  config: LayoutConfig
): LayoutResult<T> {
  if (nodes.length === 0) {
    return { nodes: [], edges };
  }

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const direction = config.direction || "TB";
  const nodeSpacing = config.nodeSpacing || LAYOUT_DEFAULTS.nodeSpacing;
  const rankSpacing = config.rankSpacing || LAYOUT_DEFAULTS.rankSpacing;

  g.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to the graph
  for (const node of nodes) {
    const width = node.measured?.width || DEFAULT_NODE_WIDTH;
    const height = node.measured?.height || DEFAULT_NODE_HEIGHT;
    g.setNode(node.id, { width, height });
  }

  // Add edges to the graph
  for (const edge of edges) {
    // Only add edge if both source and target exist
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  // Run the layout
  Dagre.layout(g);

  // Apply positions back to nodes
  const layoutNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    const width = node.measured?.width || DEFAULT_NODE_WIDTH;
    const height = node.measured?.height || DEFAULT_NODE_HEIGHT;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutNodes, edges };
}
