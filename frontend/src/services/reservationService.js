import { apiFetch } from './api';

/**
 * Rangos ocupados de una cancha en una fecha (público, sin datos personales).
 * Devuelve { ocupados: [{ horaInicio: "10:00", horaFin: "12:00" }, ...] }
 */
export const getAvailability = ({ canchaId, fecha }, signal) =>
  apiFetch('/reservations/availability', { params: { canchaId, fecha }, signal });

/** Reservas activas del usuario con sesión iniciada. */
export const getMyReservations = (signal) => apiFetch('/reservations', { signal });

/** body: { canchaId, fecha: "YYYY-MM-DD", horaInicio: "HH:mm", horaFin: "HH:mm" } */
export const createReservation = (body) => apiFetch('/reservations', { method: 'POST', body });

/** Cancela una reserva (su dueño, o un admin). */
export const cancelReservation = (id) =>
  apiFetch(`/reservations/${encodeURIComponent(id)}`, { method: 'DELETE' });
