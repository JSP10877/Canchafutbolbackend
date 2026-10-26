/**
 * Crea o designa un administrador.
 *
 *   1) Define ADMIN_CORREO (y ADMIN_NOMBRE / ADMIN_PASSWORD) en backend/.env
 *   2) Ejecuta:  npm run seed:admin
 *
 * - Si el correo YA existe: ese usuario pasa a rol "admin" y no se toca su
 *   contraseña (no hace falta ADMIN_PASSWORD).
 * - Si NO existe: se crea con ADMIN_PASSWORD (mínimo 8 caracteres).
 *
 * Es idempotente: puedes ejecutarlo varias veces sin duplicar nada.
 */
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { connectDB, disconnectDB } from '../db.js';
import User, { EMAIL_RE } from '../models/User.js';

const SALT_ROUNDS = 12;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72; // límite de bcrypt

export const ensureAdmin = async ({ nombre, correo, password }) => {
  if (typeof correo !== 'string' || !EMAIL_RE.test(correo.trim())) {
    throw new Error('ADMIN_CORREO no es un correo válido');
  }
  const email = correo.trim().toLowerCase();

  const existing = await User.findOne({ correo: email });

  if (existing) {
    if (existing.role === 'admin') return { action: 'unchanged', correo: email };
    // updateOne evita re-validar el documento completo (la contraseña no se carga).
    await User.updateOne({ _id: existing._id }, { $set: { role: 'admin' } });
    return { action: 'promoted', correo: email };
  }

  if (typeof password !== 'string' || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    throw new Error(
      `El usuario no existe y hay que crearlo: ADMIN_PASSWORD debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres`,
    );
  }

  await User.create({
    nombre: (nombre || 'Administrador').trim(),
    correo: email,
    password: await bcrypt.hash(password, SALT_ROUNDS),
    role: 'admin',
  });
  return { action: 'created', correo: email };
};

const MENSAJES = {
  created: 'Administrador creado',
  promoted: 'El usuario ya existía y ahora es administrador',
  unchanged: 'El usuario ya era administrador, no hubo cambios',
};

const main = async () => {
  let exitCode = 0;
  try {
    await connectDB();
    const result = await ensureAdmin({
      nombre: process.env.ADMIN_NOMBRE,
      correo: process.env.ADMIN_CORREO,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log(`[Seed] ${MENSAJES[result.action]}: ${result.correo}`);
    if (result.action === 'created') {
      console.log('[Seed] Recomendación: borra ADMIN_PASSWORD de tu .env ahora que ya no lo necesitas.');
    }
  } catch (error) {
    console.error(`[Seed] Error: ${error.message}`);
    exitCode = 1;
  } finally {
    await disconnectDB().catch(() => {});
  }
  process.exit(exitCode);
};

// Solo se ejecuta al lanzarlo con node/npm, no cuando se importa (para poder probarlo).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
