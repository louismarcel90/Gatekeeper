"use client";

import { useState } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { SectionCard } from "@/src/components/data-display/section-card";
import { InlineMessage } from "@/src/components/feedback/inline-message";
import { PageContainer } from "@/src/components/page-layout/page-container";
import { PageStack } from "@/src/components/page-layout/page-stack"; 
import { usePolicyDocumentExport } from "@/src/modules/policy-documents/use-policy-document-export";
import { useImportPolicyDocument } from "@/src/modules/policy-documents/use-policy-document-actions";
import { useAuthStore } from "@/src/core/state/auth-store";

export default function PolicyDocumentsPage() {
  const exportQuery = usePolicyDocumentExport();
  const importMutation = useImportPolicyDocument();
  const user = useAuthStore((state) => state.user);

  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const canImport = user?.role === "security" || user?.role === "admin";

  async function handleImport() {
    setMessage("");

    try {
      const parsed = JSON.parse(inputValue);
      await importMutation.mutateAsync(parsed);
      setMessage("Policy document imported successfully.");
    } catch {
      setMessage("Failed to import policy document. Check the JSON structure.");
    }
  }

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          title="Policy Documents"
          subtitle="Export the current policy-as-code document, inspect it, and import a new candidate document."
        />

        {message ? (
          <InlineMessage
            tone={message.toLowerCase().includes("failed") ? "error" : "success"}
          >
            {message}
          </InlineMessage>
        ) : null}

        <SectionCard title="Exported Policy Document">
          {exportQuery.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading exported document...</div>
          ) : exportQuery.isError ? (
            <div style={{ color: "#B54848" }}>Failed to export policy document.</div>
          ) : (
            <pre
              style={{
                margin: 0,
                padding: 18,
                borderRadius: 16,
                background: "#FAFAF9",
                border: "1px solid #ECE8E5",
                overflow: "auto",
                color: "#111111",
                fontSize: 13,
                lineHeight: 1.55,
                maxHeight: 420,
              }}
            >
              {JSON.stringify(exportQuery.data, null, 2)}
            </pre>
          )}
        </SectionCard>

        {canImport ? (
          <SectionCard title="Import Policy Document">
            <div style={{ display: "grid", gap: 12 }}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Paste a policy document JSON here...'
                style={{
                  minHeight: 220,
                  padding: 14,
                  borderRadius: 14,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                  color: "#111111",
                  resize: "vertical",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              />

              <div>
                <button
                  onClick={handleImport}
                  disabled={importMutation.isPending}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #D9D5FF",
                    background: "#F7F6FF",
                    color: "#5B57D6",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {importMutation.isPending ? "Importing..." : "Import Policy Document"}
                </button>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </PageStack>
    </PageContainer>
  );
}