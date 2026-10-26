import Reservation from '../models/Reservation.js';
import { CANCHAS, describeCancha } from '../data/canchas.js';
import { hoursBetween, isRealDate, todayInTz, weekRange } from '../libs/dateTime.js';
import { parsePositiveInt } from '../libs/validators.js';
import { toReservationDto } from '../libs/serializers.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const ESTADOS_FILTRO = ['activa', 'cancelada', 'todas'];

// ---------------------------------------------------------------------------
// Estadísticas
// ---------------------------------------------------------------------------

/**
 * Agrupa las reservas ACTIVAS por (cancha, hora de inicio, hora de fin).
 * Esa combinación tiene pocas variantes posibles, así que el resultado es
 * pequeño aunque haya miles de reservas; las horas y los ingresos se calculan
 * después en JavaScript con el catálogo de tarifas.
 */
const usageBy = (match = {}) =>
  Reservation.aggregate([
    { $match: { estado: 'activa', ...match } },
    {
      $group: {
        _id: { canchaId: '$canchaId', horaInicio: '$horaInicio', horaFin: '$horaFin' },
        reservas: { $sum: 1 },
      },
    },
  ]);

const emptyRow = (cancha) => ({
  canchaId: cancha.id,
  nombre: cancha.nombre,
  deporte: cancha.deporte,
  precioPorHora: cancha.precioPorHora,
  reservas: 0,
  horas: 0,
  ingresos: 0,
});

/** Convierte las filas agrupadas en totales generales y por cancha. */
const summarize = (rows) => {
  const total = { reservas: 0, horas: 0, ingresos: 0 };
  const porCancha = new Map();

  for (const { _id, reservas } of rows) {
    const cancha = describeCancha(_id.canchaId);
    const horas = hoursBetween(_id.horaInicio, _id.horaFin) * reservas;
    const ingresos = horas * cancha.precioPorHora;

    total.reservas += reservas;
    total.horas += horas;
    total.ingresos += ingresos;

    const row = porCancha.get(cancha.id) ?? emptyRow(cancha);
    row.reservas += reservas;
    row.horas += horas;
    row.ingresos += ingresos;
    porCancha.set(cancha.id, row);
  }

  return { total, porCancha };
};

/** Todas las canchas del catálogo (incluso con 0 reservas), de mayor a menor. */
const buildDistribution = (porCancha, totalReservas) => {
  const rows = new Map(CANCHAS.map((cancha) => [cancha.id, emptyRow(cancha)]));
  for (const [id, row] of porCancha) rows.set(id, row);

  return [...rows.values()]
    .map((row) => ({
      ...row,
      porcentaje: totalReservas ? Math.round((row.reservas / totalReservas) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.reservas - a.reservas || b.ingresos - a.ingresos || a.canchaId - b.canchaId);
};

/**
 * GET /api/admin/stats
 * "Hoy" y "semana" se cuentan por la FECHA DE JUEGO de la reserva (no por el
 * día en que se hizo), en la zona horaria del negocio. La semana va de lunes
 * a domingo. Solo cuentan las reservas activas (las canceladas no).
 */
export const getStats = async (req, res, next) => {
  try {
    const hoy = todayInTz();
    const semana = weekRange(hoy);

    const [rowsHoy, rowsSemana, rowsAcumulado] = await Promise.all([
      usageBy({ fecha: hoy }),
      usageBy({ fecha: { $gte: semana.desde, $lte: semana.hasta } }),
      usageBy(),
    ]);

    const resumenHoy = summarize(rowsHoy);
    const resumenSemana = summarize(rowsSemana);
    const resumenAcumulado = summarize(rowsAcumulado);

    const porCancha = buildDistribution(resumenAcumulado.porCancha, resumenAcumulado.total.reservas);
    const lider = porCancha[0];

    return res.json({
      fecha: hoy,
      moneda: 'COP',
      hoy: resumenHoy.total,
      semana: { desde: semana.desde, hasta: semana.hasta, ...resumenSemana.total },
      acumulado: resumenAcumulado.total,
      porCancha,
      canchaMasReservada: lider && lider.reservas > 0 ? lider : null,
    });
  } catch (error) {
    return next(error);
  }
};

// ---------------------------------------------------------------------------
// Listado de reservas
// ---------------------------------------------------------------------------

/**
 * GET /api/admin/reservations
 * Filtros (todos opcionales):
 *   fecha=YYYY-MM-DD            un día exacto
 *   desde=YYYY-MM-DD&hasta=...  rango de fechas (inclusive)
 *   canchaId=3
 *   estado=activa|cancelada|todas   (por defecto: todas)
 *   page=1&limit=10             paginación (limit máximo 100)
 * Orden: de la más reciente a la más antigua.
 */
export const listAllReservations = async (req, res, next) => {
  try {
    const { fecha, desde, hasta, canchaId, estado = 'todas' } = req.query;

    const page = req.query.page === undefined ? 1 : parsePositiveInt(req.query.page);
    const limit = req.query.limit === undefined ? DEFAULT_LIMIT : parsePositiveInt(req.query.limit);

    if (!page) return res.status(400).json({ message: 'page debe ser un entero positivo' });
    if (!limit || limit > MAX_LIMIT) {
      return res.status(400).json({ message: `limit debe ser un entero entre 1 y ${MAX_LIMIT}` });
    }
    if (!ESTADOS_FILTRO.includes(estado)) {
      return res.status(400).json({ message: `estado debe ser: ${ESTADOS_FILTRO.join(', ')}` });
    }

    const filter = {};
    if (estado !== 'todas') filter.estado = estado;

    if (canchaId !== undefined) {
      const id = parsePositiveInt(canchaId);
      if (!id) return res.status(400).json({ message: 'canchaId inválido' });
      filter.canchaId = id;
    }

    // "fecha" es un atajo para desde = hasta = fecha.
    let rangoDesde = desde;
    let rangoHasta = hasta;
    if (fecha !== undefined) {
      if (!isRealDate(fecha)) {
        return res.status(400).json({ message: 'fecha inválida (formato YYYY-MM-DD)' });
      }
      rangoDesde = fecha;
      rangoHasta = fecha;
    }
    if (rangoDesde !== undefined && !isRealDate(rangoDesde)) {
      return res.status(400).json({ message: 'desde inválida (formato YYYY-MM-DD)' });
    }
    if (rangoHasta !== undefined && !isRealDate(rangoHasta)) {
      return res.status(400).json({ message: 'hasta inválida (formato YYYY-MM-DD)' });
    }
    if (rangoDesde !== undefined && rangoHasta !== undefined && rangoDesde > rangoHasta) {
      return res.status(400).json({ message: '"desde" no puede ser posterior a "hasta"' });
    }
    if (rangoDesde !== undefined || rangoHasta !== undefined) {
      filter.fecha = {};
      if (rangoDesde !== undefined) filter.fecha.$gte = rangoDesde;
      if (rangoHasta !== undefined) filter.fecha.$lte = rangoHasta;
    }

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .populate('user', 'nombre correo telefono') // nunca incluye la contraseña
        .sort({ fecha: -1, horaInicio: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Reservation.countDocuments(filter),
    ]);

    return res.json({
      reservations: reservations.map(toReservationDto),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
};
