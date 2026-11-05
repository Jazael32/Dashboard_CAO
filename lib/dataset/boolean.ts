const TRUE_VALUES = new Set(['si', 'yes', 'y', 'true', 'verdadero']);
const FALSE_VALUES = new Set(['no', 'n', 'false', 'falso']);

const clean = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // quita acentos: "sí" -> "si"

// true = sí, false = no, null = no es un valor sí/no (vacío, texto, etc.)
export function parseBool(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  const s = clean(value);
  if (TRUE_VALUES.has(s)) return true;
  if (FALSE_VALUES.has(s)) return false;
  return null;
}