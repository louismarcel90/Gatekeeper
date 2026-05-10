export function PerformanceNote({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid #E7E5E4",
        background: "#FBFBFA",
        borderRadius: 16,
        padding: 14,
        fontSize: 13,
        lineHeight: 1.5,
        color: "#5F5B53",
      }}
    >
      {children}
    </div>
  );
}