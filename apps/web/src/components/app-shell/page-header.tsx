export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gap: 12,
        alignItems: "start",
        width: "100%",
        minWidth: 0,
      }}
    >
      <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#111111",
          }}
        >
          {title}
        </h1>

        {subtitle ? (
          <p
            style={{
              margin: 0,
              color: "#5F5B53",
              fontSize: 14,
              maxWidth: 760,
              lineHeight: 1.45,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? <div style={{ justifySelf: "end" }}>{action}</div> : null}
    </div>
  );
}
