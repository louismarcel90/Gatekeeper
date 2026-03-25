import { PolicyDocument } from "../domain/types";
import { PolicyDocumentInput } from "../domain/validators";
import { getAllPolicies, insertPolicy } from "../infrastructure/policy-repository";
import { getAllRoutes, insertRoute } from "../infrastructure/route-repository";

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

function validateRoutePolicyReferences(document: PolicyDocumentInput): string[] {
  const routeIds = new Set(document.routes.map((route) => route.id));
  const errors: string[] = [];

  for (const policy of document.policies) {
    if (!routeIds.has(policy.route_id)) {
      errors.push(`Policy "${policy.id}" references missing route "${policy.route_id}".`);
    }
  }

  return errors;
}

function validateDuplicateIds(document: PolicyDocumentInput): string[] {
  const errors: string[] = [];

  const routeIds = document.routes.map((route) => route.id);
  const policyIds = document.policies.map((policy) => policy.id);

  const duplicateRoutes = routeIds.filter((id, index) => routeIds.indexOf(id) !== index);
  const duplicatePolicies = policyIds.filter((id, index) => policyIds.indexOf(id) !== index);

  for (const id of new Set(duplicateRoutes)) {
    errors.push(`Duplicate route id "${id}" found in document.`);
  }

  for (const id of new Set(duplicatePolicies)) {
    errors.push(`Duplicate policy id "${id}" found in document.`);
  }

  return errors;
}

export function validatePolicyDocument(document: PolicyDocumentInput): ValidationResult {
  const errors = [
    ...validateDuplicateIds(document),
    ...validateRoutePolicyReferences(document),
  ];

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function exportPolicyDocument(): Promise<PolicyDocument> {
  const routes = await getAllRoutes();
  const policies = await getAllPolicies();

  return {
    version: 1,
    routes,
    policies,
  };
}

export async function importPolicyDocument(document: PolicyDocumentInput): Promise<PolicyDocument> {
  const validation = validatePolicyDocument(document);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  for (const route of document.routes) {
    try {
      await insertRoute(route);
    } catch {
      // ignore duplicate insert for now
    }
  }

  for (const policy of document.policies) {
    try {
      await insertPolicy(policy);
    } catch {
      // ignore duplicate insert for now
    }
  }

  return {
    version: document.version,
    routes: document.routes,
    policies: document.policies,
  };
}