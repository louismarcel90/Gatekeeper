# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: routes.spec.ts >> routes page renders explorer and create form
- Location: tests\e2e\routes.spec.ts:4:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Routes Explorer')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Routes Explorer')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]: Gatekeeper
      - generic [ref=e16]: Sign in to access the admin control plane.
    - generic [ref=e17]:
      - generic [ref=e18]: Email
      - textbox "Email" [ref=e19]: admin@gatekeeper.local
    - generic [ref=e20]:
      - generic [ref=e21]: Password
      - textbox "Password" [ref=e22]: admin123456
    - button "Sign in" [ref=e23] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { loginAsAdmin } from "./fixtures/auth";
  3  | 
  4  | test("routes page renders explorer and create form", async ({ page }) => {
  5  |   await loginAsAdmin(page);
  6  | 
  7  |   await page.goto("/routes");
  8  | 
> 9  |   await expect(page.getByText("Routes Explorer")).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  10 |   await expect(page.getByText("Create Route")).toBeVisible();
  11 | });
```