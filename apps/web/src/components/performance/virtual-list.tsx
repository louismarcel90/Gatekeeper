"use client";

import { ReactNode, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type VirtualListProps<T> = {
  items: T[];
  estimateSize: number;
  height: number;
  renderItem: (item: T, index: number) => ReactNode;
};

export function VirtualList<T>({
  items,
 estimateSize,
  height,
  renderItem,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const virtualizerOptions = useMemo(
  () => ({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 8,
  }),
  [items.length, estimateSize],
);

// eslint-disable-next-line react-hooks/incompatible-library
const virtualizer = useVirtualizer(virtualizerOptions);

  return (
    <div
      ref={parentRef}
      style={{
        height,
        overflow: "auto",
        border: "1px solid #E7E5E4",
        borderRadius: 16,
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];

          if (!item) {
            return null;
          }

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}