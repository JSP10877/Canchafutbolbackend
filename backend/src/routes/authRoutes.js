import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, profile, register } from '../controllers/authController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// Frena ataques de fuerza bruta contra login y registro.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Inténtalo de nuevo en unos minutos.' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);

export default router;
