import { apiFetch } from './api';

// Cancelar es la misma operación para el cliente y para el admin.
export { cancelReservation } from './reservationService';

/** Indicadores del dashboard (reservas de hoy/semana, por cancha, ingresos). */
export const getStats = (signal) => apiFetch('/admin/stats', { signal });

/**
 * Reservas de todos los clientes, paginadas.
 * params: { page, limit, desde, hasta, canchaId, estado }
 */
export const getReservations = (params, signal) =>
  apiFetch('/admin/reservations', { params, signal });
