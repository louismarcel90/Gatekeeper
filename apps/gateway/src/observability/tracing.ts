import { trace, context, SpanStatusCode, Span } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { env } from "../config/env";
import { runtimeLogger } from "./runtime-logger";

let tracingStarted = false;

export function startTracing(): void {
  if (!env.OTEL_TRACING_ENABLED) {
    runtimeLogger.info("OpenTelemetry tracing disabled.");
    return;
  }

  if (tracingStarted) {
    return;
  }

  const exporter = new OTLPTraceExporter({
    url: env.OTEL_EXPORTER_OTLP_ENDPOINT,
  });

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME,
    }),
    traceExporter: exporter,
  });

  sdk.start();

  tracingStarted = true;

  runtimeLogger.info("OpenTelemetry tracing started.", {
    otel_service_name: env.OTEL_SERVICE_NAME,
    otel_endpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
  });
}

export function getGatewayTracer() {
  return trace.getTracer(env.OTEL_SERVICE_NAME);
}

export async function withSpan<T>(
  spanName: string,
  attributes: Record<string, string | number | boolean | null>,
  operation: (span: Span) => Promise<T>,
): Promise<T> {
  const tracer = getGatewayTracer();

  return tracer.startActiveSpan(spanName, async (span) => {
    try {
      for (const [key, value] of Object.entries(attributes)) {
        if (value !== null) {
          span.setAttribute(key, value);
        }
      }

      const result = await operation(span);

      span.setStatus({
        code: SpanStatusCode.OK,
      });

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Tracing operation failed.";

      span.recordException({
        name: "Error",
        message,
      });

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message,
      });

      throw error;
    } finally {
      span.end();
    }
  });
}

export function getCurrentTraceContext(): {
  trace_id: string | null;
  span_id: string | null;
} {
  const span = trace.getSpan(context.active());

  if (!span) {
    return {
      trace_id: null,
      span_id: null,
    };
  }

  const spanContext = span.spanContext();

  return {
    trace_id: spanContext.traceId,
    span_id: spanContext.spanId,
  };
}