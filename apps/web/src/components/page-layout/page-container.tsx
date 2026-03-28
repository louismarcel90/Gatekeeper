import { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1180,
        minWidth: 0,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
