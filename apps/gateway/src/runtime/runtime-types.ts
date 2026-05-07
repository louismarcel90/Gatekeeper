export type RuntimeDecision = "ALLOW" | "DENY";

export type RuntimeRequestContext = {
  requestId: string;
  method: string;
  path: string;
  clientIp: string;
  authorizationHeader?: string;
  apiKey?: string;
};

export type RuntimeIdentity = {
  clientId: string;
  scopes: string[];
};

export type RuntimeRoute = {
  routeId: string;
  path: string;
  method: string;
};

export type RuntimePolicy = {
  policyId: string;
  routeId: string;
  requireApiKey: boolean;
  requiredScopes: string[];
  rateLimitPerMinute: number;
};

export type RuntimeEvaluationResult = {
  decision: RuntimeDecision;
  reasonCode: string;
  explanation: string;
  routeId?: string;
  policyId?: string;
};