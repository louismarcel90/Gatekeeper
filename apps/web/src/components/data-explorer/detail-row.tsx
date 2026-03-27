export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px minmax(0, 1fr)",
        gap: 12,
        alignItems: "start",
      }}
    >
      <div style={{ fontSize: 13, color: "#78716C", fontWeight: 600 }}>{label}</div>
      <div
        style={{
          fontSize: 14,
          color: "#111111",
          minWidth: 0,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}