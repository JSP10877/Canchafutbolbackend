import { useCallback } from 'react';
import { getMyReservations } from '../services/reservationService';
import { useApiResource } from './useApiResource';

/** Reservas activas del usuario. Con `enabled = false` (sin sesión) no llama a la API. */
export function useMyReservations(enabled) {
  const fetcher = useCallback(
    (signal) => (enabled ? getMyReservations(signal) : Promise.resolve({ reservations: [] })),
    [enabled],
  );
  return useApiResource(fetcher);
}
