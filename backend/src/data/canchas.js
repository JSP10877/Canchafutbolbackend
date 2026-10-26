/**
 * Catálogo de canchas del negocio.
 *
 * Es la ÚNICA fuente de verdad del backend para nombres y tarifas: el panel
 * de administración lo usa para mostrar el nombre de cada cancha y calcular
 * los ingresos. Los `id` son los mismos que usa el frontend en /reservas/:id.
 *
 * Los ingresos se calculan con la tarifa vigente de este archivo. Si algún día
 * las tarifas pasan a ser editables, habrá que guardar el precio dentro de
 * cada reserva en el momento de crearla para no alterar el historial.
 */
export const CANCHAS = Object.freeze([
  { id: 1, nombre: 'Fútbol Arena 5 Norte', deporte: 'Fútbol', precioPorHora: 35000 },
  { id: 2, nombre: 'Fútbol Arena 5 Sur', deporte: 'Fútbol', precioPorHora: 45000 },
  { id: 3, nombre: 'Fútbol Estadio Urbano', deporte: 'Fútbol', precioPorHora: 48000 },
  { id: 4, nombre: 'Pádel Cancha 1', deporte: 'Pádel', precioPorHora: 25000 },
  { id: 5, nombre: 'Pádel Cancha 2', deporte: 'Pádel', precioPorHora: 25000 },
  { id: 6, nombre: 'Pádel Cancha 3', deporte: 'Pádel', precioPorHora: 30000 },
  { id: 7, nombre: 'Voleibol Arena 1', deporte: 'Voleibol', precioPorHora: 35000 },
  { id: 8, nombre: 'Voleibol Piso', deporte: 'Voleibol', precioPorHora: 35000 },
  { id: 9, nombre: 'Voleibol Arena 2', deporte: 'Voleibol', precioPorHora: 30000 },
  { id: 10, nombre: 'Tenis Court 1', deporte: 'Tenis', precioPorHora: 40000 },
  { id: 11, nombre: 'Tenis Court 2', deporte: 'Tenis', precioPorHora: 42000 },
  { id: 12, nombre: 'Basket Arena 1', deporte: 'Baloncesto', precioPorHora: 38000 },
  { id: 13, nombre: 'Basket Arena 2', deporte: 'Baloncesto', precioPorHora: 40000 },
]);

const byId = new Map(CANCHAS.map((cancha) => [cancha.id, cancha]));

/** Devuelve la cancha o null si el id no existe en el catálogo. */
export const getCancha = (id) => byId.get(id) ?? null;

/**
 * Igual que getCancha pero nunca devuelve null: para reservas antiguas con
 * un canchaId que ya no está en el catálogo, el panel muestra "Cancha #N".
 */
export const describeCancha = (id) =>
  getCancha(id) ?? { id, nombre: `Cancha #${id}`, deporte: 'Sin clasificar', precioPorHora: 0 };
