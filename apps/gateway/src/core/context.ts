import { FastifyRequest } from "fastify";
import { RequestContext } from "./types";

function readHeader(
  headers: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = headers[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function buildContext(req: FastifyRequest): RequestContext {
  return {
    method: req.method,
    path: req.url,
    headers: req.headers,
    ip: req.ip,
    client_id: readHeader(req.headers, "x-api-key"),
  };
}