import { ReactNode } from "react";

export function PageStack({
  children,
  gap = 20,
}: {
  children: ReactNode;
  gap?: number;
}) {
 return (
  <div
    style={{
      display: "grid",
      gap,
      width: "100%",
      minWidth: 0,
    }}
  >
    {children}
  </div>
);
}