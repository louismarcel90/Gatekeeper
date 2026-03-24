import { FastifyRequest } from "fastify";
import { RequestContext } from "./types";

export function buildContext(req: FastifyRequest): RequestContext {
  return {
    method: req.method,
    path: req.url,
    headers: req.headers,
    ip: req.ip,
    client_id: extractHeaderValue(req.headers["x-api-key"])
  };
}

function extractHeaderValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}