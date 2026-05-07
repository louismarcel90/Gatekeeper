import { FastifyReply, FastifyRequest } from "fastify";
import { getCurrentTraceContext, withSpan } from "./tracing";

declare module "fastify" {
  interface FastifyRequest {
    traceContext?: {
      trace_id: string | null;
      span_id: string | null;
    };
  }
}

function getHeaderValue(
  value: string | string[] | undefined,
): string | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function attachRequestTraceContext(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const requestId =
    getHeaderValue(req.headers["x-request-id"]) ?? crypto.randomUUID();

  reply.header("x-request-id", requestId);

  await withSpan(
    "gateway.http.request",
    {
      "http.method": req.method,
      "http.route": req.url,
      "gatekeeper.request_id": requestId,
      "gatekeeper.client_id": getHeaderValue(req.headers["x-client-id"]),
    },
    async () => {
      req.traceContext = getCurrentTraceContext();
    },
  );
}