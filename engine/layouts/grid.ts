import type {
  EngineNode,
  EngineEdge,
  LayoutConfig,
  LayoutResult,
  NodeData,
} from "../types";
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, LAYOUT_DEFAULTS } from "../constants";

export function applyGridLayout<T extends NodeData>(
  nodes: EngineNode<T>[],
  edges: EngineEdge[],
  config: LayoutConfig
): LayoutResult<T> {
  if (nodes.length === 0) {
    return { nodes: [], edges };
  }

  const columns = config.gridColumns || LAYOUT_DEFAULTS.gridColumns;
  const spacingX = config.nodeSpacing || 40;
  const spacingY = config.rankSpacing || 40;

  const layoutNodes = nodes.map((node, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const width = node.measured?.width || DEFAULT_NODE_WIDTH;
    const height = node.measured?.height || DEFAULT_NODE_HEIGHT;

    return {
      ...node,
      position: {
        x: col * (width + spacingX),
        y: row * (height + spacingY),
      },
    };
  });

  return { nodes: layoutNodes, edges };
}

export function applyMasonryLayout<T extends NodeData>(
  nodes: EngineNode<T>[],
  edges: EngineEdge[],
  config: LayoutConfig
): LayoutResult<T> {
  if (nodes.length === 0) {
    return { nodes: [], edges };
  }

  const columns = config.gridColumns || LAYOUT_DEFAULTS.gridColumns;
  const spacingX = config.nodeSpacing || 40;
  const spacingY = config.rankSpacing || 40;

  // Track the height of each column
  const columnHeights = new Array(columns).fill(0);
  const columnWidth = DEFAULT_NODE_WIDTH + spacingX;

  const layoutNodes = nodes.map((node) => {
    // Find the shortest column
    const minHeight = Math.min(...columnHeights);
    const col = columnHeights.indexOf(minHeight);

    const height = node.measured?.height || DEFAULT_NODE_HEIGHT;
    const position = {
      x: col * columnWidth,
      y: columnHeights[col],
    };

    // Update column height
    columnHeights[col] += height + spacingY;

    return {
      ...node,
      position,
    };
  });

  return { nodes: layoutNodes, edges };
}
