import { pool } from "../db/client";
import { ManagedRoute } from "../domain/types";

type RouteRow = {
  id: string;
  path: string;
  method: ManagedRoute["method"];
  upstream_url: string;
  enabled: boolean;
};

export async function getAllRoutes(): Promise<ManagedRoute[]> {
  const result = await pool.query<RouteRow>(`
    SELECT id, path, method, upstream_url, enabled
    FROM managed_routes
    ORDER BY id ASC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    path: row.path,
    method: row.method,
    upstream_url: row.upstream_url,
    enabled: row.enabled,
  }));
}

export async function insertRoute(route: ManagedRoute): Promise<ManagedRoute> {
  await pool.query(
    `
    INSERT INTO managed_routes (id, path, method, upstream_url, enabled)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [route.id, route.path, route.method, route.upstream_url, route.enabled],
  );

  return route;
}