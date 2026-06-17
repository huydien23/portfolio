import { useEffect, useState, useRef } from 'react';
import { subscribeSiteProfile, subscribeSkills } from './api';
import {
  SiteProfile, SkillCategory, DEFAULT_SITE_PROFILE, DEFAULT_SKILLS,
} from './model';

const PROFILE_CACHE_KEY = 'portfolio:site-profile:v1';
const SKILLS_CACHE_KEY = 'portfolio:site-skills:v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

interface CachePayload<T> {
  ts: number;
  data: T;
}

const readCache = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload<T>;
    if (!parsed?.ts || !parsed.data) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota exceeded */
  }
};

export type SiteSource = 'firestore' | 'cache' | 'default';

export interface UseSiteProfileResult {
  profile: SiteProfile;
  loading: boolean;
  source: SiteSource;
  error: Error | null;
  refetch: () => void;
}

export const useSiteProfile = (): UseSiteProfileResult => {
  const cached = useRef<SiteProfile | null>(readCache<SiteProfile>(PROFILE_CACHE_KEY));

  const [profile, setProfile] = useState<SiteProfile>(
    cached.current ?? DEFAULT_SITE_PROFILE,
  );
  const [source, setSource] = useState<SiteSource>(cached.current ? 'cache' : 'default');
  const [loading, setLoading] = useState(cached.current === null);
  const [error, setError] = useState<Error | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    setLoading(true);

    const unsub = subscribeSiteProfile(
      data => {
        if (data) {
          setProfile(data);
          setSource('firestore');
          writeCache(PROFILE_CACHE_KEY, data);
        } else {
          setProfile(DEFAULT_SITE_PROFILE);
          setSource('default');
        }
        setLoading(false);
        setError(null);
      },
      err => {
        setError(err);
        setLoading(false);
        if (cached.current) {
          setProfile(cached.current);
          setSource('cache');
        } else {
          setProfile(DEFAULT_SITE_PROFILE);
          setSource('default');
        }
      },
    );

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  return {
    profile,
    loading,
    source,
    error,
    refetch: () => setRefetchKey(k => k + 1),
  };
};

export interface UseSkillsResult {
  categories: SkillCategory[];
  loading: boolean;
  source: SiteSource;
  error: Error | null;
  refetch: () => void;
}

export const useSkills = (): UseSkillsResult => {
  const cached = useRef<SkillCategory[] | null>(readCache<SkillCategory[]>(SKILLS_CACHE_KEY));

  const [categories, setCategories] = useState<SkillCategory[]>(
    cached.current ?? DEFAULT_SKILLS,
  );
  const [source, setSource] = useState<SiteSource>(cached.current ? 'cache' : 'default');
  const [loading, setLoading] = useState(cached.current === null);
  const [error, setError] = useState<Error | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    setLoading(true);

    const unsub = subscribeSkills(
      data => {
        if (data.length > 0) {
          setCategories(data);
          setSource('firestore');
          writeCache(SKILLS_CACHE_KEY, data);
        } else {
          setCategories(DEFAULT_SKILLS);
          setSource('default');
        }
        setLoading(false);
        setError(null);
      },
      err => {
        setError(err);
        setLoading(false);
        if (cached.current && cached.current.length > 0) {
          setCategories(cached.current);
          setSource('cache');
        } else {
          setCategories(DEFAULT_SKILLS);
          setSource('default');
        }
      },
    );

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  return {
    categories,
    loading,
    source,
    error,
    refetch: () => setRefetchKey(k => k + 1),
  };
};
