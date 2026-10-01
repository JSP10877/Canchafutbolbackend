import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const AUTH_COOKIE = 'token';

export const createAccessToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.jwtSecret,
      { algorithm: 'HS256', expiresIn: config.jwtExpiresIn },
      (error, token) => (error ? reject(error) : resolve(token)),
    );
  });

export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) => {
    // Se fija el algoritmo para evitar ataques de "algorithm confusion".
    jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }, (error, decoded) =>
      error ? reject(error) : resolve(decoded),
    );
  });

// httpOnly: el JS del navegador no puede leer el token (mitiga robo por XSS).
const cookieOptions = {
  httpOnly: true,
  secure: config.isProd,
  sameSite: config.cookieSameSite,
  path: '/',
};

export const setAuthCookie = (res, token) =>
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions, maxAge: config.cookieMaxAgeMs });

// Para borrar una cookie hay que usar las mismas opciones con que se creó.
export const clearAuthCookie = (res) => res.clearCookie(AUTH_COOKIE, cookieOptions);
