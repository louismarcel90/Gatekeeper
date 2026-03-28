"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/src/modules/auth/use-login";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("admin@gatekeeper.local");
  const [password, setPassword] = useState("admin123456");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await loginMutation.mutateAsync({ email, password });
      router.replace("/");
    } catch {
      // ToDo: handled visually below
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#F7F7F5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 420,
          display: "grid",
          gap: 18,
          padding: 28,
          borderRadius: 28,
          border: "1px solid #E7E5E4",
          background: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(17,17,17,0.06)",
          color: "#111111",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em" }}>Gatekeeper</div>
          <div style={{ color: "#6B665F" }}>Sign in to access the admin control plane.</div>
        </div>

        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#44403C" }}>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            style={{
              padding: 14,
              borderRadius: 14,
              border: "1px solid #E7E5E4",
              background: "#FFFFFF",
              color: "#111111",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#44403C" }}>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            style={{
              padding: 14,
              borderRadius: 14,
              border: "1px solid #E7E5E4",
              background: "#FFFFFF",
              color: "#111111",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={{
            padding: 14,
            borderRadius: 14,
            border: "1px solid #D9D5FF",
            background: "#F7F6FF",
            color: "#5B57D6",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>

        {loginMutation.isError ? (
          <div style={{ color: "#B54848", fontSize: 14 }}>
            Invalid credentials or backend unavailable.
          </div>
        ) : null}
      </form>
    </div>
  );
}
