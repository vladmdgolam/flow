"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../types";

export type MinimalNodeProps = NodeProps<NodeData>;

export const MinimalNode = memo(function MinimalNode({
  data,
  selected,
}: MinimalNodeProps) {
  return (
    <div
      className={`
        relative px-4 py-2 rounded-lg border
        bg-white dark:bg-neutral-900
        transition-all duration-150
        ${selected ? "border-blue-500 shadow-lg" : "border-neutral-300 dark:border-neutral-700"}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-neutral-400 !border-0"
      />

      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
        {data.label}
      </span>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-neutral-400 !border-0"
      />
    </div>
  );
});
