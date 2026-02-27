export const PATHWAYS_COLUMNS = [
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

export const ORIGIN_TYPES = new Set(['Elementary School', 'Middle School']);
export const DESTINATION_TYPES = new Set(['College', 'Career', 'College Athletics', 'Service', 'Gap Year', 'Military']);
export const VERIFICATION_STATUSES = new Set(['verified', 'self_reported', 'unknown', 'staff_verified']);

export function validatePathwaysRow(row, rowNumber = 0) {
  const missingFields = PATHWAYS_COLUMNS.filter((column) => !String(row[column] || '').trim());
  if (missingFields.length > 0) {
    throw new Error(`Row ${rowNumber}: missing values for ${missingFields.join(', ')}`);
  }

  if (!ORIGIN_TYPES.has(row.origin_type)) {
    throw new Error(`Row ${rowNumber}: invalid origin_type \"${row.origin_type}\".`);
  }

  if (!DESTINATION_TYPES.has(row.destination_type)) {
    throw new Error(`Row ${rowNumber}: invalid destination_type \"${row.destination_type}\".`);
  }

  if (!VERIFICATION_STATUSES.has(row.verification_status)) {
    throw new Error(`Row ${rowNumber}: invalid verification_status \"${row.verification_status}\".`);
  }

  if (!/^\d{4}$/.test(row.grad_year)) {
    throw new Error(`Row ${rowNumber}: grad_year must be a 4-digit year.`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.last_updated)) {
    throw new Error(`Row ${rowNumber}: last_updated must use YYYY-MM-DD format.`);
  }
}

export function mergeKey(row) {
  return `${row.student_key}::${row.grad_year}::${row.destination_name}`.toLowerCase();
}

export function verificationRank(value) {
  if (value === 'staff_verified' || value === 'verified') {
    return 3;
  }
  if (value === 'self_reported') {
    return 2;
  }
  return 1;
}
