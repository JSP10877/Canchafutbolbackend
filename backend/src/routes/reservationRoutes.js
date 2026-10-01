import { Router } from 'express';
import {
  cancelReservation,
  createReservation,
  getAvailability,
  listReservations,
} from '../controllers/reservationController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// Pública: solo expone horas ocupadas, sin datos personales.
router.get('/availability', getAvailability);

// Privadas: requieren sesión iniciada.
router.get('/', authRequired, listReservations);
router.post('/', authRequired, createReservation);
router.delete('/:id', authRequired, cancelReservation);

export default router;
