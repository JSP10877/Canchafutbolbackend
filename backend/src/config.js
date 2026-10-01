import 'dotenv/config';

/**
 * Configuración centralizada. Nada más en el proyecto debe leer process.env
 * directamente: todo pasa por `config`.
 */

const env = process.env.NODE_ENV ?? 'development';
const isProd = env === 'production';

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
  }
  return value;
};

const jwtSecret = required('JWT_SECRET');
if (isProd && jwtSecret.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción');
}

const sameSite = (process.env.COOKIE_SAMESITE ?? 'lax').trim().toLowerCase();
if (!['lax', 'strict', 'none'].includes(sameSite)) {
  throw new Error('COOKIE_SAMESITE debe ser "lax", "strict" o "none"');
}

export const config = Object.freeze({
  env,
  isProd,
  port: Number(process.env.PORT) || 4000,

  // En desarrollo hay un valor por defecto; en producción es obligatoria.
  mongoUri:
    process.env.MONGO_URI?.trim() ||
    (isProd ? required('MONGO_URI') : 'mongodb://127.0.0.1:27017/cancha_futbol'),

  jwtSecret,
  jwtExpiresIn: '1d',
  cookieMaxAgeMs: 24 * 60 * 60 * 1000, // debe coincidir con jwtExpiresIn
  cookieSameSite: sameSite,

  // Orígenes permitidos por CORS (separados por coma). Vite usa 5173 por defecto.
  clientUrls: (process.env.CLIENT_URL ?? 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),

  // Zona horaria del negocio: define qué es "hoy" y "ahora" al validar reservas.
  timezone: process.env.TIMEZONE?.trim() || 'America/Bogota',
});
