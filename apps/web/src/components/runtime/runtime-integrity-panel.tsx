"use client";

import { SectionCard } from "../data-display/section-card";
import { StatusBadge } from "../data-display/status-badge";

type RuntimeIntegrityPanelProps = {
  integrity: {
    verified: boolean;
    verifiedAt: string | null;
    activeSnapshotHash: string | null;
    failureReason: string | null;
  };
};

function shortenHash(hash: string | null): string {
  if (!hash) {
    return "—";
  }

  if (hash.length <= 12) {
    return hash;
  }

  return `${hash.slice(0, 8)}...${hash.slice(hash.length - 8)}`;
}

export function RuntimeIntegrityPanel({
  integrity,
}: RuntimeIntegrityPanelProps) {
  return (
    <SectionCard title="Runtime Snapshot Integrity">
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <StatusBadge tone={integrity.verified ? "green" : "red"}>
            {integrity.verified ? "Verified" : "Failed"}
          </StatusBadge>

          <span style={{ fontSize: 13, color: "#6B665F" }}>
            Runtime snapshot integrity verification status.
          </span>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div
            style={{
              border: "1px solid #E7E5E4",
              borderRadius: 14,
              padding: 12,
              background: "#FFFFFF",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#78716C",
                marginBottom: 4,
              }}
            >
              Active snapshot hash
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                wordBreak: "break-all",
              }}
            >
              {shortenHash(integrity.activeSnapshotHash)}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #E7E5E4",
              borderRadius: 14,
              padding: 12,
              background: "#FFFFFF",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#78716C",
                marginBottom: 4,
              }}
            >
              Verified at
            </div>

            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {integrity.verifiedAt
                ? new Date(integrity.verifiedAt).toLocaleString()
                : "—"}
            </div>
          </div>

          {integrity.failureReason ? (
            <div
              style={{
                border: "1px solid #F2B8B5",
                background: "#FFF7F7",
                color: "#B54848",
                borderRadius: 14,
                padding: 12,
                fontSize: 13,
              }}
            >
              {integrity.failureReason}
            </div>
          ) : null}
        </div>
      </div>
    </SectionCard>
  );
}