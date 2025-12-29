"use client";

import { useState, useMemo } from "react";
import {
  NodeEngine,
  LayoutToolbar,
  SimpleLayoutSwitcher,
  LAYOUT_PRESETS,
  type LayoutConfig,
  type LayoutType,
} from "@/engine";
import { getMockNodes, getMockEdges, simpleTreeData } from "./data/mockCards";

type DemoMode = "cards" | "tree";

export default function Home() {
  const [layoutKey, setLayoutKey] = useState<keyof typeof LAYOUT_PRESETS>("treeHorizontal");
  const [simpleLayoutType, setSimpleLayoutType] = useState<LayoutType>("dagre");
  const [demoMode, setDemoMode] = useState<DemoMode>("cards");

  // Get data based on demo mode
  const { nodes, edges } = useMemo(() => {
    if (demoMode === "tree") {
      return simpleTreeData;
    }
    return {
      nodes: getMockNodes(),
      edges: getMockEdges(),
    };
  }, [demoMode]);

  // Get layout config
  const layoutConfig = useMemo((): LayoutConfig => {
    if (demoMode === "tree") {
      return {
        type: simpleLayoutType,
        direction: "TB",
        nodeSpacing: 80,
        rankSpacing: 120,
        gridColumns: 4,
        radialRadius: 180,
      };
    }
    return LAYOUT_PRESETS[layoutKey];
  }, [demoMode, layoutKey, simpleLayoutType]);

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Node Engine</h1>

          {/* Demo mode switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <button
              onClick={() => setDemoMode("cards")}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                demoMode === "cards"
                  ? "bg-white dark:bg-neutral-700 shadow-sm font-medium"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Cards Demo
            </button>
            <button
              onClick={() => setDemoMode("tree")}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                demoMode === "tree"
                  ? "bg-white dark:bg-neutral-700 shadow-sm font-medium"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Tree Demo
            </button>
          </div>
        </div>

        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {nodes.length} nodes · {edges.length} edges
        </div>
      </header>

      {/* Canvas */}
      <main className="flex-1 relative">
        <NodeEngine
          key={`${demoMode}-${layoutKey}-${simpleLayoutType}`}
          nodes={nodes}
          edges={edges}
          layout={layoutConfig}
          onNodeClick={(node) => {
            console.log("Node clicked:", node);
          }}
          className="bg-neutral-50 dark:bg-neutral-950"
        />

        {/* Layout toolbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          {demoMode === "cards" ? (
            <LayoutToolbar
              currentLayout={layoutKey}
              onLayoutChange={(layout) => {
                if (typeof layout === "string") {
                  setLayoutKey(layout as keyof typeof LAYOUT_PRESETS);
                }
              }}
            />
          ) : (
            <SimpleLayoutSwitcher
              currentLayout={simpleLayoutType}
              onLayoutChange={setSimpleLayoutType}
            />
          )}
        </div>
      </main>
    </div>
  );
}
