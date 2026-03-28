# Release Checklist

## Code Quality

- [ ] typecheck passes
- [ ] lint passes
- [ ] tests pass
- [ ] no obvious dead code
- [ ] no `any` where avoidable

## Backend

- [ ] control-plane boots cleanly
- [ ] gateway boots cleanly
- [ ] database initializes correctly
- [ ] admin login works
- [ ] route creation works
- [ ] policy creation works
- [ ] snapshot publish works
- [ ] snapshot activate works
- [ ] snapshot rollback works
- [ ] policy document import/export works
- [ ] audit endpoints work
- [ ] deployment history endpoints work
- [ ] admin user endpoints work

## Frontend

- [ ] login works
- [ ] sidebar icons render correctly
- [ ] dashboard frame is clean
- [ ] routes page works
- [ ] policies page works
- [ ] simulation page works
- [ ] snapshots page works
- [ ] audit page works
- [ ] deployments page works
- [ ] policy documents page works
- [ ] admin users page works

## RBAC

- [ ] viewer sees read-only experience
- [ ] security sees extended capabilities
- [ ] admin sees full capabilities

## Observability

- [ ] request_id is attached from frontend
- [ ] backend returns x-request-id
- [ ] deployment history stores request correlation
- [ ] audit stores actor attribution
- [ ] recent UI events panel works

## Portfolio Readiness

- [ ] README is complete
- [ ] demo scenario is documented
- [ ] screenshots or GIFs added
- [ ] .env.example files are present
- [ ] scripts are clean
