#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

printf '\n[1/4] Importing Google Form responses (if file exists) ...\n'
if [[ -f "data/pathways/sources/google_form_responses.csv" ]]; then
  npm run pathways:import-google
else
  printf 'No google_form_responses.csv found. Skipping import step.\n'
fi

printf '\n[2/4] Merging Finalsite + alumni source CSV files ...\n'
npm run pathways:merge

printf '\n[3/4] Building generated pathways data for app ...\n'
npm run build:pathways

printf '\n[4/4] Running fast validation build ...\n'
npm run build >/dev/null

printf '\nAdmissions data update completed successfully.\n'
printf 'Updated files:\n'
printf ' - data/pathways/pathways_master.csv\n'
printf ' - src/lib/pathwaysData.generated.js\n\n'
printf 'Next step: commit and push your changes.\n\n'
