import { FastifyRequest } from "fastify";
import { extractBearerToken, verifyJwt } from "../auth/jwt";
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
    .split(" ")
    .flatMap((segment) => segment.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildContext(req: FastifyRequest): RequestContext {
  const apiKey = readHeader(req.headers, "x-api-key");
  const bearerToken = extractBearerToken(req.headers);

  if (!bearerToken) {
    return {
      method: req.method,
      path: req.url,
      headers: req.headers,
      ip: req.ip,
      client_id: apiKey,
      scopes: [],
      auth: {
        api_key_present: Boolean(apiKey),
        bearer_present: false,
        jwt_valid: false,
      },
    };
  }

  const jwtResult = verifyJwt(bearerToken);

  if (!jwtResult.valid) {
    return {
      method: req.method,
      path: req.url,
      headers: req.headers,
      ip: req.ip,
      client_id: apiKey,
      scopes: [],
      auth: {
        api_key_present: Boolean(apiKey),
        bearer_present: true,
        jwt_valid: false,
        jwt_invalid_reason: jwtResult.reason,
      },
    };
  }

  const claims = jwtResult.claims;
  const clientId = claims.client_id ?? claims.sub ?? apiKey;
  const scopes = parseScopes(claims.scope);

  return {
    method: req.method,
    path: req.url,
    headers: req.headers,
    ip: req.ip,
    client_id: clientId,
    scopes,
    auth: {
      api_key_present: Boolean(apiKey),
      bearer_present: true,
      jwt_valid: true,
      subject: claims.sub,
    },
  };
}