import { matchRoute } from "./pipeline/route-matcher";
import { resolveIdentity } from "./pipeline/identity-resolver";
import { evaluatePolicy } from "./pipeline/policy-evaluator";
import { RuntimeEvaluationResult } from "./runtime-types";

export async function executeRuntimePipeline(params: {
  path: string;
  method: string;
  authorizationHeader?: string;
}): Promise<RuntimeEvaluationResult> {
  const route = matchRoute(params.path, params.method);

  if (!route) {
    return {
      decision: "DENY",
      reasonCode: "ROUTE_NOT_FOUND",
      explanation:
        "No managed route matched request.",
    };
  }

  const identity = resolveIdentity(
    params.authorizationHeader,
  );

  return evaluatePolicy(route, identity);
}