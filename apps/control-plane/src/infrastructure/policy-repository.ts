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

function mapRow(row: PolicyRow): Policy {
  return {
    id: row.id,
    route_id: row.route_id,
    require_api_key: row.require_api_key,
    required_scopes: Array.isArray(row.required_scopes)
      ? row.required_scopes
      : (JSON.parse(row.required_scopes) as string[]),
    rate_limit_per_minute: row.rate_limit_per_minute,
    quota_per_day: row.quota_per_day,
  };
}

export async function updatePolicy(input: {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
  quota_per_day: number | null;
}): Promise<Policy | null> {
  const result = await pool.query<PolicyRow>(
    `
    UPDATE policies
    SET route_id = $2,
        require_api_key = $3,
        required_scopes = $4,
        rate_limit_per_minute = $5,
        quota_per_day = $6
    WHERE id = $1
    RETURNING
      id,
      route_id,
      require_api_key,
      required_scopes,
      rate_limit_per_minute,
      quota_per_day
    `,
    [
      input.id,
      input.route_id,
      input.require_api_key,
      JSON.stringify(input.required_scopes),
      input.rate_limit_per_minute,
      input.quota_per_day,
    ],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRow(result.rows[0]!);
}
