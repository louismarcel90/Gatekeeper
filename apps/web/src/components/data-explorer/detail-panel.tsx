export function DetailPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid #E7E5E4",
        background: "#FFFFFF",
        padding: 16,
        display: "grid",
        gap: 12,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: "#111111" }}>{title}</div>
      {children}
    </div>
  );
}