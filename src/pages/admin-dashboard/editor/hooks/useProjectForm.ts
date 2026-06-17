/**
 * useProjectForm — state, validation, auto-slug, and submit for the project editor.
 *
 *  - Create: id is auto-generated from the title (debounced 250ms) and
 *    collision-checked against Firestore. Manually editing the id disables
 *    auto-slug.
 *  - Edit: id is locked.
 *  - Validation: title, description, image (URL or base64), year.
 *  - Submit: calls createProject or updateProject and returns the saved entity.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ProjectEntity, ProjectCategory, ProjectStatus,
} from '../../../../entities/project/model';
import {
  createProject, updateProject,
} from '../../../../entities/project/api';
import { generateProjectId, ensureUniqueId } from '../../../../entities/project/slug';

/* Form state — strings everywhere for direct binding to <input>. */
export interface FormState {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  longDescription: string;
  longDescriptionEn: string;
  category: ProjectCategory;
  tagsRaw: string;          // "React, TypeScript"
  year: string;             // string để bind input number
  githubUrl: string;
  liveUrl: string;
  videoUrl: string;
  imageUrl: string;
  imageData: string | null; // base64
  gallery: string[];        // mix URL + base64
  highlightsRaw: string;    // mỗi dòng 1 điểm
  status: ProjectStatus;
  featured: boolean;
  order: string;
}

const CATEGORIES: ProjectCategory[] = ['Frontend', 'Backend', 'Mobile', 'Desktop', 'AI'];

const blankForm = (existingIds: Set<string>): FormState => {
  const base = generateProjectId('');
  return {
    id: ensureUniqueId(base, existingIds),
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    longDescription: '',
    longDescriptionEn: '',
    category: 'Frontend',
    tagsRaw: '',
    year: String(new Date().getFullYear()),
    githubUrl: '',
    liveUrl: '',
    videoUrl: '',
    imageUrl: '',
    imageData: null,
    gallery: [],
    highlightsRaw: '',
    status: 'draft',
    featured: false,
    order: '0',
  };
};

const fromEntity = (p: ProjectEntity): FormState => ({
  id: p.id,
  title: p.title,
  titleEn: p.titleEn ?? '',
  description: p.description,
  descriptionEn: p.descriptionEn ?? '',
  longDescription: p.longDescription ?? '',
  longDescriptionEn: p.longDescriptionEn ?? '',
  category: p.category,
  tagsRaw: (p.tags ?? []).join(', '),
  year: p.year ? String(p.year) : String(new Date().getFullYear()),
  githubUrl: p.githubUrl ?? '',
  liveUrl: p.liveUrl ?? '',
  videoUrl: p.videoUrl ?? '',
  imageUrl: p.imageUrl ?? '',
  imageData: p.imageData ?? null,
  gallery: p.gallery ?? [],
  highlightsRaw: (p.highlights ?? []).join('\n'),
  status: p.status,
  featured: p.featured,
  order: String(p.order ?? 0),
});

const toEntity = (f: FormState, original?: ProjectEntity): ProjectEntity => {
  const tags = f.tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const highlights = f.highlightsRaw.split('\n').map(h => h.trim()).filter(Boolean);
  const yearNum = Number(f.year) || new Date().getFullYear();
  const orderNum = Number(f.order) || 0;

  return {
    id: f.id,
    title: f.title.trim(),
    titleEn: f.titleEn.trim() || undefined,
    description: f.description.trim(),
    descriptionEn: f.descriptionEn.trim() || undefined,
    longDescription: f.longDescription.trim() || undefined,
    longDescriptionEn: f.longDescriptionEn.trim() || undefined,
    category: f.category,
    tags,
    highlights,
    year: yearNum,
    githubUrl: f.githubUrl.trim() || undefined,
    liveUrl: f.liveUrl.trim() || undefined,
    videoUrl: f.videoUrl.trim() || undefined,
    imageUrl: f.imageData ? '' : f.imageUrl.trim(),
    imageData: f.imageData,
    gallery: f.gallery,
    featured: f.featured,
    status: f.status,
    order: orderNum,
    createdAt: original?.createdAt,
    updatedAt: Date.now(),
  };
};

export type FormErrors = Record<string, string>;

