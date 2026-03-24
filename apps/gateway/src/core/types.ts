export type DecisionType = "ALLOW" | "DENY" | "THROTTLE";

export type Decision = {
  decision: DecisionType;
  reason_code: string;
  timestamp: string;
};

export interface RequestContext {
  method: string;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  ip: string;
  client_id?: string;
};