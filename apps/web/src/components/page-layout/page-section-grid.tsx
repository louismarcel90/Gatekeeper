import { ReactNode } from "react";

export function PageSectionGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
        width: "100%",
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}
