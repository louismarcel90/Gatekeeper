import { ManagedRoute } from "../domain/types";
import { CreateRouteInput } from "../domain/validators";
import { insertRoute, getAllRoutes } from "../infrastructure/route-repository";

export async function listRoutes(): Promise<ManagedRoute[]> {
  return getAllRoutes();
}

export async function createRoute(input: CreateRouteInput): Promise<ManagedRoute> {
  return insertRoute({
    id: input.id,
    path: input.path,
    method: input.method,
    upstream_url: input.upstream_url,
    enabled: input.enabled,
  });
}