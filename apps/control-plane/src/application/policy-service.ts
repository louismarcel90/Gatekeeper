import { Policy } from "../domain/types";
import { CreatePolicyInput } from "../domain/validators";
import { getAllPolicies, insertPolicy } from "../infrastructure/policy-repository";

export async function listPolicies(): Promise<Policy[]> {
  return getAllPolicies();
}

export async function createPolicy(input: CreatePolicyInput): Promise<Policy> {
  return insertPolicy({
    id: input.id,
    route_id: input.route_id,
    require_api_key: input.require_api_key,
    required_scopes: input.required_scopes,
    rate_limit_per_minute: input.rate_limit_per_minute,
    quota_per_day: input.quota_per_day,
  });
}