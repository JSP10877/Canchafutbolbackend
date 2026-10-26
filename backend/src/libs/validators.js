/**
 * Convierte a entero positivo si el valor es un número o un texto solo de
 * dígitos ("3" o 3). Rechaza true, "", [], {}, "3abc", 0, -1...
 * Devuelve null si no es válido.
 */
export const parsePositiveInt = (value) => {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return value;
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const number = Number(value);
    return number >= 1 ? number : null;
  }
  return null;
};
