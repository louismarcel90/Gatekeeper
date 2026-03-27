export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "violet" | "gold" | "red";
}) {
  const styles =
    tone === "green"
      ? { background: "#EAF6EF", color: "#2F8F63", border: "#D7EBE0" }
      : tone === "violet"
        ? { background: "#F2F1FF", color: "#6157D8", border: "#E0DCFF" }
        : tone === "gold"
          ? { background: "#FBF3E8", color: "#9A6A2C", border: "#EFDCC0" }
          : tone === "red"
            ? { background: "#FCEEEE", color: "#B54848", border: "#F5D7D7" }
            : { background: "#F3F4F6", color: "#5F5B53", border: "#E5E7EB" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}