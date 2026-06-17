import { useEffect, useState, useRef } from 'react';
import { subscribeProjects } from './api';
import { ProjectEntity, ProjectStatus } from './model';
import { PROJECTS_DATA } from '../../shared/data/projects-data';
import { PROJECTS_DATA_EN } from '../../shared/data/projects-data.en';

const CACHE_KEY = 'portfolio:projects:v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

// Static data ships in 2 separate files (VI + EN) sharing the same id. We
// merge the EN row into the VI row at first paint so the runtime shape
// matches the Firestore ProjectEntity (which has flat *En fields).
type WithEnFallback = Omit<ProjectEntity, 'status' | 'order'> & {
  status: ProjectStatus;
  order: number;
};

const enById = new Map(PROJECTS_DATA_EN.map(p => [p.id, p]));

const toEntity = (
  vi: typeof PROJECTS_DATA[number],
  order: number,
  status: ProjectStatus = 'published',
): WithEnFallback => {
  const en = enById.get(vi.id);
  return {
    ...vi,
    titleEn: en?.title ?? vi.title,
    descriptionEn: en?.description ?? vi.description,
    longDescriptionEn: en?.longDescription ?? vi.longDescription,
    status,
    order,
  };
};

const STATIC_DATA: ProjectEntity[] = PROJECTS_DATA.map((p, i) => toEntity(p, i, 'published'));

interface CachePayload {
  ts: number;
  data: ProjectEntity[];
}

const readCache = (): ProjectEntity[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed?.ts || !Array.isArray(parsed.data)) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (data: ProjectEntity[]) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota exceeded */
  }
};

export type ProjectSource = 'firestore' | 'cache' | 'static';

export interface UseProjectsResult {
  projects: ProjectEntity[];
  loading: boolean;
  source: ProjectSource;
  error: Error | null;
  byId: Map<string, ProjectEntity>;
  refetch: () => void;
}

export const useProjects = (): UseProjectsResult => {
  const cached = useRef<ProjectEntity[] | null>(readCache());

  const [projects, setProjects] = useState<ProjectEntity[]>(cached.current ?? STATIC_DATA);
  const [source, setSource] = useState<ProjectSource>(cached.current ? 'cache' : 'static');
  const [loading, setLoading] = useState(cached.current === null);
  const [error, setError] = useState<Error | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    setLoading(true);

    const unsub = subscribeProjects(
      items => {
        if (items.length === 0) {
          setProjects(STATIC_DATA);
          setSource('static');
        } else {
          setProjects(items);
          setSource('firestore');
          writeCache(items);
        }
        setLoading(false);
        setError(null);
      },
      err => {
        setError(err);
        setLoading(false);
        if (cached.current && cached.current.length > 0) {
          setProjects(cached.current);
          setSource('cache');
        } else {
          setProjects(STATIC_DATA);
          setSource('static');
        }
      },
    );

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  const byId = new Map(projects.map(p => [p.id, p]));

  return {
    projects,
    loading,
    source,
    error,
    byId,
    refetch: () => setRefetchKey(k => k + 1),
  };
};

export const filterForPublic = (projects: ProjectEntity[]): ProjectEntity[] =>
  projects.filter(p => p.status !== 'draft');

// Featured projects are surfaced regardless of status — a `coming_soon`
// featured card is still shown, just rendered with a "not live yet" badge.
export const filterFeatured = (projects: ProjectEntity[]): ProjectEntity[] =>
  projects.filter(p => p.featured);
