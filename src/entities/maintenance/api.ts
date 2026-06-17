import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
  serverTimestamp, Timestamp, Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../shared/api/firebase/config';
import { cleanPatch } from '../../shared/api/firebase/cleanPatch';
import {
  MaintenanceContent, MaintenanceLogEntry,
  LocalizedString, MaintenanceAction,
  appendLog, DEFAULT_MAINTENANCE,
} from './model';

// Singleton doc: `site/maintenance`. Path must stay exactly 2 segments
// (collection/doc) — appending a third turns it into a subcollection and
// throws "Document references must have an even number of segments".
const maintenanceRef = () => doc(db, 'site', 'maintenance');

const toMillis = (v: Timestamp | number | null | undefined): number | undefined => {
  if (v == null) return undefined;
  if (typeof v === 'number') return v;
  if (typeof v.toMillis === 'function') return v.toMillis();
  return undefined;
};

const safeLoc = (v: unknown, fallback: string = ''): LocalizedString => {
  if (typeof v !== 'object' || v === null) return { vi: fallback, en: fallback };
  const o = v as Record<string, unknown>;
  return {
    vi: typeof o.vi === 'string' ? o.vi : fallback,
    en: typeof o.en === 'string' ? o.en : fallback,
  };
};

const fromDoc = (id: string, raw: Record<string, unknown>): MaintenanceContent => {
  const logs = Array.isArray(raw.logs) ? raw.logs : [];
  return {
    id: id as 'main',
    enabled: raw.enabled === true,
    title: safeLoc(raw.title, DEFAULT_MAINTENANCE.title.vi),
    message: safeLoc(raw.message, DEFAULT_MAINTENANCE.message.vi),
    etaText: raw.etaText && typeof raw.etaText === 'object'
      ? safeLoc(raw.etaText)
      : undefined,
    contactEmail: typeof raw.contactEmail === 'string' ? raw.contactEmail : '',
    scheduledStart: typeof raw.scheduledStart === 'number' ? raw.scheduledStart : undefined,
    scheduledEnd: typeof raw.scheduledEnd === 'number' ? raw.scheduledEnd : undefined,
    logs: logs
      .filter(l => typeof l === 'object' && l !== null)
      .map(l => {
        const e = l as Record<string, unknown>;
        return {
          timestamp: typeof e.timestamp === 'number' ? e.timestamp : 0,
          action: (typeof e.action === 'string' ? e.action : 'edit') as MaintenanceAction,
          note: typeof e.note === 'string' ? e.note : undefined,
        } as MaintenanceLogEntry;
      }),
    updatedAt: toMillis(raw.updatedAt as Timestamp | number | null | undefined),
  };
};

export const subscribeMaintenance = (
  onChange: (data: MaintenanceContent | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe => {
  try {
    return onSnapshot(
      maintenanceRef(),
      snap => {
        if (!snap.exists) {
          onChange(null);
          return;
        }
        onChange(fromDoc(snap.id, snap.data()));
      },
      err => onError?.(err),
    );
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error('Subscription failed'));
    return () => {};
  }
};

export const fetchMaintenance = async (): Promise<MaintenanceContent | null> => {
  const snap = await getDoc(maintenanceRef());
  return snap.exists ? fromDoc(snap.id, snap.data()) : null;
};

export const updateMaintenance = async (
  patch: Partial<Omit<MaintenanceContent, 'id' | 'updatedAt' | 'logs'>>,
  logEntry: MaintenanceLogEntry,
  currentLogs: MaintenanceLogEntry[] = [],
): Promise<void> => {
  const newLogs = appendLog(currentLogs, logEntry);
  await updateDoc(
    maintenanceRef(),
    cleanPatch({ ...patch, logs: newLogs, updatedAt: serverTimestamp() }),
  );
};

export const setMaintenance = async (content: MaintenanceContent): Promise<void> => {
  const { id: _id, updatedAt: _u, ...rest } = content;
  void _id;
  void _u;
  await setDoc(
    maintenanceRef(),
    cleanPatch({ ...rest, updatedAt: serverTimestamp() }),
  );
};
