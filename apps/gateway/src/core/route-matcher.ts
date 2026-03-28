import { ManagedRoute, RequestContext, Snapshot } from "./types";

function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0] ?? path;

  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }

  return withoutQuery;
}

export function findManagedRoute(
  snapshot: Snapshot,
  context: RequestContext,
): ManagedRoute | undefined {
  const requestPath = normalizePath(context.path);

  return snapshot.routes.find((route) => {
    return route.method === context.method && normalizePath(route.path) === requestPath;
  });
}