export interface UseProjectFormOptions {
  /** ProjectEntity nếu edit; null/undefined nếu tạo mới. */
  initial: ProjectEntity | null;
  /** Set id đang tồn tại trong Firestore (để check collision khi tạo). */
  existingIds: Set<string>;
}

export interface UseProjectFormResult {
  form: FormState;
  isEdit: boolean;
  categories: ProjectCategory[];
  /** Map field name → error message. */
  errors: FormErrors;
  hasErrors: boolean;
  /** Cập nhật 1 field. */
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  /** Đang lưu. */
  saving: boolean;
  /** Submit form. publishAfter=true → set status='published' rồi save. */
  submit: (publishAfter: boolean) => Promise<ProjectEntity | null>;
  /** Nhập tay id → tắt autoSlug (chỉ áp dụng tạo mới). */
  setManualId: (val: string) => void;
  /** Bật lại autoSlug và generate lại id từ title hiện tại. */
  regenerateId: () => void;
  /** True nếu id hiện tại trùng với 1 project khác (chỉ trong edit, khi user đổi id). */
  idConflict: boolean;
}

const SLUG_DEBOUNCE_MS = 250;

export const useProjectForm = ({
  initial, existingIds,
}: UseProjectFormOptions): UseProjectFormResult => {
  const isEdit = !!initial;
  const [form, setForm] = useState<FormState>(() =>
    initial ? fromEntity(initial) : blankForm(existingIds),
  );
  const [autoSlug, setAutoSlug] = useState(!isEdit);
  const [saving, setSaving] = useState(false);

  // Reset form khi initial đổi (vd: navigate từ /new sang /:id/edit)
  const lastInitialIdRef = useRef<string | null>(initial?.id ?? null);
  useEffect(() => {
    const newId = initial?.id ?? null;
    if (newId !== lastInitialIdRef.current) {
      lastInitialIdRef.current = newId;
      setForm(initial ? fromEntity(initial) : blankForm(existingIds));
      setAutoSlug(!isEdit);
    }
  }, [initial, isEdit, existingIds]);

  /* ── Auto-slug với debounce ── */
  useEffect(() => {
    if (isEdit || !autoSlug) return;
    const handle = setTimeout(() => {
      const base = generateProjectId(form.title);
      const unique = ensureUniqueId(base, existingIds);
      setForm(f => (f.id === unique ? f : { ...f, id: unique }));
    }, SLUG_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, autoSlug, isEdit]);

  /* ── Validation ── */
  const errors = useMemo<FormErrors>(() => {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = 'Bắt buộc';
    if (!form.description.trim()) e.description = 'Bắt buộc';
    if (!form.imageData && !form.imageUrl.trim()) e.image = 'Cần ảnh chính (URL hoặc upload)';
    if (form.year && (Number(form.year) < 1990 || Number(form.year) > 2100)) e.year = 'Năm không hợp lệ';
    if (!form.id.trim()) e.id = 'ID không được trống';
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  /* ── ID conflict: id hiện tại đã thuộc 1 project khác trong edit mode ── */
  const idConflict = isEdit && initial != null && form.id.trim() !== initial.id && existingIds.has(form.id.trim());

  /* ── Update helper ── */
  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(f => ({ ...f, [key]: value }));
  }, []);

  const setManualId = useCallback((val: string) => {
    setForm(f => ({ ...f, id: val }));
    if (!isEdit) setAutoSlug(false);
  }, [isEdit]);

  const regenerateId = useCallback(() => {
    if (isEdit) return;
    const base = generateProjectId(form.title);
    const unique = ensureUniqueId(base, existingIds);
    setForm(f => ({ ...f, id: unique }));
    setAutoSlug(true);
  }, [isEdit, form.title, existingIds]);

  const submit = useCallback(async (publishAfter: boolean): Promise<ProjectEntity | null> => {
    if (hasErrors) return null;
    setSaving(true);
    try {
      const entity = toEntity(form, initial ?? undefined);
      const finalEntity = publishAfter ? { ...entity, status: 'published' as ProjectStatus } : entity;
      if (isEdit) {
        await updateProject(form.id, finalEntity);
      } else {
        await createProject(finalEntity);
      }
      return finalEntity;
    } finally {
      setSaving(false);
    }
  }, [form, hasErrors, initial, isEdit]);

  return {
    form, isEdit, categories: CATEGORIES,
    errors, hasErrors,
    update, saving, submit,
    setManualId, regenerateId,
    idConflict,
  };
};
