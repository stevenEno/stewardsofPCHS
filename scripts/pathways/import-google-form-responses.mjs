import fs from 'node:fs/promises';
import path from 'node:path';
import { parseCsv, requireColumns, toCsv, toObjects } from './csv-utils.mjs';
import {
  PATHWAYS_COLUMNS,
  validatePathwaysRow,
  VERIFICATION_STATUSES,
  mergeKey,
  verificationRank
} from './pathways-schema.mjs';

const INPUT_FILE = process.env.GOOGLE_FORM_CSV || 'data/pathways/sources/google_form_responses.csv';
const OUTPUT_FILE = process.env.ALUMNI_OUTPUT_CSV || 'data/pathways/sources/alumni_form.csv';

const GOOGLE_COLUMNS = [
  'Timestamp',
  'Student Key',
  'Display Name (Alias)',
  'Graduation Year',
  'Origin Type',
  'Origin School',
  'Neighborhood',
  'Pacifica Programs',
  'Destination Type',
  'Destination Name',
  'Post-Pacifica Focus',
  'Pathway Story',
  'Verification Status'
];

function normalizeDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid Timestamp value: ${value}`);
  }
  return parsed.toISOString().slice(0, 10);
}

function normalizeVerification(value) {
  const normalized = String(value || 'self_reported').trim().toLowerCase().replace(/\s+/g, '_');

  if (VERIFICATION_STATUSES.has(normalized)) {
    return normalized;
  }

  if (normalized.includes('confirm') || normalized.includes('yes')) {
    return 'self_reported';
  }

  return 'unknown';
}

function pickBetter(existing, incoming) {
  const existingRank = verificationRank(existing.verification_status);
  const incomingRank = verificationRank(incoming.verification_status);

  if (incomingRank > existingRank) {
    return incoming;
  }
  if (incomingRank < existingRank) {
    return existing;
  }
  if (incoming.last_updated > existing.last_updated) {
    return incoming;
  }
  return existing;
}

async function main() {
  const csvText = await fs.readFile(INPUT_FILE, 'utf8');
  const { header, rows } = parseCsv(csvText);
  requireColumns(header, GOOGLE_COLUMNS);

  const objects = toObjects(header, rows);

  const normalized = objects.map((row, index) => {
    const mapped = {
      student_key: row['Student Key'],
      student_alias: row['Display Name (Alias)'],
      grad_year: row['Graduation Year'],
      origin_type: row['Origin Type'],
      origin_school: row['Origin School'],
      neighborhood: row['Neighborhood'],
      pacifica_program: row['Pacifica Programs'],
      destination_type: row['Destination Type'],
      destination_name: row['Destination Name'],
      post_pacifica_focus: row['Post-Pacifica Focus'],
      pathway_story: row['Pathway Story'],
      data_source: 'alumni_form',
      verification_status: normalizeVerification(row['Verification Status']),
      last_updated: normalizeDate(row.Timestamp)
    };

    validatePathwaysRow(mapped, index + 2);
    return mapped;
  });

  let existingRows = [];
  try {
    const existingText = await fs.readFile(OUTPUT_FILE, 'utf8');
    const parsed = parseCsv(existingText);
    requireColumns(parsed.header, PATHWAYS_COLUMNS);
    existingRows = toObjects(parsed.header, parsed.rows);
    existingRows.forEach((row, index) => validatePathwaysRow(row, index + 2));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const merged = new Map();
  [...existingRows, ...normalized].forEach((row) => {
    const key = mergeKey(row);
    if (!merged.has(key)) {
      merged.set(key, row);
      return;
    }
    merged.set(key, pickBetter(merged.get(key), row));
  });

  const outputRows = [...merged.values()].sort((a, b) => {
    if (a.grad_year !== b.grad_year) {
      return Number(b.grad_year) - Number(a.grad_year);
    }
    return a.student_alias.localeCompare(b.student_alias);
  });

  const outputCsv = toCsv(PATHWAYS_COLUMNS, outputRows);
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, outputCsv, 'utf8');

  console.log(`Imported ${normalized.length} responses into ${OUTPUT_FILE}; ${outputRows.length} total rows after merge.`);
}

main().catch((error) => {
  console.error(`Google form import failed: ${error.message}`);
  process.exit(1);
});
