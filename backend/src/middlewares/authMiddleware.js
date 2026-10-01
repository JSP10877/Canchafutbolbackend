import User from '../models/User.js';
import { AUTH_COOKIE, verifyAccessToken } from '../libs/jwt.js';

const extractToken = (req) => {
  // 1) Cookie httpOnly (la usa el frontend web).
  const cookieToken = req.cookies?.[AUTH_COOKIE];
  if (typeof cookieToken === 'string' && cookieToken) return cookieToken;

  // 2) Header "Authorization: Bearer <token>" (Postman, apps móviles, etc.).
  const header = req.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7).trim() || null;
  }

  return null;
};

/**
 * Protege rutas privadas. Si el token es válido y el usuario sigue existiendo,
 * deja sus datos en `req.user` = { id, nombre, correo, telefono, role }.
 */
export const authRequired = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'No autenticado: inicia sesión para continuar' });
    }

    let payload;
    try {
      payload = await verifyAccessToken(token);
    } catch {
      // Token mal formado, firmado con otra clave o vencido.
      return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }

    // Se consulta la BD para que un usuario eliminado pierda el acceso
    // aunque su token todavía no haya vencido.
    const user = await User.findById(payload.id).select('nombre correo telefono role').lean();
    if (!user) {
      return res.status(401).json({ message: 'El usuario de esta sesión ya no existe' });
    }

    req.user = {
      id: user._id.toString(),
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};
