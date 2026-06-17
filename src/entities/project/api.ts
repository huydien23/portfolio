import {
  collection,
  doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp, Timestamp,
  Unsubscribe, writeBatch,
} from 'firebase/firestore';
import { db } from '../../shared/api/firebase/config';
import { cleanPatch } from '../../shared/api/firebase/cleanPatch';
import { ProjectEntity, ProjectStatus } from './model';

const COLLECTION = 'projects';

// Firestore writes createdAt/updatedAt as Timestamp; expose them as ms to the UI.
type ProjectDoc = Omit<ProjectEntity, 'createdAt' | 'updatedAt'> & {
  createdAt?: Timestamp | number | null;
  updatedAt?: Timestamp | number | null;
};

const toMillis = (v: Timestamp | number | null | undefined): number | undefined => {
  if (v == null) return undefined;
  if (typeof v === 'number') return v;
  if (typeof v.toMillis === 'function') return v.toMillis();
  return undefined;
};

const fromDoc = (id: string, raw: Record<string, unknown>): ProjectEntity => {
  const d = raw as unknown as ProjectDoc;
  return {
    id,
    title: d.title ?? '',
    description: d.description ?? '',
    longDescription: d.longDescription,
    titleEn: d.titleEn,
    descriptionEn: d.descriptionEn,
    longDescriptionEn: d.longDescriptionEn,
    category: d.category ?? 'Frontend',
    tags: d.tags ?? [],
    imageUrl: d.imageUrl ?? '',
    imageData: d.imageData ?? null,
    gallery: d.gallery ?? [],
    videoUrl: d.videoUrl,
    highlights: d.highlights ?? [],
    githubUrl: d.githubUrl,
    liveUrl: d.liveUrl,
    year: d.year,
    featured: d.featured ?? false,
    status: (d.status as ProjectStatus) ?? 'published',
    order: d.order ?? 0,
    createdAt: toMillis(d.createdAt as Timestamp | number | null | undefined),
    updatedAt: toMillis(d.updatedAt as Timestamp | number | null | undefined),
  };
};

const projectsQuery = () => query(collection(db, COLLECTION), orderBy('order', 'asc'));

export const fetchProjects = async (): Promise<ProjectEntity[]> => {
  const snap = await getDocs(projectsQuery());
  return snap.docs.map(d => fromDoc(d.id, d.data()));
};

export const subscribeProjects = (
  onChange: (items: ProjectEntity[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe => {
  try {
    return onSnapshot(
      projectsQuery(),
      snap => onChange(snap.docs.map(d => fromDoc(d.id, d.data()))),
      err => onError?.(err),
    );
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error('Subscription failed'));
    return () => {};
  }
};

export const createProject = async (project: ProjectEntity): Promise<void> => {
  const { id, createdAt: _ca, updatedAt: _ua, ...rest } = project;
  void _ca;
  void _ua;
  await setDoc(
    doc(db, COLLECTION, id),
    cleanPatch({ ...rest, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  );
};

export const updateProject = async (id: string, patch: Partial<ProjectEntity>): Promise<void> => {
  const { id: _id, createdAt: _ca, updatedAt: _ua, ...rest } = patch;
  void _id;
  void _ca;
  void _ua;
  await updateDoc(
    doc(db, COLLECTION, id),
    cleanPatch({ ...rest, updatedAt: serverTimestamp() }),
  );
};

export const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};

// All-or-nothing — writeBatch is atomic across all listed operations.
export const bulkUpdateStatus = async (ids: string[], status: ProjectStatus): Promise<void> => {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  const now = serverTimestamp();
  for (const id of ids) {
    batch.update(doc(db, COLLECTION, id), { status, updatedAt: now });
  }
  await batch.commit();
};

export const bulkDeleteProjects = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  for (const id of ids) batch.delete(doc(db, COLLECTION, id));
  await batch.commit();
};

export const fetchProjectById = async (id: string): Promise<ProjectEntity | null> => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? fromDoc(snap.id, snap.data()) : null;
};
