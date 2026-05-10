import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./fixtures/auth";

test("policies page renders explorer and create form", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/policies");

  await expect(page.getByText("Policies Explorer")).toBeVisible();
  await expect(page.getByText("Create Policy")).toBeVisible();
});