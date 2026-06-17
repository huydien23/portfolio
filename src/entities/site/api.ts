import {
  collection, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot,
  query, orderBy, serverTimestamp, Timestamp, Unsubscribe, writeBatch,
} from 'firebase/firestore';
import { db } from '../../shared/api/firebase/config';
import { cleanPatch } from '../../shared/api/firebase/cleanPatch';
import {
  SiteProfile, SkillCategory, SkillItem,
  HeroContent, BrandContent, ContactContent, AboutContent, LocalizedString, StatItem,
} from './model';

const PROFILE_DOC = 'main';

// Firestore's Web SDK treats odd-segment paths as collections and even-segment
// paths as documents. Always derive doc refs from a collection ref so the
// segment count is correct.
const profileCol = () => collection(db, 'site', 'profile');
const profileRef = () => doc(profileCol(), PROFILE_DOC);
const skillsCol = () => collection(db, 'site', 'skills');
const skillRef = (id: string) => doc(skillsCol(), id);

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

const safeStat = (v: unknown): StatItem => {
  if (typeof v !== 'object' || v === null) {
    return { key: '', value: '', label: { vi: '', en: '' } };
  }
  const o = v as Record<string, unknown>;
  return {
    key: typeof o.key === 'string' ? o.key : '',
    value: typeof o.value === 'string' ? o.value : '',
    label: safeLoc(o.label),
  };
};

/* ════════════════════════════════════════════════
 * fromDoc — convert Firestore doc → SiteProfile
 * ════════════════════════════════════════════════ */
const fromHeroDoc = (raw: unknown): HeroContent => {
  const d = (raw ?? {}) as Record<string, unknown>;
  const stats = Array.isArray(d.stats) ? d.stats.map(safeStat) : [];
  return {
    titleLine1: safeLoc(d.titleLine1),
    titleLine2: safeLoc(d.titleLine2),
    subtitle: safeLoc(d.subtitle),
    ctaText: safeLoc(d.ctaText),
    available: d.available === true,
    stats,
  };
};

const fromBrandDoc = (raw: unknown): BrandContent => {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    shorthand: typeof d.shorthand === 'string' ? d.shorthand : 'Điền Dev',
    logoData: typeof d.logoData === 'string' ? d.logoData : null,
    availability: d.availability !== false,
  };
};

const fromContactDoc = (raw: unknown): ContactContent => {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    phone: typeof d.phone === 'string' ? d.phone : '',
    email: typeof d.email === 'string' ? d.email : '',
    zalo: typeof d.zalo === 'string' ? d.zalo : '',
    facebook: typeof d.facebook === 'string' ? d.facebook : '',
    linkedin: typeof d.linkedin === 'string' ? d.linkedin : '',
    github: typeof d.github === 'string' ? d.github : '',
    hoursLabel: safeLoc(d.hoursLabel, 'Giờ làm việc'),
    hoursValue: safeLoc(d.hoursValue, ''),
  };
};

const fromAboutDoc = (raw: unknown): AboutContent => ({
  headline: safeLoc((raw as any)?.headline, 'Giới thiệu'),
  body: safeLoc((raw as any)?.body),
});

const fromProfileDoc = (id: string, raw: Record<string, unknown>): SiteProfile => ({
  id: id as 'main',
  hero: fromHeroDoc(raw.hero),
  brand: fromBrandDoc(raw.brand),
  contact: fromContactDoc(raw.contact),
  about: fromAboutDoc(raw.about),
  updatedAt: toMillis(raw.updatedAt as Timestamp | number | null | undefined),
});

/* ─── Site Profile API ─── */

