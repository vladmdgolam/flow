import type { Node, Edge, NodeProps } from "@xyflow/react";

// ============================================================================
// Core Node Types
// ============================================================================

export type NodeData = {
  label: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type EngineNode<T extends NodeData = NodeData> = Node<T>;
export type EngineEdge = Edge;

// ============================================================================
// Layout Types
// ============================================================================

export type LayoutDirection = "TB" | "BT" | "LR" | "RL";

export type LayoutType = "dagre" | "grid" | "radial" | "force" | "manual";

export type LayoutConfig = {
  type: LayoutType;
  direction?: LayoutDirection;
  nodeSpacing?: number;
  rankSpacing?: number;
  gridColumns?: number;
  radialRadius?: number;
  centerX?: number;
  centerY?: number;
};

export type LayoutResult<T extends NodeData = NodeData> = {
  nodes: EngineNode<T>[];
  edges: EngineEdge[];
};

// ============================================================================
// Engine Configuration
// ============================================================================

export type EngineConfig = {
  layout: LayoutConfig;
  nodeTypes?: Record<string, React.ComponentType<NodeProps<NodeData>>>;
  edgeTypes?: Record<string, React.ComponentType>;
  defaultNodeStyle?: React.CSSProperties;
  defaultEdgeStyle?: React.CSSProperties;
  fitViewOnLayout?: boolean;
  fitViewPadding?: number;
  animationDuration?: number;
};

// ============================================================================
// Card Types (for example usage)
// ============================================================================

export type CardType = "article" | "image" | "video" | "note" | "link";

export type CardData = NodeData & {
  cardType: CardType;
  author?: string;
  createdAt?: string;
  tags?: string[];
  connections?: string[];
};

// ============================================================================
// API Types
// ============================================================================

export type ApiResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ============================================================================
// Hook Types
// ============================================================================

export type UseLayoutOptions = {
  nodes: EngineNode[];
  edges: EngineEdge[];
  config: LayoutConfig;
  enabled?: boolean;
};

export type UseLayoutResult = {
  layoutNodes: EngineNode[];
  layoutEdges: EngineEdge[];
  isLayouting: boolean;
  recalculate: () => void;
};

// ============================================================================
// Component Props
// ============================================================================

export type NodeEngineProps<T extends NodeData = NodeData> = {
  nodes: EngineNode<T>[];
  edges: EngineEdge[];
  config?: Partial<EngineConfig>;
  onNodesChange?: (nodes: EngineNode<T>[]) => void;
  onEdgesChange?: (edges: EngineEdge[]) => void;
  onConnect?: (connection: { source: string; target: string }) => void;
  onNodeClick?: (node: EngineNode<T>) => void;
  className?: string;
  children?: React.ReactNode;
};

export type BaseNodeProps<T extends NodeData = NodeData> = NodeProps<T> & {
  isHighlighted?: boolean;
};
