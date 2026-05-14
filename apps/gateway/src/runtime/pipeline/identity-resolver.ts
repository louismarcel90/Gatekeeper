import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { RuntimeIdentity } from "../runtime-types";

type JwtPayload = {
  client_id?: string;
  scope?: string;
};

export function resolveIdentity(authorizationHeader?: string): RuntimeIdentity {
  if (!authorizationHeader) {
    return {
      clientId: "anonymous",
      scopes: [],
    };
  }

  const token = authorizationHeader.replace("Bearer ", "");

  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

  return {
    clientId: decoded.client_id ?? "unknown-client",
    scopes: decoded.scope ? decoded.scope.split(" ") : [],
  };
}
