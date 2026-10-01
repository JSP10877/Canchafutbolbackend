import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { config } from './config.js';
import { connectDB, disconnectDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

// ---- Middlewares globales -------------------------------------------------
app.use(helmet()); // cabeceras de seguridad (y oculta x-powered-by)
app.use(
  cors({
    origin: config.clientUrls,
    credentials: true, // necesario para que el navegador envíe/reciba la cookie
  }),
);
app.use(morgan(config.isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// ---- Rutas ----------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);

// ---- 404 y errores (siempre al final) ---------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---- Arranque ---------------------------------------------------------------
const start = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`[Servidor] Escuchando en el puerto ${config.port} (${config.env})`);
    });

    // Apagado ordenado: termina las peticiones en curso y cierra Mongo.
    const shutdown = (signal) => {
      console.log(`[Servidor] ${signal} recibido, cerrando...`);
      server.close(async () => {
        try {
          await disconnectDB();
          process.exit(0);
        } catch (error) {
          console.error('[Servidor] Error al cerrar:', error.message);
          process.exit(1);
        }
      });
      setTimeout(() => process.exit(1), 10_000).unref(); // por si algo se cuelga
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[Servidor] No se pudo iniciar:', error.message);
    process.exit(1);
  }
};

start();
