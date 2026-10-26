import { useCallback } from 'react';
import { getStats } from '../services/adminService';
import { useApiResource } from './useApiResource';

export function useAdminStats() {
  const fetcher = useCallback((signal) => getStats(signal), []);
  return useApiResource(fetcher);
}
