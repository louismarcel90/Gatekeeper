import { Decision, RequestContext } from "./types";

export function evaluate(context: RequestContext): Decision {
  const now = new Date().toISOString();

  if (!context.client_id) {
    return {
      decision: "DENY",
      reason_code: "API_KEY_MISSING",
      timestamp: now
    };
  }

  if (context.path === "/heavy") {
    return {
      decision: "THROTTLE",
      reason_code: "RATE_LIMIT_EXCEEDED",
      timestamp: now
    };
  }

  return {
    decision: "ALLOW",
    reason_code: "OK",
    timestamp: now
  };
}