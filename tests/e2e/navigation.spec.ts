import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./fixtures/auth";

test("admin can navigate main product pages", async ({ page }) => {
  await loginAsAdmin(page);

  await page.getByText("Routes").click();
  await expect(page.getByText("Routes Explorer")).toBeVisible();

  await page.getByText("Policies").click();
  await expect(page.getByText("Policies Explorer")).toBeVisible();

  await page.getByText("Snapshots").click();
  await expect(page.getByText("Snapshots")).toBeVisible();

  await page.getByText("Audit Log").click();
  await expect(page.getByText("Audit")).toBeVisible();

  await page.getByText("Deployments").click();
  await expect(page.getByText("Deployments")).toBeVisible();
});
