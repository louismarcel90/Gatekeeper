import { ActionButton } from "@/src/components/controls/action-button";

export function PaginationControls({
  page,
  pageSize,
  itemCount,
  onPrevious,
  onNext,
}: {
  page: number;
  pageSize: number;
  itemCount: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const start = itemCount === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, itemCount);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: 14, color: "#6B665F" }}>
        Showing {start}-{end} of {itemCount}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <ActionButton tone="neutral" onClick={onPrevious} disabled={page === 0}>
          Previous
        </ActionButton>

        <ActionButton
          tone="neutral"
          onClick={onNext}
          disabled={(page + 1) * pageSize >= itemCount}
        >
          Next
        </ActionButton>
      </div>
    </div>
  );
}