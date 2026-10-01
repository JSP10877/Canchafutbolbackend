import mongoose from 'mongoose';
import { DATE_RE, TIME_RE, END_TIME_RE } from '../libs/dateTime.js';

export const ESTADOS_RESERVA = ['activa', 'cancelada'];

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La reserva debe pertenecer a un usuario'],
      index: true,
    },
    // El frontend identifica las canchas con un número (1, 2, 3...).
    canchaId: {
      type: Number,
      required: [true, 'La cancha es obligatoria'],
      min: [1, 'canchaId inválido'],
      validate: {
        validator: Number.isInteger,
        message: 'canchaId debe ser un número entero',
      },
    },
    // "YYYY-MM-DD" como texto: evita desfases de zona horaria.
    fecha: {
      type: String,
      required: [true, 'La fecha es obligatoria'],
      match: [DATE_RE, 'La fecha debe tener formato YYYY-MM-DD'],
    },
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio es obligatoria'],
      match: [TIME_RE, 'La hora de inicio debe tener formato HH:mm'],
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de fin es obligatoria'],
      match: [END_TIME_RE, 'La hora de fin debe tener formato HH:mm'],
    },
    estado: {
      type: String,
      enum: ESTADOS_RESERVA,
      default: 'activa',
    },
  },
  { timestamps: true },
);

// La hora de fin debe ser posterior a la de inicio. (Los textos "HH:mm"
// con ceros a la izquierda se comparan correctamente como cadenas.)
reservationSchema.pre('validate', function () {
  if (this.horaInicio && this.horaFin && this.horaFin <= this.horaInicio) {
    this.invalidate('horaFin', 'La hora de fin debe ser posterior a la de inicio');
  }
});

// Red de seguridad contra carreras: aunque dos peticiones pasen a la vez la
// validación de traslape, la base de datos rechaza dos reservas ACTIVAS con
// el mismo inicio en la misma cancha y fecha. Las canceladas no cuentan,
// así que el horario queda libre otra vez.
reservationSchema.index(
  { canchaId: 1, fecha: 1, horaInicio: 1 },
  { unique: true, partialFilterExpression: { estado: 'activa' } },
);

export default mongoose.model('Reservation', reservationSchema);
