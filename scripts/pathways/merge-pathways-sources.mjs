import fs from 'node:fs/promises';
import path from 'node:path';
import { parseCsv, requireColumns, toCsv, toObjects } from './csv-utils.mjs';
import {
  PATHWAYS_COLUMNS,
  mergeKey,
  validatePathwaysRow,
  verificationRank
} from './pathways-schema.mjs';

const FINALSITE_FILE = process.env.FINALSITE_CSV || 'data/pathways/sources/finalsite_export.csv';
const ALUMNI_FILE = process.env.ALUMNI_CSV || 'data/pathways/sources/alumni_form.csv';
const OUTPUT_FILE = process.env.PATHWAYS_MASTER_CSV || 'data/pathways/pathways_master.csv';

async function loadPathwaysCsv(filePath, sourceLabel) {
  const text = await fs.readFile(filePath, 'utf8');
  const { header, rows } = parseCsv(text);
  requireColumns(header, PATHWAYS_COLUMNS);

  const objects = toObjects(header, rows);
  objects.forEach((row, index) => validatePathwaysRow(row, index + 2));

  return objects.map((row) => ({ ...row, __source: sourceLabel }));
}

function chooseBetterRecord(current, candidate) {
  const currentRank = verificationRank(current.verification_status);
  const candidateRank = verificationRank(candidate.verification_status);

  if (candidateRank > currentRank) {
    return candidate;
  }

  if (candidateRank < currentRank) {
    return current;
  }

  if (candidate.last_updated > current.last_updated) {
    return candidate;
  }

  return current;
}

async function main() {
  const [finalsiteRows, alumniRows] = await Promise.all([
    loadPathwaysCsv(FINALSITE_FILE, 'finalsite_export'),
    loadPathwaysCsv(ALUMNI_FILE, 'alumni_form')
  ]);

  const merged = new Map();

  [...finalsiteRows, ...alumniRows].forEach((row) => {
    const key = mergeKey(row);
    if (!merged.has(key)) {
      merged.set(key, row);
      return;
    }

    merged.set(key, chooseBetterRecord(merged.get(key), row));
  });

  const outputRows = [...merged.values()]
    .map(({ __source, ...row }) => row)
    .sort((a, b) => {
      if (a.grad_year !== b.grad_year) {
        return Number(b.grad_year) - Number(a.grad_year);
      }
      return a.student_alias.localeCompare(b.student_alias);
    });

  const outputCsv = toCsv(PATHWAYS_COLUMNS, outputRows);
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, outputCsv, 'utf8');

  console.log(
    `Merged ${finalsiteRows.length} Finalsite rows + ${alumniRows.length} alumni rows into ${outputRows.length} master rows.`
  );
}

main().catch((error) => {
  console.error(`Pathways merge failed: ${error.message}`);
  process.exit(1);
});
