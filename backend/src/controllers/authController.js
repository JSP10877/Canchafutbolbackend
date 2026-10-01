import bcrypt from 'bcryptjs';
import User, { EMAIL_RE } from '../models/User.js';
import { createAccessToken, setAuthCookie, clearAuthCookie } from '../libs/jwt.js';

const SALT_ROUNDS = 12;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72; // bcrypt solo procesa los primeros 72 bytes

// Hash "de mentira" para que login tarde lo mismo exista o no el correo
// (evita que alguien descubra qué correos están registrados midiendo tiempos).
const DUMMY_HASH = bcrypt.hashSync('contraseña-de-relleno', SALT_ROUNDS);

const publicUser = (user) => ({
  id: user._id,
  nombre: user.nombre,
  correo: user.correo,
  telefono: user.telefono,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = async (req, res, next) => {
  try {
    const { nombre, correo, telefono = '', password } = req.body ?? {};

    // typeof evita que lleguen objetos tipo { "$gt": "" } (inyección NoSQL).
    if (typeof nombre !== 'string' || nombre.trim().length < 2) {
      return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' });
    }
    if (typeof correo !== 'string' || !EMAIL_RE.test(correo.trim())) {
      return res.status(400).json({ message: 'El correo no tiene un formato válido' });
    }
    if (typeof telefono !== 'string') {
      return res.status(400).json({ message: 'El teléfono no es válido' });
    }
    if (
      typeof password !== 'string' ||
      password.length < PASSWORD_MIN ||
      password.length > PASSWORD_MAX
    ) {
      return res.status(400).json({
        message: `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres`,
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Si el correo ya existe, el índice único lanza el error 11000 y el
    // errorHandler responde 409 "El correo ya está registrado".
    // El rol nunca se toma del body: todo registro público es "user".
    const user = await User.create({
      nombre,
      correo,
      telefono,
      password: passwordHash,
    });

    const token = await createAccessToken({ id: user._id.toString() });
    setAuthCookie(res, token);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body ?? {};

    if (typeof correo !== 'string' || typeof password !== 'string' || !correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const user = await User.findOne({ correo: correo.trim().toLowerCase() }).select('+password');

    const passwordOk = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    // Mismo mensaje para "correo no existe" y "contraseña incorrecta".
    if (!user || !passwordOk) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = await createAccessToken({ id: user._id.toString() });
    setAuthCookie(res, token);

    return res.json({
      message: 'Sesión iniciada correctamente',
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    clearAuthCookie(res);
    return res.json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    return next(error);
  }
};

// El frontend la usa al cargar la página para saber si la cookie sigue vigente.
export const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
};
