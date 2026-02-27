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

## Pathways CSV Build

Command:

```bash
npm run build:pathways
```

Result: pass

Summary:

- CSV validated successfully.
- Generated `src/lib/pathwaysData.generated.js` from `data/pathways/pathways_master.csv`.

## Pathways Import + Merge Pipeline

Commands:

```bash
npm run pathways:import-google
npm run pathways:refresh
```

Result: pass

Summary:

- Imported Google Form sample responses into `data/pathways/sources/alumni_form.csv` (merged with existing rows).
- Merged `data/pathways/sources/finalsite_export.csv` + `data/pathways/sources/alumni_form.csv` into `data/pathways/pathways_master.csv`.
- Regenerated `src/lib/pathwaysData.generated.js` with 9 pathways.

## Admissions One-Command Script

Command:

```bash
npm run pathways:admissions-update
```

Result: pass

Summary:

- Executed import, merge, generation, and build validation in one command.
- Script output confirms updated artifacts and next action (commit + push).

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
