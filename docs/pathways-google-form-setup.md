# Google Form Setup for Alumni Pathways

This setup lets non-technical staff collect alumni updates and push them into the Pathways of Pacifica pipeline.

## 1) Create a Google Form

Use these exact question labels (matching is required by the import script):

- `Student Key` (short answer)
- `Display Name (Alias)` (short answer)
- `Graduation Year` (short answer, e.g. `2025`)
- `Origin Type` (dropdown: `Elementary School`, `Middle School`)
- `Origin School` (short answer)
- `Neighborhood` (short answer)
- `Pacifica Programs` (paragraph)
- `Destination Type` (dropdown: `College`, `Career`, `College Athletics`, `Service`, `Gap Year`, `Military`)
- `Destination Name` (short answer)
- `Post-Pacifica Focus` (short answer)
- `Pathway Story` (paragraph)
- `Verification Status` (dropdown: `self_reported`, `verified`, `unknown`, `staff_verified`)

Google automatically adds `Timestamp`.

## 2) Export responses as CSV

In Google Forms:

1. Open **Responses**.
2. Click **View in Sheets**.
3. In Google Sheets: **File -> Download -> Comma-separated values (.csv)**.

Save as:

- `data/pathways/sources/google_form_responses.csv`

## 3) Import into alumni source CSV

Run:

```bash
npm run pathways:import-google
```

This generates:

- `data/pathways/sources/alumni_form.csv`

## 4) Merge + regenerate site data

Run:

```bash
npm run pathways:refresh
```

This updates:

- `data/pathways/pathways_master.csv`
- `src/lib/pathwaysData.generated.js`

## 5) Publish

Commit and push changes, then open PR to `main`.

On merge, Vercel deploys updated pathways automatically.
