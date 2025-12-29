import type { LayoutConfig } from "../types";

// ============================================================================
// Layout Constants
// ============================================================================

export const DEFAULT_NODE_WIDTH = 260;
export const DEFAULT_NODE_HEIGHT = 120;

export const LAYOUT_DEFAULTS = {
  nodeSpacing: 100,
  rankSpacing: 150,
  gridColumns: 3,
  radialRadius: 200,
  fitViewPadding: 0.2,
  animationDuration: 300,
} as const;

// ============================================================================
// Preset Layout Configurations
// ============================================================================

export const LAYOUT_PRESETS: Record<string, LayoutConfig> = {
  // Hierarchical tree layouts
  treeVertical: {
    type: "dagre",
    direction: "TB",
    nodeSpacing: 120,
    rankSpacing: 180,
  },
  treeHorizontal: {
    type: "dagre",
    direction: "LR",
    nodeSpacing: 150,
    rankSpacing: 200,
  },
  treeBottomUp: {
    type: "dagre",
    direction: "BT",
    nodeSpacing: 120,
    rankSpacing: 180,
  },
  treeRightToLeft: {
    type: "dagre",
    direction: "RL",
    nodeSpacing: 150,
    rankSpacing: 200,
  },

  // Grid layout
  grid: {
    type: "grid",
    gridColumns: 3,
    nodeSpacing: 40,
    rankSpacing: 40,
  },
  gridCompact: {
    type: "grid",
    gridColumns: 4,
    nodeSpacing: 20,
    rankSpacing: 20,
  },
  gridWide: {
    type: "grid",
    gridColumns: 2,
    nodeSpacing: 60,
    rankSpacing: 60,
  },

  // Radial layout
  radial: {
    type: "radial",
    radialRadius: 200,
    nodeSpacing: 50,
  },
  radialCompact: {
    type: "radial",
    radialRadius: 150,
    nodeSpacing: 30,
  },
  radialWide: {
    type: "radial",
    radialRadius: 300,
    nodeSpacing: 80,
  },
} as const;

// ============================================================================
// Edge Styles
// ============================================================================

export const DEFAULT_EDGE_STYLE = {
  stroke: "rgba(150, 150, 150, 0.6)",
  strokeWidth: 1.5,
} as const;

export const EDGE_STYLES = {
  default: DEFAULT_EDGE_STYLE,
  highlighted: {
    stroke: "rgba(59, 130, 246, 0.8)",
    strokeWidth: 2,
  },
  subtle: {
    stroke: "rgba(150, 150, 150, 0.3)",
    strokeWidth: 1,
  },
  bold: {
    stroke: "rgba(100, 100, 100, 0.9)",
    strokeWidth: 3,
  },
} as const;

// ============================================================================
// Theme Constants
// ============================================================================

export const THEME = {
  background: {
    light: "#fafafa",
    dark: "#0a0a0a",
  },
  node: {
    background: {
      light: "rgba(255, 255, 255, 0.95)",
      dark: "rgba(20, 20, 20, 0.95)",
    },
    border: {
      light: "rgba(0, 0, 0, 0.1)",
      dark: "rgba(255, 255, 255, 0.1)",
    },
    text: {
      light: "#171717",
      dark: "#ededed",
    },
  },
} as const;
