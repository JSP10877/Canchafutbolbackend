import { useCallback } from 'react';
import { getReservations } from '../services/adminService';
import { useApiResource } from './useApiResource';

export function useAdminReservations({ page, limit, desde, hasta, canchaId, estado }) {
  const fetcher = useCallback(
    (signal) => getReservations({ page, limit, desde, hasta, canchaId, estado }, signal),
    [page, limit, desde, hasta, canchaId, estado],
  );
  return useApiResource(fetcher);
}
