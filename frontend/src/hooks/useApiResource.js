import { useCallback, useEffect, useState } from 'react';

/**
 * Carga un recurso de la API y expone { data, error, loading, refetch }.
 *
 * - `fetcher` recibe un AbortSignal y debe devolver una promesa. Debe ser
 *   estable (useCallback): cuando cambia, se vuelve a pedir.
 * - Si el usuario cambia de filtro antes de que llegue la respuesta anterior,
 *   esa petición se cancela, así una respuesta lenta nunca pisa a una nueva.
 * - Mientras llega la siguiente respuesta se conserva el dato anterior, para
 *   que la tabla no parpadee al cambiar de página.
 * - `loading` se deriva de comparar qué se pidió con qué se recibió, en vez de
 *   guardarlo en un estado aparte que habría que sincronizar en el efecto.
 */
export function useApiResource(fetcher) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({ fetcher: null, reloadCount: -1, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal)
      .then((data) => setResult({ fetcher, reloadCount, data, error: null }))
      .catch((error) => {
        if (error?.name === 'AbortError') return;
        setResult((previous) => ({ fetcher, reloadCount, data: previous.data, error }));
      });

    return () => controller.abort();
  }, [fetcher, reloadCount]);

  const loading = result.fetcher !== fetcher || result.reloadCount !== reloadCount;
  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  return { data: result.data, error: loading ? null : result.error, loading, refetch };
}
