import mongoose from 'mongoose';
import { config } from './config.js';

mongoose.connection.on('error', (error) => {
  console.error('[MongoDB] Error:', error.message);
});
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Conexión perdida');
});

/**
 * Conecta a MongoDB. Si falla, relanza el error para que el arranque se
 * aborte: un servidor sin base de datos no tiene sentido (en el proyecto
 * del semestre el error se tragaba y la API quedaba "viva" pero rota).
 * No se imprime la URI para no filtrar credenciales en los logs.
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[MongoDB] Conectado a la base "${mongoose.connection.name}"`);
  } catch (error) {
    console.error('[MongoDB] No se pudo conectar:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
