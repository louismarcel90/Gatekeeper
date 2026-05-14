export function FiltersBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        padding: 12,
        borderRadius: 16,
        background: "#FAFAF9",
        border: "1px solid #ECE8E5",
        width: "100%",
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

export function FilterInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #E7E5E4",
        background: "#FFFFFF",
        color: "#111111",
        minWidth: 180,
        maxWidth: 240,
        width: "100%",
        ...props.style,
      }}
    />
  );
}

export function FilterSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #E7E5E4",
        background: "#FFFFFF",
        color: "#111111",
        minWidth: 180,
        maxWidth: 220,
        ...props.style,
      }}
    />
  );
}
