# Pathways Data Operations (Admissions)

This workflow is designed so admissions can maintain Pathways of Pacifica without editing code.

## Quick update paths

## One-command admissions workflow (recommended)

Run:

```bash
npm run pathways:admissions-update
```

This script will:

1. Import Google Form responses if `data/pathways/sources/google_form_responses.csv` exists.
2. Merge Finalsite + alumni source files.
3. Rebuild generated pathways app data.
4. Run a production build validation.

## Option A: Finalsite + existing alumni CSV

1. Replace Finalsite export file:
   - `data/pathways/sources/finalsite_export.csv`
2. Confirm alumni file exists:
   - `data/pathways/sources/alumni_form.csv`
3. Run:

```bash
npm run pathways:refresh
```

## Option B: Finalsite + new Google Form responses

1. Replace Finalsite export:
   - `data/pathways/sources/finalsite_export.csv`
2. Export Google Form responses and place:
   - `data/pathways/sources/google_form_responses.csv`
3. Run:

```bash
npm run pathways:import-google
npm run pathways:refresh
```

## Generated outputs

- `data/pathways/pathways_master.csv`
- `src/lib/pathwaysData.generated.js`

## Publish flow

1. Commit changed files.
2. Push branch and open PR.
3. Merge PR to `main`.
4. Vercel auto-deploys.

## Validation and fail-fast behavior

The scripts fail with row-specific messages if data is invalid (missing required columns, wrong destination/origin type, invalid dates, etc.).

## Schema (required columns)

- `student_key`
- `student_alias`
- `grad_year`
- `origin_type` (`Elementary School` or `Middle School`)
- `origin_school`
- `neighborhood`
- `pacifica_program`
- `destination_type` (`College`, `Career`, `College Athletics`, `Service`, `Gap Year`, `Military`)
- `destination_name`
- `post_pacifica_focus`
- `pathway_story`
- `data_source`
- `verification_status` (`verified`, `self_reported`, `unknown`, `staff_verified`)
- `last_updated` (`YYYY-MM-DD`)

Template file:

- `data/pathways/templates/pathways_master_template.csv`

## Data governance guidance

- Use alias values for public display.
- Keep `student_key` stable for merges and dedupe.
- Prefer `verified`/`staff_verified` when records are confirmed.
- Keep monthly updates during school year and annual summer alumni refresh.
