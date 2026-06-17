import { useRef, useState } from 'react';
import { Save, Loader2, Image as ImageIcon, Upload, X as XIcon, Link as LinkIcon, Download } from 'lucide-react';
import { ProfilePage } from '../../../../entities/profile-page/model';
import { updateProfilePage } from '../../../../entities/profile-page/api';
import { compressImage, validateImageData, formatBytes } from '../../../../entities/project/image';
import { useToast } from '../../ui/Toast';

interface IdentityTabProps {
  draft: ProfilePage;
  onChange: (patch: Partial<ProfilePage>) => void;
  onSaved: () => void;
}

export const IdentityTab = ({ draft, onChange, onSaved }: IdentityTabProps) => {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await compressImage(file);
      const valid = validateImageData(result.dataUrl);
      if (!valid.ok) {
        toast.error('Upload thất bại', valid.reason);
        return;
      }
      onChange({ avatarData: result.dataUrl });
      toast.success('Đã upload avatar', `${formatBytes(result.compressedSize)} • ${result.width}×${result.height}`);
    } catch (err) {
      toast.error('Lỗi upload', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfilePage({ avatarData: draft.avatarData, cvUrl: draft.cvUrl });
      toast.success('Đã lưu', 'Avatar + CV đã cập nhật.');
      onSaved();
    } catch (err) {
      toast.error('Lỗi lưu', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ImageIcon size={11} /> Avatar (hiển thị trên /profile)
        </label>
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-abyss-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-abyss-950">
            {draft.avatarData ? (
              <img src={draft.avatarData} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={28} className="text-slate-300" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload ảnh — tự nén xuống dưới 800KB. Nếu rỗng sẽ dùng ảnh placeholder.
            </p>
            <div className="flex gap-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-abyss-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-abyss-800 transition disabled:opacity-50"
              >
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {uploading ? 'Đang nén...' : 'Upload'}
              </button>
              {draft.avatarData && (
                <button
                  type="button"
                  onClick={() => onChange({ avatarData: null })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <XIcon size={12} /> Xóa avatar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Download size={11} /> URL CV (Google Drive / Dropbox / direct link)
        </label>
        <div className="relative">
          <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={draft.cvUrl}
            onChange={e => onChange({ cvUrl: e.target.value })}
            placeholder="https://drive.google.com/file/d/.../view"
            className="form-input pl-9"
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Nút "Tải CV" trên trang /profile sẽ mở link này. Để trống nếu chưa có CV.
        </p>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-abyss-700">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
};