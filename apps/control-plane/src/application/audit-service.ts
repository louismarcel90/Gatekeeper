import { DecisionAuditLog } from "../domain/types";
import { CreateDecisionAuditLogInput, DecisionAuditQueryInput } from "../domain/validators";
import {
  getDecisionAuditLogByDecisionId,
  insertDecisionAuditLog,
  listDecisionAuditLogs,
} from "../infrastructure/audit-repository";

export async function createDecisionAuditLog(
  input: CreateDecisionAuditLogInput,
): Promise<DecisionAuditLog> {
  return insertDecisionAuditLog(input);
}

export async function getDecisionAuditLogs(
  filters: DecisionAuditQueryInput,
): Promise<DecisionAuditLog[]> {
  return listDecisionAuditLogs(filters);
}

export async function getDecisionAuditLog(decisionId: string): Promise<DecisionAuditLog | null> {
  return getDecisionAuditLogByDecisionId(decisionId);
}
