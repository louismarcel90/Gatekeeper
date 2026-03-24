import { Policy } from "../domain/types";
import { CreatePolicyInput } from "../domain/validators";
import { store } from "../infrastructure/store";

export function listPolicies(): Policy[] {
  return store.getPolicies();
}

export function createPolicy(input: CreatePolicyInput): Policy {
  return store.addPolicy({
    id: input.id,
    route_id: input.route_id,
    require_api_key: input.require_api_key,
    required_scopes: input.required_scopes,
    rate_limit_per_minute: input.rate_limit_per_minute
  });
}