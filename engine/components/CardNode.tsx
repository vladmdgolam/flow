"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { CardData } from "../types";

export type CardNodeProps = NodeProps<CardData>;

const CardTypeIcon = ({ type }: { type: string }) => {
  const icons: Record<string, string> = {
    article: "📄",
    image: "🖼️",
    video: "🎬",
    note: "📝",
    link: "🔗",
  };
  return <span className="text-xs">{icons[type] || "📌"}</span>;
};

export const CardNode = memo(function CardNode({
  data,
  selected,
}: CardNodeProps) {
  return (
    <div
      className={`
        relative rounded-xl border overflow-hidden
        bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm
        shadow-sm hover:shadow-md transition-all duration-200
        ${selected ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-900" : "border-neutral-200 dark:border-neutral-800"}
      `}
      style={{ width: 260 }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-6 !rounded-sm !bg-neutral-300 dark:!bg-neutral-600 !border-0 opacity-0 hover:opacity-100 transition-opacity"
      />

      {/* Thumbnail */}
      {data.thumbnail && (
        <div className="h-32 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          <img
            src={data.thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CardTypeIcon type={data.cardType} />
          {data.author && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {data.author}
            </span>
          )}
        </div>

        <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2">
          {data.label}
        </h3>

        {data.description && (
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3">
            {data.description}
          </p>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-6 !rounded-sm !bg-neutral-300 dark:!bg-neutral-600 !border-0 opacity-0 hover:opacity-100 transition-opacity"
      />
    </div>
  );
});
