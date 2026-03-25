import { ManagedRoute, SimulationInput, Snapshot } from "../domain/types";

function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0] ?? path;

  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }

  return withoutQuery;
}

export function findManagedRouteForSimulation(
  snapshot: Snapshot,
  input: SimulationInput,
): ManagedRoute | undefined {
  const requestPath = normalizePath(input.path);

  return snapshot.routes.find((route) => {
    return route.method === input.method && normalizePath(route.path) === requestPath;
  });
}