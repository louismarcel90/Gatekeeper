import { pool } from "../db/client";
import { ManagedRoute } from "../domain/types";

type RouteRow = {
  id: string;
  path: string;
  method: ManagedRoute["method"];
  upstream_url: string;
  enabled: boolean;
};

type RouteMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ManagedRouteRow = {
  id: string;
  path: string;
  method: RouteMethod;
  upstream_url: string;
  enabled: boolean;
};

function mapRow(row: ManagedRouteRow): ManagedRoute {
  return {
    id: row.id,
    path: row.path,
    method: row.method,
    upstream_url: row.upstream_url,
    enabled: row.enabled,
  };
}

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

export async function updateRoute(input: {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  upstream_url: string;
  enabled: boolean;
}): Promise<ManagedRoute | null> {
  const result = await pool.query<ManagedRouteRow>(
    `
    UPDATE managed_routes
    SET path = $2,
        method = $3,
        upstream_url = $4,
        enabled = $5
    WHERE id = $1
    RETURNING id, path, method, upstream_url, enabled
    `,
    [input.id, input.path, input.method, input.upstream_url, input.enabled],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRow(result.rows[0]!);
}

export async function setRouteEnabled(input: {
  id: string;
  enabled: boolean;
}): Promise<ManagedRoute | null> {
  const result = await pool.query<ManagedRouteRow>(
    `
    UPDATE managed_routes
    SET enabled = $2
    WHERE id = $1
    RETURNING id, path, method, upstream_url, enabled
    `,
    [input.id, input.enabled],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRow(result.rows[0]!);
}
