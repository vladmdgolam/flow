import type {
  EngineNode,
  EngineEdge,
  LayoutConfig,
  LayoutResult,
  NodeData,
} from "../types";
import { applyDagreLayout } from "./dagre";
import { applyGridLayout, applyMasonryLayout } from "./grid";
import { applyRadialLayout, applyConcentricLayout } from "./radial";

export { applyDagreLayout } from "./dagre";
export { applyGridLayout, applyMasonryLayout } from "./grid";
export { applyRadialLayout, applyConcentricLayout } from "./radial";

export function applyLayout<T extends NodeData>(
  nodes: EngineNode<T>[],
  edges: EngineEdge[],
  config: LayoutConfig
): LayoutResult<T> {
  switch (config.type) {
    case "dagre":
      return applyDagreLayout(nodes, edges, config);
    case "grid":
      return applyGridLayout(nodes, edges, config);
    case "radial":
      return applyRadialLayout(nodes, edges, config);
    case "force":
      // Force layout would require animation loop - fallback to radial
      return applyRadialLayout(nodes, edges, config);
    case "manual":
      // Manual layout doesn't change positions
      return { nodes, edges };
    default:
      return applyDagreLayout(nodes, edges, config);
  }
}
