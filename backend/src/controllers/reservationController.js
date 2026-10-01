import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import {
  END_TIME_RE,
  TIME_RE,
  dayOfWeek,
  isRealDate,
  nowTimeInTz,
  toMinutes,
  todayInTz,
} from '../libs/dateTime.js';

// ---- Reglas del negocio (las mismas que muestra el frontend) -------------
const HORARIO = {
  semana: { apertura: '08:00', cierre: '23:00' }, // lunes a viernes
  finDeSemana: { apertura: '07:00', cierre: '24:00' }, // sábado y domingo
};
const MIN_HORAS = 1;
const MAX_HORAS = 6;

// ---- Helpers --------------------------------------------------------------

// Acepta 3 o "3", pero no true, "", [], {}, "3abc"...
const parsePositiveInt = (value) => {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return value;
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const number = Number(value);
    return number >= 1 ? number : null;
  }
  return null;
};

const isAdmin = (user) => user.role === 'admin';

// ---- Controladores --------------------------------------------------------

export const createReservation = async (req, res, next) => {
  try {
    const { canchaId: rawCanchaId, fecha, horaInicio, horaFin } = req.body ?? {};

    // 1) Formato de los datos
    const canchaId = parsePositiveInt(rawCanchaId);
    if (!canchaId) {
      return res.status(400).json({ message: 'canchaId debe ser un número entero positivo' });
    }
    if (!isRealDate(fecha)) {
      return res.status(400).json({ message: 'La fecha debe ser real y tener formato YYYY-MM-DD' });
    }
    if (typeof horaInicio !== 'string' || !TIME_RE.test(horaInicio)) {
      return res.status(400).json({ message: 'horaInicio debe tener formato HH:mm' });
    }
    if (typeof horaFin !== 'string' || !END_TIME_RE.test(horaFin)) {
      return res.status(400).json({ message: 'horaFin debe tener formato HH:mm' });
    }

    // 2) Reglas de duración: bloques de horas completas, entre 1 y 6 horas
    const inicioMin = toMinutes(horaInicio);
    const finMin = toMinutes(horaFin);
    const duracionMin = finMin - inicioMin;

    if (inicioMin % 60 !== 0 || finMin % 60 !== 0) {
      return res.status(400).json({ message: 'Las reservas son por horas completas (ej. 15:00 a 16:00)' });
    }
    if (duracionMin < MIN_HORAS * 60 || duracionMin > MAX_HORAS * 60) {
      return res.status(400).json({
        message: `La reserva debe durar entre ${MIN_HORAS} y ${MAX_HORAS} horas`,
      });
    }

    // 3) Horario de atención según el día
    const esFinDeSemana = [0, 6].includes(dayOfWeek(fecha));
    const horario = esFinDeSemana ? HORARIO.finDeSemana : HORARIO.semana;
    if (horaInicio < horario.apertura || horaFin > horario.cierre) {
      return res.status(400).json({
        message: `Ese día atendemos de ${horario.apertura} a ${horario.cierre}`,
      });
    }

    // 4) No se puede reservar en el pasado (según la hora de Colombia)
    const hoy = todayInTz();
    if (fecha < hoy || (fecha === hoy && horaInicio <= nowTimeInTz())) {
      return res.status(400).json({ message: 'No puedes reservar en una fecha u hora que ya pasó' });
    }

    // 5) Traslape: dos rangos se cruzan si cada uno empieza antes de que el otro termine
    const traslape = await Reservation.exists({
      canchaId,
      fecha,
      estado: 'activa',
      horaInicio: { $lt: horaFin },
      horaFin: { $gt: horaInicio },
    });
    if (traslape) {
      return res.status(409).json({ message: 'Ese horario ya está reservado para esta cancha' });
    }

    // Si dos peticiones llegan a la vez, el índice único (ver modelo) frena a la segunda.
    const reservation = await Reservation.create({
      user: req.user.id,
      canchaId,
      fecha,
      horaInicio,
      horaFin,
    });
    await reservation.populate('user', 'nombre correo telefono');

    return res.status(201).json({
      message: 'Reserva creada correctamente',
      reservation,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Lista reservas ACTIVAS con los datos del usuario populados.
 * - Usuario normal: solo ve las suyas.
 * - Admin: ve las de todos.
 * Filtros opcionales: ?canchaId=1&fecha=2026-10-05
 */
export const listReservations = async (req, res, next) => {
  try {
    const { canchaId, fecha } = req.query;
    const filter = { estado: 'activa' };

    if (!isAdmin(req.user)) filter.user = req.user.id;

    if (canchaId !== undefined) {
      const id = parsePositiveInt(canchaId);
      if (!id) return res.status(400).json({ message: 'canchaId inválido' });
      filter.canchaId = id;
    }
    if (fecha !== undefined) {
      if (!isRealDate(fecha)) return res.status(400).json({ message: 'fecha inválida (YYYY-MM-DD)' });
      filter.fecha = fecha;
    }

    const reservations = await Reservation.find(filter)
      .populate('user', 'nombre correo telefono') // nunca incluye la contraseña
      .sort({ fecha: 1, horaInicio: 1 })
      .lean();

    return res.json({ count: reservations.length, reservations });
  } catch (error) {
    return next(error);
  }
};

/**
 * Pública: devuelve SOLO los rangos ocupados de una cancha en una fecha,
 * sin datos de usuarios. El frontend la usa para pintar en rojo las horas
 * tomadas. GET /api/reservations/availability?canchaId=1&fecha=2026-10-05
 */
export const getAvailability = async (req, res, next) => {
  try {
    const canchaId = parsePositiveInt(req.query.canchaId);
    const { fecha } = req.query;

    if (!canchaId) return res.status(400).json({ message: 'canchaId inválido' });
    if (!isRealDate(fecha)) return res.status(400).json({ message: 'fecha inválida (YYYY-MM-DD)' });

    const ocupados = await Reservation.find({ canchaId, fecha, estado: 'activa' })
      .select('horaInicio horaFin -_id')
      .sort({ horaInicio: 1 })
      .lean();

    return res.json({ canchaId, fecha, ocupados });
  } catch (error) {
    return next(error);
  }
};

/**
 * Cancela una reserva. Es una cancelación "suave": la reserva queda con
 * estado "cancelada" (se conserva el historial) y el horario se libera.
 * Solo puede cancelarla su dueño o un admin.
 */
export const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Identificador de reserva inválido' });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const esDueno = reservation.user.toString() === req.user.id;
    if (!esDueno && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta reserva' });
    }

    if (reservation.estado === 'cancelada') {
      return res.status(409).json({ message: 'La reserva ya estaba cancelada' });
    }
    if (reservation.fecha < todayInTz()) {
      return res.status(400).json({ message: 'No se puede cancelar una reserva de una fecha pasada' });
    }

    reservation.estado = 'cancelada';
    await reservation.save();

    return res.json({ message: 'Reserva cancelada correctamente', reservation });
  } catch (error) {
    return next(error);
  }
};
