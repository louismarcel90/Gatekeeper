import { Page, expect } from "@playwright/test";
import { e2eEnv } from "./e2e-env";

export async function loginAsAdmin(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/login/);

  await page
    .locator('input[type="email"], input[name="email"], input[placeholder*="email" i]')
    .first()
    .fill(e2eEnv.adminEmail);

  await page
    .locator('input[type="password"], input[name="password"], input[placeholder*="password" i]')
    .first()
    .fill(e2eEnv.adminPassword);

  await page
    .getByRole("button", { name: /sign in|login|log in/i })
    .click();
}