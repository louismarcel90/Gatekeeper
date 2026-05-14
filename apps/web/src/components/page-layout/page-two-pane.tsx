import { ReactNode } from "react";

export function PageTwoPane({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.45fr) minmax(0, 0.85fr)",
        gap: 14,
        alignItems: "start",
        width: "100%",
        minWidth: 0,
      }}
    >
      <div style={{ minWidth: 0 }}>{left}</div>
      <div style={{ minWidth: 0 }}>{right}</div>
    </div>
  );
}
