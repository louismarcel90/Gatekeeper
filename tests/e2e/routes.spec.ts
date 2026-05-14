import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./fixtures/auth";

test("routes page renders explorer and create form", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/routes");

  await expect(page.getByText("Routes Explorer")).toBeVisible();
  await expect(page.getByText("Create Route")).toBeVisible();
});
