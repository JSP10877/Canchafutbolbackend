const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});
const integer = new Intl.NumberFormat('es-CO');

export const formatCurrency = (value) => currency.format(value ?? 0);
export const formatNumber = (value) => integer.format(value ?? 0);

// Las fechas llegan como "YYYY-MM-DD". Se interpretan y se muestran en UTC
// para que la zona horaria del navegador nunca las corra un día.
const toUtcDate = (ymd) => {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const formatDate = (ymd) =>
  toUtcDate(ymd).toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const formatDateShort = (ymd) =>
  toUtcDate(ymd).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export const formatDuration = (hours) => `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
