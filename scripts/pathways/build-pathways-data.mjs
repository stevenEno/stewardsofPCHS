import fs from 'node:fs/promises';
import path from 'node:path';

const INPUT_FILE = process.env.PATHWAYS_CSV || 'data/pathways/pathways_master.csv';
const OUTPUT_FILE = process.env.PATHWAYS_OUTPUT || 'src/lib/pathwaysData.generated.js';

const REQUIRED_COLUMNS = [
  'student_key',
  'student_alias',
  'grad_year',
  'origin_type',
  'origin_school',
  'neighborhood',
  'pacifica_program',
  'destination_type',
  'destination_name',
  'post_pacifica_focus',
  'pathway_story',
  'data_source',
  'verification_status',
  'last_updated'
];

const ORIGIN_TYPES = new Set(['Elementary School', 'Middle School']);
const DESTINATION_TYPES = new Set(['College', 'Career', 'College Athletics', 'Service', 'Gap Year', 'Military']);
const VERIFICATION_STATUSES = new Set(['verified', 'self_reported', 'unknown', 'staff_verified']);

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsv(csvText) {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const header = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  return { header, rows };
}

function validateHeader(header) {
  const missing = REQUIRED_COLUMNS.filter((column) => !header.includes(column));
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function toPathwayRecord(row, index) {
  const id = row.id || `path-${slugify(`${row.student_alias}-${row.grad_year}-${index + 1}`)}`;

  if (!ORIGIN_TYPES.has(row.origin_type)) {
    throw new Error(`Row ${index + 2}: invalid origin_type "${row.origin_type}".`);
  }

  if (!DESTINATION_TYPES.has(row.destination_type)) {
    throw new Error(`Row ${index + 2}: invalid destination_type "${row.destination_type}".`);
  }

  if (!VERIFICATION_STATUSES.has(row.verification_status)) {
    throw new Error(`Row ${index + 2}: invalid verification_status "${row.verification_status}".`);
  }

  if (!/^\d{4}$/.test(row.grad_year)) {
    throw new Error(`Row ${index + 2}: grad_year must be a 4-digit year.`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.last_updated)) {
    throw new Error(`Row ${index + 2}: last_updated must use YYYY-MM-DD format.`);
  }

  return {
    id,
    studentAlias: row.student_alias,
    originType: row.origin_type,
    origin: row.origin_school,
    neighborhood: row.neighborhood,
    pacificaProgram: row.pacifica_program,
    destinationType: row.destination_type,
    destination: row.destination_name,
    postPacificaFocus: row.post_pacifica_focus,
    story: row.pathway_story,
    gradYear: Number(row.grad_year),
    studentKey: row.student_key,
    dataSource: row.data_source,
    verificationStatus: row.verification_status,
    lastUpdated: row.last_updated
  };
}

function asObjects(header, rows) {
  return rows.map((rowValues, rowIndex) => {
    const obj = {};
    header.forEach((columnName, colIndex) => {
      obj[columnName] = (rowValues[colIndex] || '').trim();
    });

    const missingFields = REQUIRED_COLUMNS.filter((column) => !obj[column]);
    if (missingFields.length > 0) {
      throw new Error(`Row ${rowIndex + 2}: missing values for ${missingFields.join(', ')}`);
    }

    return obj;
  });
}

function dedupeRows(rows) {
  const seen = new Set();
  const deduped = [];

  for (const row of rows) {
    const key = `${row.student_key}::${row.destination_name}::${row.grad_year}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(row);
  }

  return deduped;
}

function buildSummary(records) {
  const mostRecentDate = records.map((item) => item.lastUpdated).sort().at(-1);
  const uniqueOrigins = new Set(records.map((item) => item.origin)).size;
  const uniqueDestinations = new Set(records.map((item) => item.destination)).size;

  return {
    title: 'From All Neighborhoods, Toward Lives of Purpose',
    subtitle:
      'Pacifica welcomes students from many neighborhoods and backgrounds, then launches graduates into college and career pathways shaped by character, preparation, and service.',
    highlights: [
      `${uniqueOrigins} origin schools are represented in the current data set.`,
      `${uniqueDestinations} post-Pacifica destinations are represented across college and career pathways.`,
      `Dataset last refreshed on ${mostRecentDate}.`
    ],
    refreshedAt: mostRecentDate
  };
}

async function main() {
  const csvText = await fs.readFile(INPUT_FILE, 'utf8');
  const { header, rows } = parseCsv(csvText);
  validateHeader(header);

  const rowObjects = asObjects(header, rows);
  const deduped = dedupeRows(rowObjects);
  const pathways = deduped.map(toPathwayRecord);
  const pathwaysSummary = buildSummary(pathways);

  const moduleText = `// AUTO-GENERATED by scripts/pathways/build-pathways-data.mjs\n// Do not edit manually. Update data/pathways/pathways_master.csv and rerun npm run build:pathways.\n\nexport const pathwaysSummary = ${JSON.stringify(pathwaysSummary, null, 2)};\n\nexport const pathways = ${JSON.stringify(pathways, null, 2)};\n`;

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, moduleText, 'utf8');

  console.log(`Generated ${OUTPUT_FILE} from ${INPUT_FILE} (${pathways.length} pathways).`);
}

main().catch((error) => {
  console.error(`Pathways build failed: ${error.message}`);
  process.exit(1);
});
