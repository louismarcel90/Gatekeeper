import { CreateDecisionAuditLogInput } from "../domain/validators";
import { DecisionAuditLog } from "../domain/types";
import {
  insertDecisionAuditLog,
  listDecisionAuditLogs,
} from "../infrastructure/audit-repository";

export async function createDecisionAuditLog(
  input: CreateDecisionAuditLogInput,
): Promise<DecisionAuditLog> {
  return insertDecisionAuditLog(input);
}

export async function getDecisionAuditLogs(): Promise<DecisionAuditLog[]> {
  return listDecisionAuditLogs();
}