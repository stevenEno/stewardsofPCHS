export function parseCsvLine(line) {
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

export function parseCsv(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header and at least one data row.');
  }

  const header = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  return { header, rows };
}

export function toObjects(header, rows) {
  return rows.map((values) => {
    const row = {};
    header.forEach((column, index) => {
      row[column] = (values[index] || '').trim();
    });
    return row;
  });
}

function escapeCsvValue(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(header, rows) {
  const lines = [header.map(escapeCsvValue).join(',')];

  rows.forEach((row) => {
    const line = header.map((column) => escapeCsvValue(row[column] || '')).join(',');
    lines.push(line);
  });

  return `${lines.join('\n')}\n`;
}

export function requireColumns(header, requiredColumns) {
  const missing = requiredColumns.filter((column) => !header.includes(column));
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`);
  }
}
