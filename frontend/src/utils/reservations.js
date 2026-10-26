import { hourOf } from './dates';

/**
 * Convierte una reserva de la API al formato que ya usa MiPerfil.jsx
 * (hora, duracion, cancha como texto...), para no reescribir esa pantalla.
 */
export const toPerfilReserva = (reserva) => ({
  idReserva: reserva.id,
  canchaId: String(reserva.cancha.id),
  cancha: reserva.cancha.nombre,
  fecha: reserva.fecha,
  hora: reserva.horaInicio,
  duracion: reserva.duracionHoras,
  precioHora: reserva.cancha.precioPorHora,
});

/**
 * Convierte los rangos ocupados de la API al formato que ya usa Reservar.jsx
 * en ocupadoPorCruce() y reservaSeCruza().
 */
export const toOcupado = (canchaId, fecha, rango) => ({
  canchaId: String(canchaId),
  fecha,
  hora: rango.horaInicio,
  duracion: hourOf(rango.horaFin) - hourOf(rango.horaInicio),
});
