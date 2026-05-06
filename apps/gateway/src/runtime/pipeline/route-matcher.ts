import { getActiveSnapshot } from "../runtime-snapshot-store"; 
import { RuntimeRoute } from "../runtime-types";

export function matchRoute(
  path: string,
  method: string,
): RuntimeRoute | null {
  const snapshot = getActiveSnapshot();

  const route = snapshot.routes.find(
    (candidate) =>
      candidate.path === path &&
      candidate.method.toUpperCase() === method.toUpperCase(),
  );

  return route ?? null;
}