import { z } from "zod";

export const createRouteSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  upstream_url: z.string().url(),
  enabled: z.boolean().default(true),
});

export const createPolicySchema = z.object({
  id: z.string().min(1),
  route_id: z.string().min(1),
  require_api_key: z.boolean(),
  required_scopes: z.array(z.string()),
  rate_limit_per_minute: z.number().int().positive().nullable(),
  quota_per_day: z.number().int().positive().nullable(),
});

export const createDecisionAuditLogSchema = z.object({
  decision_id: z.string().min(1),
  decision: z.enum(["ALLOW", "DENY", "THROTTLE"]),
  reason_code: z.string().min(1),
  route_id: z.string().nullable(),
  policy_id: z.string().nullable(),
  client_id: z.string().nullable(),
  path: z.string().min(1),
  method: z.string().min(1),
  ip: z.string().min(1),
  matched_rule: z.string().nullable(),
  explanation: z.string().min(1),
  snapshot_version: z.number().int().nullable(),
});

export const simulateDecisionSchema = z.object({
  path: z.string().min(1),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  client_id: z.string().min(1).optional(),
  scopes: z.array(z.string()).default([]),
});

export const policyDocumentSchema = z.object({
  version: z.number().int().positive(),
  routes: z.array(createRouteSchema),
  policies: z.array(createPolicySchema),
});

export const candidateSimulationSchema = z.object({
  document: policyDocumentSchema,
  input: simulateDecisionSchema,
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type CreateDecisionAuditLogInput = z.infer<typeof createDecisionAuditLogSchema>;
export type SimulateDecisionInput = z.infer<typeof simulateDecisionSchema>;
export type PolicyDocumentInput = z.infer<typeof policyDocumentSchema>;
export type CandidateSimulationInput = z.infer<typeof candidateSimulationSchema>;