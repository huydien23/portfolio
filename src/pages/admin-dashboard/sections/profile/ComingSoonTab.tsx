import { Save, Loader2, Hourglass, Eye } from 'lucide-react';
import { useState } from 'react';
import { ProfilePage, ComingSoonState } from '../../../../entities/profile-page/model';
import { updateProfilePage } from '../../../../entities/profile-page/api';
import { useToast } from '../../ui/Toast';
import { LocalizedInput } from './LocalizedInput';

interface ComingSoonTabProps {
  draft: ProfilePage;
  onChange: (patch: Partial<ProfilePage>) => void;
  onSaved: () => void;
}

/** Mini preview card that mirrors the public ComingSoonPage visual language.
 *  Lives entirely inside the admin form — no real page navigation. */
const ComingSoonPreview = ({ cs }: { cs: ComingSoonState }) => {
  return (
    <div className="sticky top-4">
      <div className="flex items-center gap-2 mb-3">
        <Eye size={13} className="text-slate-400" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
          Live preview · như visitor sẽ thấy
        </span>
      </div>

      <div className="relative rounded-2xl border border-slate-200 dark:border-abyss-700 overflow-hidden bg-slate-50 dark:bg-abyss-950">
        {/* Background orbs (same as ComingSoonPage) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-ocean-400/20 dark:bg-ocean-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-sky-300/20 dark:bg-sky-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative px-6 py-12 flex flex-col items-center text-center min-h-[420px] justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-500/10 border border-ocean-300 dark:border-ocean-500/30 mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ocean-500" />
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-ocean-700 dark:text-ocean-400">
              VI / EN
            </span>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ocean-400 to-sky-500 flex items-center justify-center shadow-xl shadow-ocean-500/30 mb-5">
            <Hourglass size={28} className="text-white" />
          </div>

          {/* Title (vi + en stacked, like real page renders) */}
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-1">
            {cs.title.vi || 'Tiêu đề (VI)'}
          </h3>
          <p className="text-base font-bold text-slate-400 dark:text-slate-500 mb-5">
            {cs.title.en || 'Title (EN)'}
          </p>

          {/* Message */}
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mb-1">
            {cs.message.vi || 'Mô tả (VI)'}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-md italic">
            {cs.message.en || 'Message (EN)'}
          </p>

          {/* Disabled-state hint */}
          {!cs.enabled && (
            <div className="mt-6 px-3 py-1.5 rounded-full border border-slate-200 dark:border-abyss-700 bg-white dark:bg-abyss-900 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              ⓘ Trang đang PUBLIC — preview chỉ hiển thị khi bật Coming Soon
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
        Preview phản ánh nội dung <b>VI / EN</b> từ form bên trái. Lưu để áp dụng lên trang <code className="font-mono">/profile</code> thật.
      </p>
    </div>
  );
};

export const ComingSoonTab = ({ draft, onChange, onSaved }: ComingSoonTabProps) => {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const cs: ComingSoonState = draft.comingSoon;

  const setCs = (patch: Partial<ComingSoonState>) => onChange({ comingSoon: { ...cs, ...patch } });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfilePage({ comingSoon: cs });
      toast.success('Đã lưu', 'Cập nhật trạng thái coming soon.');
      onSaved();
    } catch (err) {
      toast.error('Lỗi lưu', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT — form */}
      <div className="space-y-5">
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          Khi bật, trang <code className="font-mono font-bold">/profile</code> sẽ hiển thị màn hình "Coming Soon" thay vì nội dung thật. Độc lập với chế độ bảo trì toàn site.
        </div>

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-abyss-950/40 border border-slate-200 dark:border-abyss-700">
          <input
            type="checkbox"
            checked={cs.enabled}
            onChange={e => setCs({ enabled: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
          />
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-900 dark:text-white">Bật chế độ Coming Soon</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Trang /profile bị khoá, hiển thị màn hình chờ.</div>
          </div>
        </label>

        <LocalizedInput
          label="Tiêu đề (VI / EN)"
          value={cs.title}
          onChange={v => setCs({ title: v })}
          placeholder="Hồ sơ đang được cập nhật"
        />
        <LocalizedInput
          label="Mô tả (VI / EN)"
          value={cs.message}
          onChange={v => setCs({ message: v })}
          placeholder="Trang hồ sơ cá nhân đang được chỉnh sửa..."
          multiline
          rows={3}
        />

        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-abyss-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Đang lưu...' : 'Lưu coming soon'}
          </button>
        </div>
      </div>

      {/* RIGHT — live preview */}
      <ComingSoonPreview cs={cs} />
    </div>
  );
};