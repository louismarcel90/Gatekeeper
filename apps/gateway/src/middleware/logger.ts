import { FastifyRequest } from "fastify";
import { Decision } from "../core/types";

export function logRequest(req: FastifyRequest, decision: Decision) {
  req.log.info({
    method: req.method,
    url: req.url,
    decision
  });
}