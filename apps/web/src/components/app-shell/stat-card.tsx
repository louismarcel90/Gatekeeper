export function StatCard({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: string | number;
  accent?: "neutral" | "violet" | "gold";
}) {
  const borderColor = accent === "violet" ? "#D9D5FF" : accent === "gold" ? "#E8D3B7" : "#E7E5E4";

  const bg = accent === "violet" ? "#F7F6FF" : accent === "gold" ? "#FBF7F2" : "#FFFFFF";

  const valueColor = accent === "violet" ? "#5B57D6" : accent === "gold" ? "#9A6A2C" : "#111111";

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 18,
        border: `1px solid ${borderColor}`,
        background: bg,
        display: "grid",
        gap: 8,
        boxShadow: "0 6px 18px rgba(17,17,17,0.03)",
        minHeight: 108,
        minWidth: 0,
      }}
    >
      <div style={{ color: "#6B665F", fontSize: 13 }}>{label}</div>
      <div
        style={{
          color: valueColor,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          textTransform: typeof value === "string" ? "capitalize" : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
