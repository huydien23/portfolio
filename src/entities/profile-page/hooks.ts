/**
 * useProfilePage — reads the singleton `site/profile-page` doc.
 * Mirrors the cache → firestore → default fallback pattern used across
 * the other entities. localStorage TTL: 24h.
 */

import { useEffect, useRef, useState } from 'react';
import { subscribeProfilePage } from './api';
import { ProfilePage, DEFAULT_PROFILE_PAGE } from './model';

const CACHE_KEY = 'portfolio:profile-page:v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export type ProfilePageSource = 'firestore' | 'cache' | 'default';

export interface UseProfilePageResult {
  data: ProfilePage;
  loading: boolean;
  source: ProfilePageSource;
  error: Error | null;
  refetch: () => void;
}

interface CachePayload {
  ts: number;
  data: ProfilePage;
}

const readCache = (): ProfilePage | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed?.ts || !parsed.data) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (data: ProfilePage) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data } satisfies CachePayload));
  } catch {
    /* quota */
  }
};

export const useProfilePage = (): UseProfilePageResult => {
  const cached = useRef<ProfilePage | null>(readCache());

  const [data, setData] = useState<ProfilePage>(
    cached.current ?? DEFAULT_PROFILE_PAGE,
  );
  const [source, setSource] = useState<ProfilePageSource>(cached.current ? 'cache' : 'default');
  const [loading, setLoading] = useState(cached.current === null);
  const [error, setError] = useState<Error | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeProfilePage(
      next => {
        if (next) {
          setData(next);
          setSource('firestore');
          writeCache(next);
        } else {
          setData(DEFAULT_PROFILE_PAGE);
          setSource('default');
        }
        setLoading(false);
        setError(null);
      },
      err => {
        setError(err);
        setLoading(false);
        if (cached.current) {
          setData(cached.current);
          setSource('cache');
        } else {
          setData(DEFAULT_PROFILE_PAGE);
          setSource('default');
        }
      },
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  return {
    data,
    loading,
    source,
    error,
    refetch: () => setRefetchKey(k => k + 1),
  };
};
