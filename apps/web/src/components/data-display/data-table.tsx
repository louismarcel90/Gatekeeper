import { ReactNode } from "react";

export function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        border: "1px solid #ECE8E5",
        borderRadius: 16,
        overflow: "hidden",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          gap: 12,
          padding: "14px 16px",
          background: "#FAFAF9",
          borderBottom: "1px solid #ECE8E5",
          color: "#57534E",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {columns.map((column) => (
          <div
            key={column}
            style={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {column}
          </div>
        ))}
      </div>

      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

export function DataTableRow({
  columns,
}: {
  columns: ReactNode[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        gap: 12,
        padding: "14px 16px",
        borderBottom: "1px solid #F1EEEB",
        alignItems: "center",
        color: "#111111",
        background: "#FFFFFF",
        minWidth: 0,
      }}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {column}
        </div>
      ))}
    </div>
  );
}