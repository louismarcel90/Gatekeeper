import { z } from "zod";

export const createRouteSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  upstream_url: z.string().url(),
  enabled: z.boolean().default(true)
});

export const createPolicySchema = z.object({
  id: z.string().min(1),
  route_id: z.string().min(1),
  require_api_key: z.boolean(),
  required_scopes: z.array(z.string()),
  rate_limit_per_minute: z.number().int().positive().nullable()
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type CreatePolicyInput = z.infer<typeof createPolicySchema>;