"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../types";

export type BaseNodeProps = NodeProps<NodeData>;

export const BaseNode = memo(function BaseNode({
  data,
  selected,
}: BaseNodeProps) {
  return (
    <div
      className={`
        relative rounded-lg border bg-white/95 dark:bg-neutral-900/95
        backdrop-blur-sm shadow-sm transition-all duration-200
        ${selected ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-900" : "border-neutral-200 dark:border-neutral-800"}
      `}
      style={{ width: 260, minHeight: 80 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-900"
      />

      <div className="p-4">
        <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2">
          {data.label}
        </h3>
        {data.description && (
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {data.description}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-900"
      />
    </div>
  );
});
