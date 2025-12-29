"use client";

import { LAYOUT_PRESETS } from "../constants";
import type { LayoutConfig, LayoutType } from "../types";

type LayoutToolbarProps = {
  currentLayout: string;
  onLayoutChange: (layout: keyof typeof LAYOUT_PRESETS | LayoutConfig) => void;
  className?: string;
};

const layoutGroups = {
  Tree: ["treeVertical", "treeHorizontal", "treeBottomUp", "treeRightToLeft"],
  Grid: ["grid", "gridCompact", "gridWide"],
  Radial: ["radial", "radialCompact", "radialWide"],
} as const;

const layoutLabels: Record<string, string> = {
  treeVertical: "↓ Vertical",
  treeHorizontal: "→ Horizontal",
  treeBottomUp: "↑ Bottom Up",
  treeRightToLeft: "← Right to Left",
  grid: "Grid",
  gridCompact: "Compact",
  gridWide: "Wide",
  radial: "Radial",
  radialCompact: "Compact",
  radialWide: "Wide",
};

export function LayoutToolbar({
  currentLayout,
  onLayoutChange,
  className,
}: LayoutToolbarProps) {
  return (
    <div
      className={`
        flex items-center gap-1 p-2 rounded-xl
        bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md
        border border-neutral-200 dark:border-neutral-800
        shadow-lg
        ${className || ""}
      `}
    >
      {Object.entries(layoutGroups).map(([groupName, layouts]) => (
        <div key={groupName} className="flex items-center">
          <span className="px-2 text-xs font-medium text-neutral-400 dark:text-neutral-500">
            {groupName}
          </span>
          <div className="flex gap-0.5">
            {layouts.map((layout) => (
              <button
                key={layout}
                onClick={() => onLayoutChange(layout)}
                className={`
                  px-3 py-1.5 text-xs rounded-lg transition-all
                  ${
                    currentLayout === layout
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                `}
              >
                {layoutLabels[layout]}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-2" />
        </div>
      ))}
    </div>
  );
}

type SimpleLayoutSwitcherProps = {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  className?: string;
};

export function SimpleLayoutSwitcher({
  currentLayout,
  onLayoutChange,
  className,
}: SimpleLayoutSwitcherProps) {
  const layouts: { type: LayoutType; label: string; icon: string }[] = [
    { type: "dagre", label: "Tree", icon: "🌲" },
    { type: "grid", label: "Grid", icon: "▦" },
    { type: "radial", label: "Radial", icon: "◎" },
  ];

  return (
    <div
      className={`
        flex items-center gap-1 p-1 rounded-lg
        bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md
        border border-neutral-200 dark:border-neutral-800
        shadow-lg
        ${className || ""}
      `}
    >
      {layouts.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => onLayoutChange(type)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all
            ${
              currentLayout === type
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }
          `}
          title={label}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
