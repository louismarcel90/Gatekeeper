import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./fixtures/auth";
import { e2eEnv } from "./fixtures/e2e-env";

test("dashboard receives realtime event from dev event endpoint", async ({ page, request }) => {
  await loginAsAdmin(page);

  await expect(page.getByText("Realtime Events")).toBeVisible();

  await request.post(`${e2eEnv.controlPlaneBaseUrl}/_dev/events/test`);

  await expect(page.getByText("route.updated").first()).toBeVisible({
    timeout: 10_000,
  });
});
