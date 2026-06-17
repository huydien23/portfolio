import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
  serverTimestamp, Timestamp, Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../shared/api/firebase/config';
import { cleanPatch } from '../../shared/api/firebase/cleanPatch';
import { LocalizedString } from '../site/model';
import {
  ProfilePage, Experience, Certification, EnglishCertificate, ComingSoonState,
  DEFAULT_PROFILE_PAGE, DEFAULT_EXPERIENCES, DEFAULT_CERTIFICATIONS, DEFAULT_ENGLISH_CERTS,
} from './model';

// Singleton doc: `site/profile-page`. Derived through a collection ref so the
// path stays exactly 2 segments (collection/doc).
const profilePageCol = () => doc(db, 'site', 'profile-page');

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

const safeLocArray = (v: unknown): LocalizedString[] => {
  if (!Array.isArray(v)) return [];
  return v
    .filter(x => typeof x === 'object' && x !== null)
    .map(x => safeLoc(x));
};

const fromExperience = (raw: unknown, idx: number): Experience => {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === 'string' ? r.id : `exp-${idx}`,
    role: safeLoc(r.role),
    company: typeof r.company === 'string' ? r.company : '',
    period: safeLoc(r.period),
    accent: typeof r.accent === 'string' ? r.accent : 'from-ocean-500 to-cyan-400',
    dot: typeof r.dot === 'string' ? r.dot : 'bg-ocean-500',
    achievements: safeLocArray(r.achievements),
    order: typeof r.order === 'number' ? r.order : idx,
  };
};

const fromCertification = (raw: unknown, idx: number): Certification => {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === 'string' ? r.id : `cert-${idx}`,
    title: typeof r.title === 'string' ? r.title : '',
    issuer: typeof r.issuer === 'string' ? r.issuer : '',
    level: typeof r.level === 'string' ? r.level : '',
    year: typeof r.year === 'string' ? r.year : '',
    credentialId: typeof r.credentialId === 'string' ? r.credentialId : '',
    accent: typeof r.accent === 'string' ? r.accent : 'from-blue-400 to-indigo-500',
    badgeBg: typeof r.badgeBg === 'string' ? r.badgeBg : '',
    iconBg: typeof r.iconBg === 'string' ? r.iconBg : 'bg-gradient-to-br from-blue-400 to-indigo-500',
    details: Array.isArray(r.details) ? r.details.filter(d => typeof d === 'string') : [],
    verifyUrl: typeof r.verifyUrl === 'string' ? r.verifyUrl : '',
    order: typeof r.order === 'number' ? r.order : idx,
  };
};

const fromEnglishCert = (raw: unknown, idx: number): EnglishCertificate => {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === 'string' ? r.id : `en-${idx}`,
    name: typeof r.name === 'string' ? r.name : '',
    score: typeof r.score === 'string' ? r.score : '',
    detail: typeof r.detail === 'string' ? r.detail : '',
    breakdown: safeLoc(r.breakdown),
    year: typeof r.year === 'string' ? r.year : '',
    order: typeof r.order === 'number' ? r.order : idx,
  };
};

const fromComingSoon = (raw: unknown): ComingSoonState => {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    enabled: r.enabled === true,
    title: safeLoc(r.title, DEFAULT_PROFILE_PAGE.comingSoon.title.vi),
    message: safeLoc(r.message, DEFAULT_PROFILE_PAGE.comingSoon.message.vi),
  };
};

const fromDoc = (id: string, raw: Record<string, unknown>): ProfilePage => {
  const expRaw = Array.isArray(raw.experiences) ? raw.experiences : [];
  const certRaw = Array.isArray(raw.certifications) ? raw.certifications : [];
  const enRaw = Array.isArray(raw.englishCerts) ? raw.englishCerts : [];

  return {
    id: id as 'main',
    avatarData: typeof raw.avatarData === 'string' ? raw.avatarData : null,
    cvUrl: typeof raw.cvUrl === 'string' ? raw.cvUrl : '',
    experiences: (expRaw.length > 0 ? expRaw : DEFAULT_EXPERIENCES)
      .map((e, i) => fromExperience(e, i))
      .sort((a, b) => a.order - b.order),
    certifications: (certRaw.length > 0 ? certRaw : DEFAULT_CERTIFICATIONS)
      .map((c, i) => fromCertification(c, i))
      .sort((a, b) => a.order - b.order),
    englishCerts: (enRaw.length > 0 ? enRaw : DEFAULT_ENGLISH_CERTS)
      .map((e, i) => fromEnglishCert(e, i))
      .sort((a, b) => a.order - b.order),
    comingSoon: fromComingSoon(raw.comingSoon),
    updatedAt: toMillis(raw.updatedAt as Timestamp | number | null | undefined),
  };
};

export const subscribeProfilePage = (
  onChange: (data: ProfilePage | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe => {
  try {
    return onSnapshot(
      profilePageCol(),
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

export const fetchProfilePage = async (): Promise<ProfilePage | null> => {
  const snap = await getDoc(profilePageCol());
  return snap.exists ? fromDoc(snap.id, snap.data()) : null;
};

export const updateProfilePage = async (
  patch: Partial<Omit<ProfilePage, 'id' | 'updatedAt'>>,
): Promise<void> => {
  // Try the partial update first (happy path). If Firestore rejects with
  // "No document to update", the singleton is missing — either freshly seeded
  // for the first time, or deleted while the local cache still claims it
  // exists (the previous getDoc-based check had a TOCTOU race against the
  // cache). In that case, upsert the full DEFAULT_PROFILE_PAGE merged with
  // the patch so the first write seeds every default field (avatar, default
  // experiences/certs, …), not just the patch fields.
  const ref = profilePageCol();
  try {
    await updateDoc(ref, cleanPatch({ ...patch, updatedAt: serverTimestamp() }));
    return;
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (!/No document to update/i.test(msg)) throw err;
  }

  const seeded: ProfilePage = {
    ...DEFAULT_PROFILE_PAGE,
    ...patch,
    comingSoon: patch.comingSoon
      ? { ...DEFAULT_PROFILE_PAGE.comingSoon, ...patch.comingSoon }
      : DEFAULT_PROFILE_PAGE.comingSoon,
    id: 'main',
  };
  const { id: _id, updatedAt: _u, ...rest } = seeded;
  void _id;
  void _u;
  await setDoc(
    ref,
    cleanPatch({ ...rest, updatedAt: serverTimestamp() }),
  );
};

export const setProfilePage = async (data: ProfilePage): Promise<void> => {
  const { id: _id, updatedAt: _u, ...rest } = data;
  void _id;
  void _u;
  await setDoc(
    profilePageCol(),
    cleanPatch({ ...rest, updatedAt: serverTimestamp() }),
  );
};
