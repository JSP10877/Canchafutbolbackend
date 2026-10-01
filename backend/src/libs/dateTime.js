import { config } from '../config.js';

/**
 * Las fechas se manejan como texto "YYYY-MM-DD" y las horas como "HH:mm"
 * (igual que el frontend). Se evita `Date` para la fecha de la reserva
 * porque Colombia es UTC-5 y los desfases de zona horaria mueven reservas
 * de día sin que nadie lo note.
 */

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
// La hora de fin puede ser "24:00" (reserva que termina a medianoche).
export const END_TIME_RE = /^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/;

/** Comprueba que sea una fecha real (rechaza "2026-02-30"). */
export const isRealDate = (value) => {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

/** Día de la semana de un "YYYY-MM-DD": 0 = domingo ... 6 = sábado. */
export const dayOfWeek = (fecha) => {
  const [year, month, day] = fecha.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

/** "HH:mm" -> minutos desde las 00:00. */
export const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/** Fecha de hoy ("YYYY-MM-DD") en la zona horaria del negocio. */
export const todayInTz = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: config.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

/** Hora actual ("HH:mm") en la zona horaria del negocio. */
export const nowTimeInTz = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: config.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date());
