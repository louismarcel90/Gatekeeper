import { ManagedRoute } from "../domain/types";
import { CreateRouteInput } from "../domain/validators";
import { insertRoute, getAllRoutes } from "../infrastructure/route-repository";
import {
  setRouteEnabled,
  updateRoute,
} from "../infrastructure/route-repository";

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

export async function updateManagedRoute(input: CreateRouteInput) {
  const updated = await updateRoute(input);

  if (!updated) {
    throw new Error(`Route "${input.id}" was not found.`);
  }

  return updated;
}

export async function updateManagedRouteEnabled(input: {
  id: string;
  enabled: boolean;
}) {
  const updated = await setRouteEnabled(input);

  if (!updated) {
    throw new Error(`Route "${input.id}" was not found.`);
  }

  return updated;
}