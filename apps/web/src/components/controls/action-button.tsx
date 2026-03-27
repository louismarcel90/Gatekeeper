import type { ReactNode } from "react";

type ActionButtonProps = {
  children: ReactNode;
  tone?: "violet" | "gold" | "neutral";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export function ActionButton({
  children,
  tone = "violet",
  disabled = false,
  onClick,
  type = "button",
}: ActionButtonProps) {
  const styles =
    tone === "gold"
      ? {
          border: "1px solid #E8D3B7",
          background: disabled ? "#F8F6F2" : "#FBF7F2",
          color: disabled ? "#B7A389" : "#9A6A2C",
        }
      : tone === "neutral"
      ? {
          border: "1px solid #E7E5E4",
          background: disabled ? "#FAFAF9" : "#FFFFFF",
          color: disabled ? "#AAA29A" : "#111111",
        }
      : {
          border: "1px solid #D9D5FF",
          background: disabled ? "#F8F7FE" : "#F7F6FF",
          color: disabled ? "#A29BEA" : "#5B57D6",
        };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: styles.border,
        background: styles.background,
        color: styles.color,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.8 : 1,
      }}
    >
      {children}
    </button>
  );
}