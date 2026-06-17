import { useState } from 'react';
import { Plus, Trash2, Pencil, GripVertical, Calendar, Briefcase } from 'lucide-react';
import { ProfilePage, Experience, LocalizedString } from '../../../../entities/profile-page/model';
import { updateProfilePage } from '../../../../entities/profile-page/api';
import { useToast } from '../../ui/Toast';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { ItemDrawer } from './ItemDrawer';
import { LocalizedInput } from './LocalizedInput';

interface ExperiencesTabProps {
  draft: ProfilePage;
  onChange: (patch: Partial<ProfilePage>) => void;
  onSaved: () => void;
}

const empty = (order: number): Experience => ({
  id: `exp-${Date.now()}`,
  role: { vi: '', en: '' },
  company: '',
  period: { vi: '', en: '' },
  accent: 'from-ocean-500 to-cyan-400',
  dot: 'bg-ocean-500',
  achievements: [{ vi: '', en: '' }],
  order,
});

export const ExperiencesTab = ({ draft, onChange, onSaved }: ExperiencesTabProps) => {
  const toast = useToast();
  const [editing, setEditing] = useState<Experience | null>(null);
  const [adding, setAdding] = useState(false);
  const [draftExp, setDraftExp] = useState<Experience>(empty(1));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Experience | null>(null);

  const experiences = [...draft.experiences].sort((a, b) => a.order - b.order);

  const startAdd = () => {
    setDraftExp(empty((experiences.at(-1)?.order ?? 0) + 1));
    setAdding(true);
  };

  const startEdit = (exp: Experience) => {
    setDraftExp(structuredClone(exp));
    setEditing(exp);
  };

  const close = () => {
    setAdding(false);
    setEditing(null);
  };

  const handleSave = async () => {
    const cleaned = cleanDraft(draftExp);
    if (!cleaned.role.vi || !cleaned.company) {
      toast.error('Thiếu thông tin', 'Cần nhật vai trò (VI) và tên công ty.');
      return;
    }
    setSaving(true);
    try {
      const next = editing
        ? experiences.map(e => (e.id === editing.id ? cleaned : e))
        : [...experiences, cleaned];
      await updateProfilePage({ experiences: next });
      toast.success(editing ? 'Đã cập nhật' : 'Đã thêm', cleaned.role.vi);
      onChange({ experiences: next });
      onSaved();
      close();
    } catch (err) {
      toast.error('Lỗi lưu', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const next = experiences.filter(e => e.id !== deleting.id);
      await updateProfilePage({ experiences: next });
      toast.success('Đã xóa', deleting.role.vi || deleting.id);
      onChange({ experiences: next });
      onSaved();
      setDeleting(null);
    } catch (err) {
      toast.error('Lỗi xóa', err instanceof Error ? err.message : 'Unknown');
    }
  };

  const updateAchievement = (idx: number, patch: Partial<LocalizedString>) => {
    setDraftExp(prev => {
      const next = [...prev.achievements];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, achievements: next };
    });
  };

  const addAchievement = () => {
    setDraftExp(prev => ({ ...prev, achievements: [...prev.achievements, { vi: '', en: '' }] }));
  };

  const removeAchievement = (idx: number) => {
    setDraftExp(prev => ({
      ...prev,
      achievements: prev.achievements.length > 1
        ? prev.achievements.filter((_, i) => i !== idx)
        : prev.achievements,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Danh sách kinh nghiệm hiển thị trên /profile. Bấm <b>Sửa</b> để mở form chi tiết.
        </p>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition"
        >
          <Plus size={14} /> Thêm
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400 font-mono">
          Chưa có experience nào.
        </div>
      ) : (
        <div className="space-y-2">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-abyss-950/40 border border-slate-200 dark:border-abyss-700 rounded-xl"
            >
              <GripVertical size={14} className="text-slate-300 dark:text-slate-600" />
              <div className={`shrink-0 w-1 h-10 rounded-full bg-gradient-to-b ${exp.accent}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Briefcase size={13} className="text-ocean-500 shrink-0" />
                  <span className="truncate">{exp.role.vi || exp.role.en || exp.id}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="truncate">{exp.company}</span>
                  <span>•</span>
                  <Calendar size={11} />
                  <span className="font-mono">{exp.period.vi || exp.period.en}</span>
                  <span>•</span>
                  <span className="font-mono text-[10px]">#{idx + 1}</span>
                </div>
              </div>
              <button
                onClick={() => startEdit(exp)}
                className="p-2 rounded-lg text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-ocean-500/10 transition"
                title="Sửa"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setDeleting(exp)}
                className="p-2 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                title="Xóa"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ItemDrawer
        open={adding || !!editing}
        title={editing ? `Sửa: ${editing.role.vi || editing.id}` : 'Thêm experience'}
        saving={saving}
        onClose={close}
        onSave={handleSave}
      >
        <LocalizedInput label="Vai trò (VI / EN)" value={draftExp.role} onChange={v => setDraftExp({ ...draftExp, role: v })} placeholder="Founder & Trưởng Nhóm" />
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Công ty / Team</label>
          <input value={draftExp.company} onChange={e => setDraftExp({ ...draftExp, company: e.target.value })} className="form-input" placeholder="Team TechForge" />
        </div>
        <LocalizedInput label="Thời gian (VI / EN)" value={draftExp.period} onChange={v => setDraftExp({ ...draftExp, period: v })} placeholder="07/2025 — Hiện tại" />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accent gradient</label>
            <select value={draftExp.accent} onChange={e => setDraftExp({ ...draftExp, accent: e.target.value })} className="form-input">
              <option value="from-ocean-500 to-cyan-400">Ocean → Cyan</option>
              <option value="from-sky-500 to-blue-400">Sky → Blue</option>
              <option value="from-emerald-400 to-green-500">Emerald → Green</option>
              <option value="from-violet-500 to-purple-400">Violet → Purple</option>
              <option value="from-amber-400 to-orange-500">Amber → Orange</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dot color</label>
            <select value={draftExp.dot} onChange={e => setDraftExp({ ...draftExp, dot: e.target.value })} className="form-input">
              <option value="bg-ocean-500">Ocean</option>
              <option value="bg-sky-500">Sky</option>
              <option value="bg-emerald-500">Emerald</option>
              <option value="bg-violet-500">Violet</option>
              <option value="bg-amber-500">Amber</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-abyss-700">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Achievements ({draftExp.achievements.length})</label>
            <button onClick={addAchievement} className="inline-flex items-center gap-1 text-xs font-bold text-ocean-600 dark:text-ocean-400 hover:underline">
              <Plus size={12} /> Thêm
            </button>
          </div>
          {draftExp.achievements.map((ach, idx) => (
            <div key={idx} className="space-y-2 p-3 bg-slate-50 dark:bg-abyss-950/40 rounded-lg border border-slate-200 dark:border-abyss-700">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">#{idx + 1}</span>
                {draftExp.achievements.length > 1 && (
                  <button onClick={() => removeAchievement(idx)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <LocalizedInput label="" value={ach} onChange={v => updateAchievement(idx, v)} placeholder="Thành tích nổi bật..." multiline rows={2} />
            </div>
          ))}
        </div>
      </ItemDrawer>

      <ConfirmDialog
        open={!!deleting}
        title="Xóa experience?"
        description={deleting ? `"${deleting.role.vi || deleting.id}" sẽ bị xoá khỏi trang /profile.` : ''}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

const cleanDraft = (d: Experience): Experience => ({
  ...d,
  role: { vi: d.role.vi.trim(), en: d.role.en.trim() || d.role.vi.trim() },
  company: d.company.trim(),
  period: { vi: d.period.vi.trim(), en: d.period.en.trim() || d.period.vi.trim() },
  achievements: d.achievements
    .filter(a => a.vi.trim() || a.en.trim())
    .map(a => ({ vi: a.vi.trim(), en: a.en.trim() || a.vi.trim() })),
});