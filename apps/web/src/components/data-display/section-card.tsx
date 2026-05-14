export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      style={{
        borderRadius: 20,
        border: "1px solid #E7E5E4",
        background: "#FFFFFF",
        padding: 16,
        display: "grid",
        gap: 14,
        boxShadow: "0 8px 20px rgba(17,17,17,0.03)",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: "#111111",
            fontSize: 21,
            fontWeight: 700,
            minWidth: 0,
          }}
        >
          {title}
        </div>

        {action ? <div>{action}</div> : null}
      </div>

      {children}
    </section>
  );
}
