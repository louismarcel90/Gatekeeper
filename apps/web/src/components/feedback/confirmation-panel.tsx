"use client";

import { ReactNode } from "react";
import { ActionButton } from "../controls/action-button";

type ConfirmationPanelProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "gold" | "violet";
  children?: ReactNode;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationPanel({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "gold",
  children,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmationPanelProps) {
  const borderColor = tone === "danger" ? "#F2B8B5" : tone === "violet" ? "#D8D2FF" : "#E8D1A8";

  const background = tone === "danger" ? "#FFF7F7" : tone === "violet" ? "#F7F5FF" : "#FFF9EF";

  return (
    <div
      style={{
        border: `1px solid ${borderColor}`,
        background,
        borderRadius: 16,
        padding: 16,
        display: "grid",
        gap: 12,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#111111",
            marginBottom: 4,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            color: "#5F5B53",
          }}
        >
          {description}
        </div>
      </div>

      {children ? <div>{children}</div> : null}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ActionButton
          tone={tone === "danger" ? "gold" : tone}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Working..." : confirmLabel}
        </ActionButton>

        <ActionButton tone="neutral" onClick={onCancel} disabled={isPending}>
          {cancelLabel}
        </ActionButton>
      </div>
    </div>
  );
}
