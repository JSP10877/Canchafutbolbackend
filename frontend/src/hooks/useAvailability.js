import { useCallback } from 'react';
import { getAvailability } from '../services/reservationService';
import { useApiResource } from './useApiResource';

/** Horas ya ocupadas de una cancha en una fecha. Sin fecha no pide nada. */
export function useAvailability(canchaId, fecha) {
  const fetcher = useCallback(
    (signal) =>
      fecha ? getAvailability({ canchaId, fecha }, signal) : Promise.resolve({ ocupados: [] }),
    [canchaId, fecha],
  );
  return useApiResource(fetcher);
}
