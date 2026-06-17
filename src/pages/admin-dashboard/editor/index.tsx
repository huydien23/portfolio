/**
 * ProjectEditorPage — full form for creating or editing a project.
 *
 * URLs:
 *  - /admin/dashboard/projects/new       → create
 *  - /admin/dashboard/projects/:id/edit  → edit
 *
 * Layout: 5 section cards stacked vertically, with a sticky top bar (status
 * + errors) and a sticky bottom bar (action buttons).
 *
 * Composed of:
 *  - useProjectForm — state, validation, auto-slug, submit
 *  - EditorTopBar / EditorActionBar — chrome
 *  - 5 section components — form fields
 *  - useProjects — source of `existingIds` + refetch on save
 */

import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../../../entities/project/hooks';
import { useToast } from '../ui/Toast';
import { useProjectForm } from './hooks/useProjectForm';
import { EditorTopBar } from './EditorTopBar';
import { EditorActionBar } from './EditorActionBar';
import { IdentitySection } from './sections/IdentitySection';
import { ContentSection } from './sections/ContentSection';
import { MediaSection } from './sections/MediaSection';
import { MetaSection } from './sections/MetaSection';
import { SettingsSection } from './sections/SettingsSection';
import { generateProjectId } from '../../../entities/project/slug';

export const ProjectEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const toast = useToast();

  const { projects, loading, refetch } = useProjects();

  // Set of existing ids — used to detect id collisions on create and edit.
  const existingIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);

  const initial = useMemo(
    () => (isEdit ? projects.find(p => p.id === id) ?? null : null),
    [projects, id, isEdit],
  );

  // Bounce out if the user landed on an edit URL for a project that doesn't
  // exist (or hasn't finished loading).
  useEffect(() => {
    if (!isEdit) return;
    if (loading) return;
    if (!initial) {
      toast.error('Không tìm thấy dự án', `Không có dự án nào với id "${id}"`);
      navigate('/admin/dashboard/projects', { replace: true });
    }
  }, [isEdit, loading, initial, id, navigate, toast]);

  const {
    form, isEdit: formIsEdit, errors, hasErrors, saving,
    update, submit, setManualId, regenerateId, idConflict,
  } = useProjectForm({
    initial,
    existingIds,
  });

  // True when the user has hand-edited the id (only relevant on create).
  const isManuallyEdited = !isEdit && form.id !== generateProjectId(form.title);

  const handleCancel = () => {
    if (saving) return;
    navigate('/admin/dashboard/projects');
  };

  const handleSave = async (publish: boolean) => {
    if (hasErrors || idConflict) {
      toast.error('Vui lòng kiểm tra các trường lỗi');
      return;
    }
    try {
      const saved = await submit(publish);
      if (!saved) return;
      toast.success(
        isEdit ? 'Đã cập nhật dự án' : 'Đã tạo dự án mới',
        saved.title,
      );
      refetch();
      // Về danh sách sau khi lưu thành công
      navigate('/admin/dashboard/projects');
    } catch (err) {
      toast.error(
        isEdit ? 'Lỗi cập nhật' : 'Lỗi tạo dự án',
        err instanceof Error ? err.message : 'Unknown',
      );
    }
  };

  // Hiển thị loading khi edit mà data chưa về
  if (isEdit && loading && !initial) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm font-mono uppercase tracking-widest">
        Đang tải dự án...
      </div>
    );
  }

  return (
    <div className="pb-24">
      <EditorTopBar
        isEdit={formIsEdit}
        status={form.status}
        hasErrors={hasErrors}
        saving={saving}
        errorCount={Object.keys(errors).length + (idConflict ? 1 : 0)}
      />

      <div className="space-y-5 pt-5">
        <IdentitySection
          form={form}
          isEdit={formIsEdit}
          idConflict={idConflict}
          isManuallyEdited={isManuallyEdited}
          onChangeId={setManualId}
          onRegenerateId={regenerateId}
          onToggleFeatured={() => update('featured', !form.featured)}
        />

        <ContentSection form={form} errors={errors} onUpdate={update} />

        <MediaSection form={form} errorImage={errors.image} onUpdate={update} />

        <MetaSection form={form} errors={errors} onUpdate={update} />

        <SettingsSection form={form} onUpdate={update} />
      </div>

      <EditorActionBar
        isEdit={formIsEdit}
        saving={saving}
        hasErrors={hasErrors || idConflict}
        isPublished={form.status === 'published'}
        onCancel={handleCancel}
        onSaveDraft={() => handleSave(false)}
        onPublish={() => handleSave(true)}
      />
    </div>
  );
};
