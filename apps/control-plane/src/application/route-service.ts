import { CreateRouteInput } from "../domain/validators";
import { ManagedRoute } from "../domain/types";
import { store } from "../infrastructure/store";

export function listRoutes(): ManagedRoute[] {
  return store.getRoutes();
}

export function createRoute(input: CreateRouteInput): ManagedRoute {
  return store.addRoute({
    id: input.id,
    path: input.path,
    method: input.method,
    upstream_url: input.upstream_url,
    enabled: input.enabled
  });
}