import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./fixtures/auth";

test("admin can login", async ({ page }) => {
  await loginAsAdmin(page);

  await expect(page.getByText("Dashboard")).toBeVisible();
});