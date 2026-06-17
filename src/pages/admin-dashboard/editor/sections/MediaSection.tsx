/** Hero image (large preview) + Gallery grid + external image URL + demo video.
 *  Uploads go through `compressImage` from `entities/project/image.ts` so the
 *  result fits inside Firestore's 1 MiB document limit. */

import { useRef, useState } from 'react';
import {
  Image as ImageIcon, Trash2, Loader2, ImagePlus, Video,
  Image as ImagePlaceholder, AlertCircle,
} from 'lucide-react';
import { SectionCard, Field } from '../SectionCard';
import { FormState } from '../hooks/useProjectForm';
import { compressImage, formatBytes, validateImageData } from '../../../../entities/project/image';
import { useToast } from '../../ui/Toast';

interface MediaSectionProps {
  form: FormState;
  errorImage?: string;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const MediaSection = ({ form, errorImage, onUpdate }: MediaSectionProps) => {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const handleMainImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await compressImage(file);
      const v = validateImageData(result.dataUrl);
      if (!v.ok) {
        toast.error('Ảnh không hợp lệ', v.reason);
        return;
      }
      onUpdate('imageData', result.dataUrl);
      onUpdate('imageUrl', '');
      toast.success('Đã nén ảnh', `${formatBytes(result.compressedSize)} (gốc ${formatBytes(result.originalSize)})`);
    } catch (err) {
      toast.error('Lỗi xử lý ảnh', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const current = form.gallery;
      const remaining = 4 - current.length;
      if (remaining <= 0) {
        toast.info('Gallery đã đầy', 'Tối đa 4 ảnh, hãy xóa bớt trước');
        return;
      }
      const toProcess = Array.from(files).slice(0, remaining);
      const results = await Promise.all(toProcess.map(f => compressImage(f).catch(() => null)));
      const valid = results.filter((r): r is NonNullable<typeof r> => r !== null);
      const accepted: string[] = [];
      for (const r of valid) {
        const v = validateImageData(r.dataUrl);
        if (v.ok) accepted.push(r.dataUrl);
        else toast.error('Bỏ qua ảnh lỗi', v.reason);
      }
      if (accepted.length > 0) {
        onUpdate('gallery', [...current, ...accepted]);
        toast.success(`Đã thêm ${accepted.length} ảnh`);
      }
    } finally {
      setUploading(false);
    }
  };

  const mainImage = form.imageData || form.imageUrl;

  return (
    <SectionCard
      title="Media"
      description="Ảnh chính hiển thị ở card dự án và social share. Gallery hiển thị trong modal chi tiết."
      Icon={ImageIcon}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
        {/* ── Ảnh chính ── */}
        <Field label="Ảnh chính" required error={errorImage} hint="Upload (khuyến nghị) hoặc dán URL ngoài">
          <div className="space-y-3">
            {mainImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 dark:border-abyss-700 bg-slate-50 dark:bg-abyss-950 group">
                <img src={mainImage} alt="main" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => mainFileRef.current?.click()}
                    className="px-3 py-1.5 rounded-md bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition"
                  >
                    Thay ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate('imageData', null);
                      onUpdate('imageUrl', '');
                    }}
                    className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
                  >
                    Xóa
                  </button>
                </div>
                {form.imageData && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-ocean-600 text-white text-[10px] font-mono">
                    Base64 • {formatBytes(form.imageData.length * 0.75)}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => mainFileRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-abyss-700 hover:border-ocean-500 transition flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-ocean-500"
              >
                {uploading ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : (
                  <ImagePlaceholder size={28} />
                )}
                <span className="text-xs font-mono uppercase tracking-wider">
                  {uploading ? 'Đang nén...' : 'Chọn ảnh chính'}
                </span>
                <span className="text-[10px] text-slate-400">Tự resize về 800px, nén JPEG 0.7</span>
              </button>
            )}
            <input
              ref={mainFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                handleMainImage(e.target.files?.[0] ?? null);
                if (e.target) e.target.value = '';
              }}
            />
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider text-center">— hoặc dán URL —</div>
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => {
                onUpdate('imageUrl', e.target.value);
                if (e.target.value) onUpdate('imageData', null);
              }}
              placeholder="https://images.unsplash.com/..."
              className="form-input"
            />
          </div>
        </Field>

        {/* ── Gallery ── */}
        <Field label={`Gallery (${form.gallery.length}/4)`} hint="Ảnh phụ cho modal chi tiết">
          <div className="grid grid-cols-2 gap-2">
            {form.gallery.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-abyss-700 group bg-slate-50 dark:bg-abyss-950"
              >
                <img src={src} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onUpdate('gallery', form.gallery.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 p-1.5 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
            {form.gallery.length < 4 && (
              <button
                type="button"
                onClick={() => galleryFileRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-abyss-700 hover:border-ocean-500 transition flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-ocean-500"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={18} />}
                <span className="text-[10px] font-mono uppercase tracking-wider">Thêm ảnh</span>
              </button>
            )}
            {Array.from({ length: Math.max(0, 4 - form.gallery.length - 1) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square rounded-lg border border-dashed border-slate-200 dark:border-abyss-800 flex items-center justify-center text-slate-300 dark:text-abyss-700"
              >
                <ImageIcon size={16} />
              </div>
            ))}
          </div>
          <input
            ref={galleryFileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => {
              handleGalleryImages(e.target.files);
              if (e.target) e.target.value = '';
            }}
          />
        </Field>
      </div>

      {/* ── Video URL ── */}
      <div className="mt-5">
        <Field
          label="Video demo URL"
          hint="YouTube embed (https://www.youtube.com/embed/...)"
        >
          <div className="relative">
            <Video size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={form.videoUrl}
              onChange={e => onUpdate('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="form-input pl-9"
            />
          </div>
        </Field>
      </div>

      {errorImage && (
        <p className="mt-3 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <AlertCircle size={12} /> {errorImage}
        </p>
      )}
    </SectionCard>
  );
};
