import { env } from "./env";

export function runStartupSecurityAudit(): void {
  if (env.NODE_ENV === "production") {
    if (env.JWT_SECRET.includes("dev")) {
      console.error("Unsafe JWT secret detected for production.");
      process.exit(1);
    }

    if (env.CORS_ORIGIN.includes("localhost")) {
      console.error("Unsafe localhost CORS origin detected in production.");
      process.exit(1);
    }
  }

  console.log(
    JSON.stringify({
      level: "INFO",
      message: "Startup security audit completed.",
      environment: env.NODE_ENV,
    }),
  );
}
