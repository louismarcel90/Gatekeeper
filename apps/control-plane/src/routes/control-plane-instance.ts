import { FastifyInstance } from "fastify";
import { env } from "../config/env";

function readInstanceId(): string {
  if ("instanceId" in env) {
    return env.CONTROL_PLANE_INSTANCE_ID;
  }

  if ("CONTROL_PLANE_INSTANCE_ID" in env) {
    return env.CONTROL_PLANE_INSTANCE_ID;
  }

  return "control-plane-local-1";
}

export async function registerControlPlaneInstanceRoutes(app: FastifyInstance): Promise<void> {
  app.get("/control-plane/instance", async () => {
    return {
      instance_id: readInstanceId(),
      service: "gatekeeper-control-plane",
      scaling_role: "STATELESS_CONTROL_PLANE_INSTANCE",
      source_of_truth: "POSTGRESQL",
      runtime_boundary: "PUBLISHED_SNAPSHOTS",
      shared_durable_state: [
        "admin_users",
        "managed_routes",
        "policies",
        "snapshots",
        "deployment_history",
        "decision_audit_logs",
      ],
      critical_operations: [
        "publish_snapshot",
        "activate_snapshot",
        "rollback_snapshot",
        "import_policy_document",
        "create_admin_user",
      ],
    };
  });
}
