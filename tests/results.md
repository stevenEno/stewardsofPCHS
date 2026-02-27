# Test Results

Date: 2026-02-22

## Environment

- Node: `v24.10.0`
- npm: `11.6.0`
- Workspace: `/Users/steveneno/stewardsofPCHS`

## Install

Command:

```bash
npm install
```

Result: pass

Notes:

- Dependencies installed successfully.
- npm reported 19 high severity vulnerabilities in transitive dependencies.

## Unit + Integration (Jest)

Command:

```bash
npm test
```

Result: pass

Summary:

- Test Suites: 4 passed, 4 total
- Tests: 8 passed, 8 total

## Production Build

Command:

```bash
npm run build
```

Result: pass

Summary:

- Vite production build completed successfully.
- Output generated in `dist/`.

## End-to-End (Cypress)

Command used:

```bash
npm run dev >/tmp/stewardsofPCHS-dev.log 2>&1 & pid=$!; sleep 3; npm run cypress; rc=$?; kill $pid; wait $pid 2>/dev/null; exit $rc
```

Result: pass

Summary:

- Specs: 2 passed (`pathways.cy.js`, `showcase.cy.js`)
- Tests: 4 passed, 0 failed
- Browser: Electron (headless)

Notes:

- `Opening /dev/tty failed (6): Device not configured` appeared in output but did not affect test completion.
