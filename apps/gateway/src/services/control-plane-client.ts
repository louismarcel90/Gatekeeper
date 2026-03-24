import { request } from "undici";
import { Snapshot } from "../core/types";
import { gatewayConfig } from "../config/env";

export async function fetchLatestSnapshot(): Promise<Snapshot | null> {
  const url = `${gatewayConfig.controlPlaneBaseUrl}/snapshots/latest`;

  const response = await request(url, {
    method: "GET",
  });

  if (response.statusCode === 404) {
    return null;
  }

  if (response.statusCode !== 200) {
    throw new Error(`Failed to fetch latest snapshot. HTTP ${response.statusCode}`);
  }

  const body = (await response.body.json()) as Snapshot;
  return body;
}