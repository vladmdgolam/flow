"use client";

import { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type OnConnect,
  type NodeTypes,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type {
  EngineNode,
  EngineEdge,
  NodeEngineProps,
  LayoutConfig,
  NodeData,
} from "../types";
import { useLayout } from "../hooks/useLayout";
import { LAYOUT_PRESETS, DEFAULT_EDGE_STYLE, LAYOUT_DEFAULTS } from "../constants";
import { BaseNode } from "./BaseNode";
import { CardNode } from "./CardNode";
import { MinimalNode } from "./MinimalNode";

const defaultNodeTypes: NodeTypes = {
  default: BaseNode,
  base: BaseNode,
  card: CardNode,
  minimal: MinimalNode,
};

type NodeEngineInnerProps<T extends NodeData> = NodeEngineProps<T> & {
  layoutConfig: LayoutConfig;
};

function NodeEngineInner<T extends NodeData = NodeData>({
  nodes: inputNodes,
  edges: inputEdges,
  config,
  onNodesChange: onNodesChangeCallback,
  onEdgesChange: onEdgesChangeCallback,
  onConnect: onConnectCallback,
  onNodeClick,
  layoutConfig,
  className,
  children,
}: NodeEngineInnerProps<T>) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<EngineNode<T>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EngineEdge>([]);

  // Merge node types
  const nodeTypes = useMemo(
    () => ({
      ...defaultNodeTypes,
      ...(config?.nodeTypes || {}),
    }),
    [config?.nodeTypes]
  );

  // Calculate layout
  const { layoutNodes, isLayouting } = useLayout({
    nodes: inputNodes as EngineNode[],
    edges: inputEdges,
    config: layoutConfig,
    enabled: true,
  });

  // Update nodes when layout changes
  useEffect(() => {
    if (layoutNodes.length > 0) {
      setNodes(layoutNodes as EngineNode<T>[]);
      setEdges(inputEdges);

      // Fit view after layout
      if (config?.fitViewOnLayout !== false) {
        setTimeout(() => {
          fitView({
            padding: config?.fitViewPadding ?? LAYOUT_DEFAULTS.fitViewPadding,
            duration: config?.animationDuration ?? LAYOUT_DEFAULTS.animationDuration,
          });
        }, 50);
      }
    }
  }, [layoutNodes, inputEdges, setNodes, setEdges, fitView, config]);

  // Handle connections
  const handleConnect: OnConnect = useCallback(
    (connection) => {
      if (connection.source && connection.target) {
        const newEdge: EngineEdge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
        };
        setEdges((eds) => [...eds, newEdge]);
        onConnectCallback?.({ source: connection.source, target: connection.target });
      }
    },
    [setEdges, onConnectCallback]
  );

  // Handle node clicks
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: EngineNode<T>) => {
      onNodeClick?.(node);
    },
    [onNodeClick]
  );

  return (
    <div className={`w-full h-full ${className || ""}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          style: config?.defaultEdgeStyle || DEFAULT_EDGE_STYLE,
        }}
        fitView
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-neutral-100 dark:!bg-neutral-800"
        />
        {children}
      </ReactFlow>

      {/* Loading overlay */}
      {isLayouting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 shadow-lg">
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Calculating layout...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function NodeEngine<T extends NodeData = NodeData>(
  props: NodeEngineProps<T> & { layout?: keyof typeof LAYOUT_PRESETS | LayoutConfig }
) {
  // Resolve layout config from preset name or direct config
  const layoutConfig = useMemo(() => {
    if (!props.layout) {
      return props.config?.layout || LAYOUT_PRESETS.treeVertical;
    }
    if (typeof props.layout === "string") {
      return LAYOUT_PRESETS[props.layout] || LAYOUT_PRESETS.treeVertical;
    }
    return props.layout;
  }, [props.layout, props.config?.layout]);

  return (
    <ReactFlowProvider>
      <NodeEngineInner {...props} layoutConfig={layoutConfig} />
    </ReactFlowProvider>
  );
}
