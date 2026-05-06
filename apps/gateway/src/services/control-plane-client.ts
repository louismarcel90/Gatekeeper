import { request } from "undici";
import { Snapshot } from "../core/types";
import { env } from "../config/env";

export async function fetchActiveSnapshot(): Promise<Snapshot | null> {
  const url = `${env.CONTROL_PLANE_BASE_URL}/snapshots/active`;

  const response = await request(url, {
    method: "GET",
  });

  if (response.statusCode === 404) {
    return null;
  }

  if (response.statusCode !== 200) {
    throw new Error(`Failed to fetch active snapshot. HTTP ${response.statusCode}`);
  }

  const body = (await response.body.json()) as Snapshot;
  return body;
}
