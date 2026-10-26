const pad = (value) => String(value).padStart(2, '0');

/** Fecha de hoy "YYYY-MM-DD" en la hora LOCAL del usuario (toISOString da la de UTC y se adelanta un día de noche). */
export const todayLocal = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Día de la semana de "YYYY-MM-DD" (0 = domingo ... 6 = sábado), sin desfase de zona horaria. */
export const dayOfWeek = (ymd) => new Date(`${ymd}T00:00:00`).getDay();

/** "10:00" -> 10 */
export const hourOf = (hhmm) => parseInt(hhmm.split(':')[0], 10);

/** 10 -> "10:00" */
export const hourLabel = (hour) => `${pad(hour)}:00`;
