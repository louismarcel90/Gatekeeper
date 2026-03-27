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
      // handled below
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          display: "grid",
          gap: 16,
          padding: 24,
          border: "1px solid #ddd",
          borderRadius: 16,
        }}
      >
        <h1>Gatekeeper Login</h1>

        <label style={{ display: "grid", gap: 8 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "grid", gap: 8 }}>
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>

        {loginMutation.isError ? (
          <div style={{ color: "crimson" }}>
            Invalid credentials or backend unavailable.
          </div>
        ) : null}
      </form>
    </div>
  );
}