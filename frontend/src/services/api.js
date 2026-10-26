/**
 * Cliente HTTP único para hablar con la API.
 * - Envía siempre las cookies (credentials: 'include'): ahí viaja el JWT.
 * - Convierte cualquier fallo en un ApiError con un mensaje legible para
 *   mostrar en pantalla y, si hubo respuesta, el código HTTP.
 */
const BASE_URL = (import.meta.env?.VITE_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // 0 = no hubo respuesta (servidor caído, sin red)
  }
}

export async function apiFetch(path, { method = 'GET', body, params, signal } = {}) {
  const url = new URL(`${BASE_URL}/api${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    // Una petición cancelada a propósito no es un error que mostrar.
    if (error.name === 'AbortError') throw error;
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Ocurrió un error inesperado en el servidor', response.status);
  }
  return data;
}
