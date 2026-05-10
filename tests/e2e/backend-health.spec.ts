import { test, expect } from "@playwright/test";
import { e2eEnv } from './fixtures/e2e-env';

test("control plane health is reachable", async ({ request }) => {
  const response = await request.get(`${e2eEnv.controlPlaneBaseUrl}/health`);

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body).toBeTruthy();
});

test("gateway runtime dashboard is reachable", async ({ request }) => {
  const response = await request.get(`${e2eEnv.gatewayBaseUrl}/runtime/dashboard`);

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.instance).toBeTruthy();
  expect(body.snapshot).toBeTruthy();
});