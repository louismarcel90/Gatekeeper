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

function parseScopes(rawValue: string | undefined): string[] {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildContext(req: FastifyRequest): RequestContext {
  const apiKey = readHeader(req.headers, "x-api-key");
  const rawScopes = readHeader(req.headers, "x-scopes");

  return {
    method: req.method,
    path: req.url,
    headers: req.headers,
    ip: req.ip,
    client_id: apiKey,
    scopes: parseScopes(rawScopes),
  };
}