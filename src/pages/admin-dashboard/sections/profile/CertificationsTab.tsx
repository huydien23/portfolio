import { useState } from 'react';
import { Plus, Trash2, Pencil, Award, ExternalLink } from 'lucide-react';
import { ProfilePage, Certification } from '../../../../entities/profile-page/model';
import { updateProfilePage } from '../../../../entities/profile-page/api';
import { useToast } from '../../ui/Toast';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { ItemDrawer } from './ItemDrawer';

interface CertificationsTabProps {
  draft: ProfilePage;
  onChange: (patch: Partial<ProfilePage>) => void;
  onSaved: () => void;
}

const empty = (order: number): Certification => ({
  id: `cert-${Date.now()}`,
  title: '',
  issuer: '',
  level: 'Certification',
  year: '',
  credentialId: '',
  accent: 'from-blue-400 to-indigo-500',
  badgeBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
  details: [''],
  verifyUrl: '',
  order,
});

const ACCENTS: { value: string; label: string; badgeBg: string; iconBg: string }[] = [
  { value: 'from-blue-400 to-indigo-500', label: 'Blue → Indigo', badgeBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800', iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500' },
  { value: 'from-emerald-400 to-green-500', label: 'Emerald → Green', badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500' },
  { value: 'from-rose-400 to-pink-500', label: 'Rose → Pink', badgeBg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800', iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500' },
  { value: 'from-amber-400 to-orange-500', label: 'Amber → Orange', badgeBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800', iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500' },
  { value: 'from-violet-500 to-purple-400', label: 'Violet → Purple', badgeBg: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800', iconBg: 'bg-gradient-to-br from-violet-500 to-purple-400' },
];

export const CertificationsTab = ({ draft, onChange, onSaved }: CertificationsTabProps) => {
  const toast = useToast();
  const [editing, setEditing] = useState<Certification | null>(null);
  const [adding, setAdding] = useState(false);
  const [draftCert, setDraftCert] = useState<Certification>(empty(1));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Certification | null>(null);

  const certifications = [...draft.certifications].sort((a, b) => a.order - b.order);

  const startAdd = () => {
    setDraftCert(empty((certifications.at(-1)?.order ?? 0) + 1));
    setAdding(true);
  };

  const startEdit = (cert: Certification) => {
    setDraftCert(structuredClone(cert));
    setEditing(cert);
  };

  const close = () => {
    setAdding(false);
    setEditing(null);
  };

  const handleSave = async () => {
    const cleaned = cleanDraft(draftCert);
    if (!cleaned.title || !cleaned.issuer) {
      toast.error('Thiếu thông tin', 'Cần nhập tên chứng chỉ + tổ chức cấp.');
      return;
    }
    setSaving(true);
    try {
      const next = editing
        ? certifications.map(c => (c.id === editing.id ? cleaned : c))
        : [...certifications, cleaned];
      await updateProfilePage({ certifications: next });
      toast.success(editing ? 'Đã cập nhật' : 'Đã thêm', cleaned.title);
      onChange({ certifications: next });
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
      const next = certifications.filter(c => c.id !== deleting.id);
      await updateProfilePage({ certifications: next });
      toast.success('Đã xóa', deleting.title);
      onChange({ certifications: next });
      onSaved();
      setDeleting(null);
    } catch (err) {
      toast.error('Lỗi xóa', err instanceof Error ? err.message : 'Unknown');
    }
  };

  const setAccent = (value: string) => {
    const preset = ACCENTS.find(a => a.value === value);
    if (!preset) return;
    setDraftCert({ ...draftCert, accent: preset.value, badgeBg: preset.badgeBg, iconBg: preset.iconBg });
  };

  const updateDetail = (idx: number, value: string) => {
    setDraftCert(prev => {
      const next = [...prev.details];
      next[idx] = value;
      return { ...prev, details: next };
    });
  };

  const addDetail = () => setDraftCert(prev => ({ ...prev, details: [...prev.details, ''] }));
  const removeDetail = (idx: number) => setDraftCert(prev => ({
    ...prev,
    details: prev.details.length > 1 ? prev.details.filter((_, i) => i !== idx) : prev.details,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Chứng chỉ chuyên môn hiển thị trên /profile. Bấm <b>Sửa</b> để chỉnh.
        </p>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition"
        >
          <Plus size={14} /> Thêm
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400 font-mono">Chưa có chứng chỉ nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-abyss-950/40 border border-slate-200 dark:border-abyss-700 rounded-xl"
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl ${cert.iconBg} flex items-center justify-center`}>
                <Award size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{cert.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {cert.issuer} • {cert.year}
                  {cert.verifyUrl !== '#' && cert.verifyUrl && (
                    <a href={cert.verifyUrl} target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-0.5 text-ocean-500 hover:underline">
                      <ExternalLink size={9} /> verify
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => startEdit(cert)}
                className="p-2 rounded-lg text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-ocean-500/10 transition"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setDeleting(cert)}
                className="p-2 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ItemDrawer
        open={adding || !!editing}
        title={editing ? `Sửa: ${editing.title}` : 'Thêm certification'}
        saving={saving}
        onClose={close}
        onSave={handleSave}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tên chứng chỉ</label>
            <input value={draftCert.title} onChange={e => setDraftCert({ ...draftCert, title: e.target.value })} className="form-input" placeholder="Gemini Certified Student" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tổ chức cấp</label>
            <input value={draftCert.issuer} onChange={e => setDraftCert({ ...draftCert, issuer: e.target.value })} className="form-input" placeholder="Google for Education" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Level</label>
            <input value={draftCert.level} onChange={e => setDraftCert({ ...draftCert, level: e.target.value })} className="form-input" placeholder="Certification / Skill Certificate" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Năm</label>
            <input value={draftCert.year} onChange={e => setDraftCert({ ...draftCert, year: e.target.value })} className="form-input" placeholder="2025" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Credential ID</label>
            <input value={draftCert.credentialId} onChange={e => setDraftCert({ ...draftCert, credentialId: e.target.value })} className="form-input" placeholder="Valid through 06/2028" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accent preset</label>
            <select value={draftCert.accent} onChange={e => setAccent(e.target.value)} className="form-input">
              {ACCENTS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verify URL</label>
            <input value={draftCert.verifyUrl} onChange={e => setDraftCert({ ...draftCert, verifyUrl: e.target.value })} className="form-input" placeholder="https://..." />
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-abyss-700">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Details / Highlights ({draftCert.details.length})</label>
            <button onClick={addDetail} className="inline-flex items-center gap-1 text-xs font-bold text-ocean-600 dark:text-ocean-400 hover:underline">
              <Plus size={12} /> Thêm
            </button>
          </div>
          {draftCert.details.map((d, idx) => (
            <div key={idx} className="flex gap-2">
              <input value={d} onChange={e => updateDetail(idx, e.target.value)} className="form-input flex-1 text-sm" placeholder="Mô tả chi tiết..." />
              {draftCert.details.length > 1 && (
                <button onClick={() => removeDetail(idx)} className="p-2 text-slate-400 hover:text-red-500">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </ItemDrawer>

      <ConfirmDialog
        open={!!deleting}
        title="Xóa certification?"
        description={deleting ? `"${deleting.title}" sẽ bị xoá khỏi trang /profile.` : ''}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

const cleanDraft = (d: Certification): Certification => ({
  ...d,
  title: d.title.trim(),
  issuer: d.issuer.trim(),
  level: d.level.trim() || 'Certification',
  year: d.year.trim(),
  credentialId: d.credentialId.trim(),
  verifyUrl: d.verifyUrl.trim(),
  details: d.details.map(x => x.trim()).filter(Boolean),
});