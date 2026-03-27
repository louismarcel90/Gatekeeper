export function InlineMessage({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "error";
  children: React.ReactNode;
}) {
  const styles =
    tone === "success"
      ? {
          background: "#EAF6EF",
          border: "#D7EBE0",
          color: "#2F8F63",
        }
      : tone === "error"
        ? {
            background: "#FCEEEE",
            border: "#F5D7D7",
            color: "#B54848",
          }
        : {
            background: "#F3F4F6",
            border: "#E5E7EB",
            color: "#5F5B53",
          };

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}