export function formatDate(d: Date): string {
  const rounded = new Date(Math.round(d.getTime() / 60000) * 60000); // absorbe el desfase de segundos
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${rounded.getFullYear()}-${pad(rounded.getMonth() + 1)}-${pad(rounded.getDate())}`;
  const hasTime = rounded.getHours() !== 0 || rounded.getMinutes() !== 0;
  return hasTime ? `${date}T${pad(rounded.getHours())}:${pad(rounded.getMinutes())}` : date;
}

export function normalizeCell(value: unknown): unknown {
  if (value instanceof Date) return formatDate(value);
  if (value == null) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // "$1,234.50", "1,234", "-45.2"
    if (/^-?\$?\s?\d{1,3}(,\d{3})*(\.\d+)?$|^-?\$?\s?\d+(\.\d+)?$/.test(trimmed)) {
      return Number(trimmed.replace(/[$,\s]/g, ''));
    }
    return trimmed;
  }
  return value;
}