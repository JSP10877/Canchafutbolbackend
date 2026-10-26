import { describeCancha } from '../data/canchas.js';
import { hoursBetween } from './dateTime.js';

/**
 * Forma única con la que la API describe una reserva (la usan el panel de
 * administración y "mis reservas"). Espera la reserva con `user` populado;
 * si el usuario fue eliminado, `cliente` es null.
 */
export const toReservationDto = (reservation) => {
  const cancha = describeCancha(reservation.canchaId);
  const duracionHoras = hoursBetween(reservation.horaInicio, reservation.horaFin);
  const { user } = reservation;

  return {
    id: reservation._id,
    cliente: user
      ? {
          id: user._id,
          nombre: user.nombre,
          correo: user.correo,
          telefono: user.telefono || '',
        }
      : null,
    cancha: {
      id: cancha.id,
      nombre: cancha.nombre,
      deporte: cancha.deporte,
      precioPorHora: cancha.precioPorHora,
    },
    fecha: reservation.fecha,
    horaInicio: reservation.horaInicio,
    horaFin: reservation.horaFin,
    duracionHoras,
    total: duracionHoras * cancha.precioPorHora,
    estado: reservation.estado,
    creadaEn: reservation.createdAt,
  };
};
