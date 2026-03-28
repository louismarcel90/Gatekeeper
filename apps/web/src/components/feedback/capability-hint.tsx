export function CapabilityHint({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid #E7E5E4",
        background: "#FAFAF9",
        color: "#6B665F",
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}
