import { useState } from 'react';
import { Plus, Trash2, Pencil, Languages } from 'lucide-react';
import { ProfilePage, EnglishCertificate } from '../../../../entities/profile-page/model';
import { updateProfilePage } from '../../../../entities/profile-page/api';
import { useToast } from '../../ui/Toast';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { ItemDrawer } from './ItemDrawer';
import { LocalizedInput } from './LocalizedInput';

interface EnglishCertsTabProps {
  draft: ProfilePage;
  onChange: (patch: Partial<ProfilePage>) => void;
  onSaved: () => void;
}

const empty = (order: number): EnglishCertificate => ({
  id: `en-${Date.now()}`,
  name: '',
  score: '',
  detail: '',
  breakdown: { vi: '', en: '' },
  year: '',
  order,
});

export const EnglishCertsTab = ({ draft, onChange, onSaved }: EnglishCertsTabProps) => {
  const toast = useToast();
  const [editing, setEditing] = useState<EnglishCertificate | null>(null);
  const [adding, setAdding] = useState(false);
  const [draftCert, setDraftCert] = useState<EnglishCertificate>(empty(1));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<EnglishCertificate | null>(null);

  const englishCerts = [...draft.englishCerts].sort((a, b) => a.order - b.order);

  const startAdd = () => {
    setDraftCert(empty((englishCerts.at(-1)?.order ?? 0) + 1));
    setAdding(true);
  };

  const startEdit = (cert: EnglishCertificate) => {
    setDraftCert(structuredClone(cert));
    setEditing(cert);
  };

  const close = () => {
    setAdding(false);
    setEditing(null);
  };

  const handleSave = async () => {
    const cleaned = cleanDraft(draftCert);
    if (!cleaned.name || !cleaned.score) {
      toast.error('Thiếu thông tin', 'Cần nhập tên chứng chỉ + điểm.');
      return;
    }
    setSaving(true);
    try {
      const next = editing
        ? englishCerts.map(c => (c.id === editing.id ? cleaned : c))
        : [...englishCerts, cleaned];
      await updateProfilePage({ englishCerts: next });
      toast.success(editing ? 'Đã cập nhật' : 'Đã thêm', cleaned.name);
      onChange({ englishCerts: next });
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
      const next = englishCerts.filter(c => c.id !== deleting.id);
      await updateProfilePage({ englishCerts: next });
      toast.success('Đã xóa', deleting.name);
      onChange({ englishCerts: next });
      onSaved();
      setDeleting(null);
    } catch (err) {
      toast.error('Lỗi xóa', err instanceof Error ? err.message : 'Unknown');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Chứng chỉ ngoại ngữ hiển thị trong section <b>English Proficiency</b>.
        </p>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition"
        >
          <Plus size={14} /> Thêm
        </button>
      </div>

      {englishCerts.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400 font-mono">Chưa có chứng chỉ nào.</div>
      ) : (
        <div className="space-y-2">
          {englishCerts.map((cert, idx) => (
            <div
              key={cert.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-abyss-950/40 border border-slate-200 dark:border-abyss-700 rounded-xl"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <Languages size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{cert.name}</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter leading-none">{cert.score}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cert.detail}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {cert.breakdown.vi || cert.breakdown.en}
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
        title={editing ? `Sửa: ${editing.name}` : 'Thêm English cert'}
        saving={saving}
        onClose={close}
        onSave={handleSave}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tên</label>
            <input value={draftCert.name} onChange={e => setDraftCert({ ...draftCert, name: e.target.value })} className="form-input" placeholder="English B1" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Score</label>
            <input value={draftCert.score} onChange={e => setDraftCert({ ...draftCert, score: e.target.value })} className="form-input" placeholder="B1 / 7.0 / ..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Detail (CEFR / IELTS...)</label>
            <input value={draftCert.detail} onChange={e => setDraftCert({ ...draftCert, detail: e.target.value })} className="form-input" placeholder="CEFR / VSTEP" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Year / Label</label>
            <input value={draftCert.year} onChange={e => setDraftCert({ ...draftCert, year: e.target.value })} className="form-input" placeholder="2024 / Academic" />
          </div>
        </div>
        <LocalizedInput
          label="Mô tả chi tiết (VI / EN)"
          value={draftCert.breakdown}
          onChange={v => setDraftCert({ ...draftCert, breakdown: v })}
          placeholder="Intermediate: Có khả năng đọc tài liệu kỹ thuật..."
          multiline
          rows={3}
        />
      </ItemDrawer>

      <ConfirmDialog
        open={!!deleting}
        title="Xóa English cert?"
        description={deleting ? `"${deleting.name}" sẽ bị xoá khỏi trang /profile.` : ''}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

const cleanDraft = (d: EnglishCertificate): EnglishCertificate => ({
  ...d,
  name: d.name.trim(),
  score: d.score.trim(),
  detail: d.detail.trim(),
  year: d.year.trim(),
  breakdown: { vi: d.breakdown.vi.trim(), en: d.breakdown.en.trim() || d.breakdown.vi.trim() },
});