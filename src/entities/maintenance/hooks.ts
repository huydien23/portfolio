/**
 * useMaintenance — reads the singleton `site/maintenance` doc.
 *
 * Returns both the raw `enabled` flag and `isActive` (after schedule is
 * applied). The hook ticks every 30s so the schedule re-evaluates against
 * the wall clock without a Firestore round-trip.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { subscribeMaintenance } from './api';
import { MaintenanceContent, DEFAULT_MAINTENANCE, isEffectivelyEnabled } from './model';

const CACHE_KEY = 'portfolio:maintenance:v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const TICK_MS = 30_000;

export type MaintenanceSource = 'firestore' | 'cache' | 'default';

export interface UseMaintenanceResult {
  profile: MaintenanceContent;
  loading: boolean;
  source: MaintenanceSource;
  error: Error | null;
  refetch: () => void;
  /** Effective state after the schedule is applied. */
  isActive: boolean;
  /** Raw `enabled` flag straight from Firestore, ignoring the schedule. */
  rawEnabled: boolean;
}

interface CachePayload {
  ts: number;
  data: MaintenanceContent;
}

const readCache = (): MaintenanceContent | null => {
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

const writeCache = (data: MaintenanceContent) => {
  try {
    const payload: CachePayload = { ts: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* quota */
  }
};

export const useMaintenance = (): UseMaintenanceResult => {
  const cached = useRef<MaintenanceContent | null>(readCache());

  const [profile, setProfile] = useState<MaintenanceContent>(
    cached.current ?? DEFAULT_MAINTENANCE,
  );
  const [source, setSource] = useState<MaintenanceSource>(cached.current ? 'cache' : 'default');
  const [loading, setLoading] = useState(cached.current === null);
  const [error, setError] = useState<Error | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);
  // Re-evaluates the schedule against the wall clock every TICK_MS.
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeMaintenance(
      data => {
        if (data) {
          setProfile(data);
          setSource('firestore');
          writeCache(data);
        } else {
          setProfile(DEFAULT_MAINTENANCE);
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
          setProfile(DEFAULT_MAINTENANCE);
          setSource('default');
        }
      },
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const isActive = useMemo(() => isEffectivelyEnabled(profile, nowMs), [profile, nowMs]);

  return {
    profile,
    loading,
    source,
    error,
    refetch: () => setRefetchKey(k => k + 1),
    isActive,
    rawEnabled: profile.enabled,
  };
};
