import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

export function useCachedResource(atomState, loadResource) {
  const [cache, setCache] = useRecoilState(atomState);
  const [hadInitialData] = useState(
    cache.hasLoaded || cache.data != null || (Array.isArray(cache.items) && cache.items.length > 0)
  );
  const [loading, setLoading] = useState(!hadInitialData);
  const [refreshing, setRefreshing] = useState(hadInitialData);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    loadResource()
      .then((data) => {
        if (isCurrent) {
          setCache({ data, items: data, hasLoaded: true });
          setError('');
        }
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message);
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [loadResource, setCache]);

  return { cache, setCache, loading, refreshing, error, setError };
}