export const subscribeSiteProfile = (
  onChange: (profile: SiteProfile | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe => {
  try {
    return onSnapshot(
      profileRef(),
      snap => {
        if (!snap.exists) {
          onChange(null);
          return;
        }
        onChange(fromProfileDoc(snap.id, snap.data()));
      },
      err => onError?.(err),
    );
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error('Subscription failed'));
    return () => {};
  }
};

export const updateSiteProfile = async (
  patch: Partial<Omit<SiteProfile, 'id' | 'updatedAt'>>,
): Promise<void> => {
  await updateDoc(
    profileRef(),
    cleanPatch({ ...patch, updatedAt: serverTimestamp() }),
  );
};

export const setSiteProfile = async (profile: SiteProfile): Promise<void> => {
  const { id: _id, updatedAt: _u, ...rest } = profile;
  void _id;
  void _u;
  await setDoc(
    profileRef(),
    cleanPatch({ ...rest, updatedAt: serverTimestamp() }),
  );
};

export const fetchSiteProfile = async (): Promise<SiteProfile | null> => {
  const snap = await getDoc(profileRef());
  return snap.exists ? fromProfileDoc(snap.id, snap.data()) : null;
};

/* ─── Skills API ─── */

const fromSkillDoc = (id: string, raw: Record<string, unknown>): SkillCategory => {
  const items = Array.isArray(raw.items) ? raw.items : [];
  return {
    id,
    name: safeLoc(raw.name),
    order: typeof raw.order === 'number' ? raw.order : 0,
    items: items
      .filter(i => typeof i === 'object' && i !== null)
      .map((i, idx) => {
        const it = i as Record<string, unknown>;
        return {
          name: typeof it.name === 'string' ? it.name : '',
          icon: typeof it.icon === 'string' ? it.icon : '',
          order: typeof it.order === 'number' ? it.order : idx,
        };
      })
      .sort((a, b) => a.order - b.order),
    updatedAt: toMillis(raw.updatedAt as Timestamp | number | null | undefined),
  };
};

/** Subscribe toàn bộ skills, đã sort theo order. */
export const subscribeSkills = (
  onChange: (items: SkillCategory[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe => {
  try {
    return onSnapshot(
      query(skillsCol(), orderBy('order', 'asc')),
      snap => onChange(snap.docs.map(d => fromSkillDoc(d.id, d.data()))),
      err => onError?.(err),
    );
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error('Subscription failed'));
    return () => {};
  }
};

export const fetchSkills = async (): Promise<SkillCategory[]> => {
  const { getDocs } = await import('firebase/firestore');
  const snap = await getDocs(query(skillsCol(), orderBy('order', 'asc')));
  return snap.docs.map(d => fromSkillDoc(d.id, d.data()));
};

export const setSkillCategory = async (cat: SkillCategory): Promise<void> => {
  const { updatedAt: _u, ...rest } = cat;
  void _u;
  await setDoc(
    skillRef(cat.id),
    cleanPatch({ ...rest, updatedAt: serverTimestamp() }),
  );
};

export const deleteSkillCategory = async (id: string): Promise<void> => {
  await deleteDoc(skillRef(id));
};

// Items live inside the category doc, so each mutation is a read-modify-write.
export const updateSkillItem = async (
  categoryId: string,
  item: SkillItem,
  oldName: string,
): Promise<void> => {
  const ref = skillRef(categoryId);
  const snap = await getDoc(ref);
  if (!snap.exists) throw new Error(`Category ${categoryId} không tồn tại`);
  const current = fromSkillDoc(snap.id, snap.data());
  const newItems = current.items.map(i => (i.name === oldName ? { ...item } : i));
  await updateDoc(ref, { items: newItems, updatedAt: serverTimestamp() });
};

export const addSkillItem = async (
  categoryId: string,
  item: Omit<SkillItem, 'order'>,
): Promise<void> => {
  const ref = skillRef(categoryId);
  const snap = await getDoc(ref);
  if (!snap.exists) throw new Error(`Category ${categoryId} không tồn tại`);
  const current = fromSkillDoc(snap.id, snap.data());
  const maxOrder = current.items.reduce((max, i) => Math.max(max, i.order), 0);
  const newItem: SkillItem = { ...item, order: maxOrder + 1 };
  await updateDoc(ref, {
    items: [...current.items, newItem],
    updatedAt: serverTimestamp(),
  });
};

export const deleteSkillItem = async (
  categoryId: string,
  itemName: string,
): Promise<void> => {
  const ref = skillRef(categoryId);
  const snap = await getDoc(ref);
  if (!snap.exists) throw new Error(`Category ${categoryId} không tồn tại`);
  const current = fromSkillDoc(snap.id, snap.data());
  const newItems = current.items.filter(i => i.name !== itemName);
  await updateDoc(ref, { items: newItems, updatedAt: serverTimestamp() });
};

export const reorderSkillCategories = async (orderedIds: string[]): Promise<void> => {
  if (orderedIds.length === 0) return;
  const batch = writeBatch(db);
  const now = serverTimestamp();
  orderedIds.forEach((id, idx) => {
    batch.update(skillRef(id), { order: idx, updatedAt: now });
  });
  await batch.commit();
};
