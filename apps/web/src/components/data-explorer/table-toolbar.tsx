export function TableToolbar({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{left}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{right}</div>
    </div>
  );
}