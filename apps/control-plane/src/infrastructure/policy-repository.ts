import { pool } from "../db/client";
import { Policy } from "../domain/types";

type PolicyRow = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
  quota_per_day: number | null;
};

export async function getAllPolicies(): Promise<Policy[]> {
  const result = await pool.query<PolicyRow>(`
    SELECT id, route_id, require_api_key, required_scopes, rate_limit_per_minute, quota_per_day
    FROM policies
    ORDER BY id ASC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    route_id: row.route_id,
    require_api_key: row.require_api_key,
    required_scopes: row.required_scopes,
    rate_limit_per_minute: row.rate_limit_per_minute,
    quota_per_day: row.quota_per_day,
  }));
}

export async function insertPolicy(policy: Policy): Promise<Policy> {
  await pool.query(
    `
    INSERT INTO policies (
      id,
      route_id,
      require_api_key,
      required_scopes,
      rate_limit_per_minute,
      quota_per_day
    )
    VALUES ($1, $2, $3, $4::jsonb, $5, $6)
    `,
    [
      policy.id,
      policy.route_id,
      policy.require_api_key,
      JSON.stringify(policy.required_scopes),
      policy.rate_limit_per_minute,
      policy.quota_per_day,
    ],
  );

  return policy;
}