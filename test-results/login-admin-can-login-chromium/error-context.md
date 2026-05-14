# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> admin can login
- Location: tests\e2e\login.spec.ts:4:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Dashboard')
Expected: visible
Error: strict mode violation: getByText('Dashboard') resolved to 4 elements:
    1) <span>Dashboard</span> aka getByRole('link', { name: 'Dashboard' })
    2) <h1>Dashboard</h1> aka getByRole('heading', { name: 'Dashboard' })
    3) <div>Realtime events are rendered through a virtualize…</div> aka getByText('Realtime events are rendered')
    4) <div role="alert" aria-live="assertive" id="__next-route-announcer__">Dashboard</div> aka locator('[id="__next-route-announcer__"]')

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Dashboard')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]: Dashboard
  - generic [ref=e12]:
    - complementary [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e16]: Gatekeeper
        - navigation [ref=e17]:
          - link "Dashboard" [ref=e18] [cursor=pointer]:
            - /url: /
            - img [ref=e19]
            - generic [ref=e24]: Dashboard
          - link "Routes" [ref=e25] [cursor=pointer]:
            - /url: /routes
            - img [ref=e26]
            - generic [ref=e30]: Routes
          - link "Policies" [ref=e31] [cursor=pointer]:
            - /url: /policies
            - img [ref=e32]
            - generic [ref=e35]: Policies
          - link "Simulation" [ref=e36] [cursor=pointer]:
            - /url: /simulation
            - img [ref=e37]
            - generic [ref=e39]: Simulation
          - link "Snapshots" [ref=e40] [cursor=pointer]:
            - /url: /snapshots
            - img [ref=e41]
            - generic [ref=e45]: Snapshots
          - link "Snapshot Diff" [ref=e46] [cursor=pointer]:
            - /url: /snapshot-diff
            - img [ref=e47]
            - generic [ref=e54]: Snapshot Diff
          - link "Audit Log" [ref=e55] [cursor=pointer]:
            - /url: /audit
            - img [ref=e56]
            - generic [ref=e61]: Audit Log
          - link "Policy Documents" [ref=e62] [cursor=pointer]:
            - /url: /policy-documents
            - img [ref=e63]
            - generic [ref=e66]: Policy Documents
          - link "Deployments" [ref=e67] [cursor=pointer]:
            - /url: /deployments
            - img [ref=e68]
            - generic [ref=e73]: Deployments
          - link "Admin Users" [ref=e74] [cursor=pointer]:
            - /url: /admin-users
            - img [ref=e75]
            - generic [ref=e79]: Admin Users
        - generic [ref=e80]:
          - generic [ref=e81]: Signed in as
          - generic [ref=e82]: admin@gatekeeper.local
          - generic [ref=e83]: admin
    - generic [ref=e84]:
      - banner [ref=e85]:
        - generic [ref=e86]: Control Plane
        - generic [ref=e87]:
          - generic [ref=e88]: admin@gatekeeper.local
          - button "Logout" [ref=e89] [cursor=pointer]
      - main [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]: System degraded
          - generic [ref=e94]:
            - strong [ref=e95]: realtime-stream
            - text: — Realtime stream disconnected.
        - generic [ref=e97]:
          - generic [ref=e98]:
            - generic [ref=e99]:
              - generic [ref=e100]: System Health
              - generic [ref=e101]: Control Plane health and frontend sync status.
            - generic [ref=e103]: Healthy
          - generic [ref=e104]:
            - generic [ref=e105]:
              - generic [ref=e106]:
                - heading "Dashboard" [level=1] [ref=e107]
                - paragraph [ref=e108]: Operate, investigate, and govern API access decisions across Gatekeeper with a calm, auditable, and deployment-safe control plane.
              - generic [ref=e110]: admin
            - generic [ref=e111]:
              - generic [ref=e113]: Realtime Events
              - generic [ref=e114]:
                - generic [ref=e115]:
                  - generic [ref=e117]: reconnecting
                  - button "Clear" [ref=e118] [cursor=pointer]
                - generic [ref=e119]: Realtime events are rendered through a virtualized list so the dashboard remains usable when operational activity grows.
                - generic [ref=e120]: No realtime events yet.
            - generic [ref=e121]:
              - generic [ref=e123]: Frontend System Health
              - generic [ref=e124]:
                - generic [ref=e125]:
                  - generic [ref=e126]: degraded
                  - generic [ref=e127]: Frontend health is derived from Control Plane reachability, realtime stream state, and auth session readiness.
                - generic [ref=e128]:
                  - generic [ref=e129]:
                    - generic [ref=e130]:
                      - generic [ref=e131]: healthy
                      - strong [ref=e132]: control-plane
                    - generic [ref=e133]: Control Plane API request succeeded.
                    - generic [ref=e134]: "Last checked: 5/10/2026, 11:48:00 AM"
                  - generic [ref=e135]:
                    - generic [ref=e136]:
                      - generic [ref=e137]: degraded
                      - strong [ref=e138]: realtime-stream
                    - generic [ref=e139]: Realtime stream disconnected.
                    - generic [ref=e140]: "Last checked: 5/10/2026, 11:48:00 AM"
                  - generic [ref=e141]:
                    - generic [ref=e142]:
                      - generic [ref=e143]: healthy
                      - strong [ref=e144]: auth-session
                    - generic [ref=e145]: Initial state.
                    - generic [ref=e146]: "Last checked: 5/10/2026, 11:47:51 AM"
            - generic [ref=e147]:
              - generic [ref=e148]:
                - generic [ref=e149]: Managed Routes
                - generic [ref=e150]: "11"
              - generic [ref=e151]:
                - generic [ref=e152]: Enabled Routes
                - generic [ref=e153]: "11"
              - generic [ref=e154]:
                - generic [ref=e155]: Active Snapshot
                - generic [ref=e156]: "13"
            - generic [ref=e157]:
              - generic [ref=e159]:
                - generic [ref=e161]: Routes Overview
                - generic [ref=e162]:
                  - generic [ref=e163]:
                    - strong [ref=e164]: GET
                    - generic [ref=e165]: /extra
                    - generic [ref=e167]: Enabled
                  - generic [ref=e168]:
                    - strong [ref=e169]: GET
                    - generic [ref=e170]: /heavy
                    - generic [ref=e172]: Enabled
                  - generic [ref=e173]:
                    - strong [ref=e174]: GET
                    - generic [ref=e175]: /louis
                    - generic [ref=e177]: Enabled
                  - generic [ref=e178]:
                    - strong [ref=e179]: GET
                    - generic [ref=e180]: /quota-test
                    - generic [ref=e182]: Enabled
                  - generic [ref=e183]:
                    - strong [ref=e184]: GET
                    - generic [ref=e185]: /reports
                    - generic [ref=e187]: Enabled
              - generic [ref=e189]:
                - generic [ref=e190]:
                  - generic [ref=e191]: Recent UI Events
                  - button "Clear" [ref=e192] [cursor=pointer]
                - generic [ref=e193]:
                  - generic [ref=e194]:
                    - generic [ref=e195]:
                      - generic [ref=e196]: success
                      - generic [ref=e197]: 11:48:00 AM
                    - generic [ref=e198]: http.response
                    - generic [ref=e199]: GET /routes -> 200
                    - generic [ref=e200]: "request_id: req_1778428080741_yifo7xnu"
                  - generic [ref=e201]:
                    - generic [ref=e202]:
                      - generic [ref=e203]: success
                      - generic [ref=e204]: 11:48:00 AM
                    - generic [ref=e205]: http.response
                    - generic [ref=e206]: GET /snapshots/active -> 200
                    - generic [ref=e207]: "request_id: req_1778428080741_r2zpxui0"
                  - generic [ref=e208]:
                    - generic [ref=e209]:
                      - generic [ref=e210]: success
                      - generic [ref=e211]: 11:48:00 AM
                    - generic [ref=e212]: http.response
                    - generic [ref=e213]: GET /health -> 200
                    - generic [ref=e214]: "request_id: req_1778428080741_d9cxep9l"
                  - generic [ref=e215]:
                    - generic [ref=e216]:
                      - generic [ref=e217]: info
                      - generic [ref=e218]: 11:48:00 AM
                    - generic [ref=e219]: http.request
                    - generic [ref=e220]: GET /snapshots/active
                    - generic [ref=e221]: "request_id: req_1778428080741_r2zpxui0"
                  - generic [ref=e222]:
                    - generic [ref=e223]:
                      - generic [ref=e224]: info
                      - generic [ref=e225]: 11:48:00 AM
                    - generic [ref=e226]: http.request
                    - generic [ref=e227]: GET /routes
                    - generic [ref=e228]: "request_id: req_1778428080741_yifo7xnu"
                  - generic [ref=e229]:
                    - generic [ref=e230]:
                      - generic [ref=e231]: info
                      - generic [ref=e232]: 11:48:00 AM
                    - generic [ref=e233]: http.request
                    - generic [ref=e234]: GET /health
                    - generic [ref=e235]: "request_id: req_1778428080741_d9cxep9l"
                  - generic [ref=e236]:
                    - generic [ref=e237]:
                      - generic [ref=e238]: success
                      - generic [ref=e239]: 11:47:54 AM
                    - generic [ref=e240]: http.response
                    - generic [ref=e241]: GET /auth/me -> 200
                    - generic [ref=e242]: "request_id: req_1778428074111_zj8wgi08"
                  - generic [ref=e243]:
                    - generic [ref=e244]:
                      - generic [ref=e245]: info
                      - generic [ref=e246]: 11:47:54 AM
                    - generic [ref=e247]: http.request
                    - generic [ref=e248]: GET /auth/me
                    - generic [ref=e249]: "request_id: req_1778428074111_zj8wgi08"
```

# Test source

```ts
  1 | import { test, expect } from "@playwright/test";
  2 | import { loginAsAdmin } from "./fixtures/auth";
  3 | 
  4 | test("admin can login", async ({ page }) => {
  5 |   await loginAsAdmin(page);
  6 | 
> 7 |   await expect(page.getByText("Dashboard")).toBeVisible();
    |                                             ^ Error: expect(locator).toBeVisible() failed
  8 | });
```