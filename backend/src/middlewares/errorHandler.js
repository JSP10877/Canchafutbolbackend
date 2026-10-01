export const notFound = (req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

/**
 * Manejador central. Los controladores hacen try/catch y delegan aquí con
 * next(error), así las respuestas de error son uniformes y nunca se filtran
 * detalles internos (stack traces, mensajes de MongoDB) al cliente.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  // Body que no es JSON válido o demasiado grande (lo lanza express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'El cuerpo de la petición es demasiado grande' });
  }

  // Validaciones del esquema de Mongoose.
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Datos inválidos',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // ID con formato inválido, por ejemplo en /reservations/:id.
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador inválido' });
  }

  // Violación de índice único.
  if (err.code === 11000) {
    const campos = Object.keys(err.keyPattern ?? {});
    if (campos.includes('correo')) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    if (campos.includes('horaInicio')) {
      return res.status(409).json({ message: 'Ese horario ya fue reservado para esta cancha' });
    }
    return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
  }

  console.error('[Error no controlado]', err);
  return res.status(500).json({ message: 'Error interno del servidor' });
};
