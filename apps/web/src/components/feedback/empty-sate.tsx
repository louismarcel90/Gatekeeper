export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: 28,
        borderRadius: 20,
        border: "1px dashed #D6D3D1",
        background: "#FAFAF9",
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: "#111111" }}>{title}</div>
      <div style={{ color: "#6B665F", maxWidth: 640 }}>{description}</div>
    </div>
  );
}