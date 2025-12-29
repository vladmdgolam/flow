"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  EngineNode,
  EngineEdge,
  LayoutConfig,
  UseLayoutOptions,
  UseLayoutResult,
  NodeData,
} from "../types";
import { applyLayout } from "../layouts";
import { LAYOUT_DEFAULTS } from "../constants";

export function useLayout<T extends NodeData = NodeData>({
  nodes,
  edges,
  config,
  enabled = true,
}: UseLayoutOptions): UseLayoutResult {
  const [layoutNodes, setLayoutNodes] = useState<EngineNode<T>[]>([]);
  const [isLayouting, setIsLayouting] = useState(false);

  const calculateLayout = useCallback(() => {
    if (!enabled || nodes.length === 0) {
      setLayoutNodes(nodes as EngineNode<T>[]);
      return;
    }

    setIsLayouting(true);

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      const result = applyLayout(nodes as EngineNode<T>[], edges, config);
      setLayoutNodes(result.nodes);
      setIsLayouting(false);
    });
  }, [nodes, edges, config, enabled]);

  // Recalculate layout when inputs change
  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  return {
    layoutNodes: layoutNodes as EngineNode[],
    layoutEdges: edges,
    isLayouting,
    recalculate: calculateLayout,
  };
}

export function useLayoutWithUnconnected<T extends NodeData = NodeData>(
  nodes: EngineNode<T>[],
  edges: EngineEdge[],
  config: LayoutConfig,
  enabled: boolean = true
): UseLayoutResult & { connectedNodes: EngineNode[]; unconnectedNodes: EngineNode[] } {
  const [layoutNodes, setLayoutNodes] = useState<EngineNode<T>[]>([]);
  const [isLayouting, setIsLayouting] = useState(false);

  // Separate connected and unconnected nodes
  const { connected, unconnected } = useMemo(() => {
    const connectedIds = new Set<string>();
    for (const edge of edges) {
      connectedIds.add(edge.source);
      connectedIds.add(edge.target);
    }

    const connectedNodes: EngineNode<T>[] = [];
    const unconnectedNodes: EngineNode<T>[] = [];

    for (const node of nodes) {
      if (connectedIds.has(node.id)) {
        connectedNodes.push(node);
      } else {
        unconnectedNodes.push(node);
      }
    }

    return { connected: connectedNodes, unconnected: unconnectedNodes };
  }, [nodes, edges]);

  const calculateLayout = useCallback(() => {
    if (!enabled || nodes.length === 0) {
      setLayoutNodes(nodes);
      return;
    }

    setIsLayouting(true);

    requestAnimationFrame(() => {
      // Layout connected nodes
      const connectedResult = applyLayout(connected, edges, config);

      // Calculate bounds of connected nodes
      let maxX = 0;
      for (const node of connectedResult.nodes) {
        const nodeRight = node.position.x + (node.measured?.width || 260);
        maxX = Math.max(maxX, nodeRight);
      }

      // Place unconnected nodes in a grid to the right
      const gridConfig: LayoutConfig = {
        type: "grid",
        gridColumns: 2,
        nodeSpacing: 40,
        rankSpacing: 40,
      };
      const unconnectedResult = applyLayout(unconnected, [], gridConfig);

      // Offset unconnected nodes to the right of connected nodes
      const marginBetween = 200;
      const offsetUnconnected = unconnectedResult.nodes.map((node) => ({
        ...node,
        position: {
          x: node.position.x + maxX + marginBetween,
          y: node.position.y,
        },
      }));

      setLayoutNodes([...connectedResult.nodes, ...offsetUnconnected]);
      setIsLayouting(false);
    });
  }, [nodes, edges, config, enabled, connected, unconnected]);

  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  return {
    layoutNodes: layoutNodes as EngineNode[],
    layoutEdges: edges,
    isLayouting,
    recalculate: calculateLayout,
    connectedNodes: connected as EngineNode[],
    unconnectedNodes: unconnected as EngineNode[],
  };
}
