import jwt from "jsonwebtoken";
import { gatewayConfig } from "../config/env";
import { JwtClaims } from "../core/types";

export type JwtVerificationResult =
  | {
      valid: true;
      claims: JwtClaims;
    }
  | {
      valid: false;
      reason: string;
    };

export function extractBearerToken(
  headers: Record<string, string | string[] | undefined>,
): string | null {
  const raw = headers["authorization"];

  const value = Array.isArray(raw) ? raw[0] : raw;

  if (!value) {
    return null;
  }

  if (!value.startsWith("Bearer ")) {
    return null;
  }

  return value.slice("Bearer ".length).trim();
}

export function verifyJwt(token: string): JwtVerificationResult {
  try {
    const decoded = jwt.verify(token, gatewayConfig.jwtSecret);

    if (typeof decoded === "string") {
      return {
        valid: false,
        reason: "JWT payload must be an object.",
      };
    }

    return {
      valid: true,
      claims: {
        sub: typeof decoded.sub === "string" ? decoded.sub : undefined,
        client_id: typeof decoded.client_id === "string" ? decoded.client_id : undefined,
        scope: typeof decoded.scope === "string" ? decoded.scope : undefined,
        iat: typeof decoded.iat === "number" ? decoded.iat : undefined,
        exp: typeof decoded.exp === "number" ? decoded.exp : undefined,
      },
    };
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : "JWT verification failed.",
    };
  }
}
