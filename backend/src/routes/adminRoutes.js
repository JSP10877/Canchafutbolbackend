import { Router } from 'express';
import { getStats, listAllReservations } from '../controllers/adminController.js';
import { adminOnly, authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// Todo lo que cuelga de /api/admin exige sesión iniciada Y rol "admin".
// Si en el futuro se agrega otra ruta aquí, queda protegida automáticamente.
router.use(authRequired, adminOnly);

router.get('/stats', getStats);
router.get('/reservations', listAllReservations);

export default router;
