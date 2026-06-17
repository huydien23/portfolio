/** Sticky bottom bar: [Cancel] on the left, [Save draft] and primary action on the right. */

import { Loader2, Save, Rocket, X } from 'lucide-react';

interface EditorActionBarProps {
  isEdit: boolean;
  saving: boolean;
  hasErrors: boolean;
  isPublished: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const EditorActionBar = ({
  isEdit, saving, hasErrors, isPublished,
  onCancel, onSaveDraft, onPublish,
}: EditorActionBarProps) => {
  const publishLabel = isEdit
    ? (isPublished ? 'Cập nhật' : 'Cập nhật & Hiển thị')
    : 'Đăng dự án';

  return (
    <div className="sticky bottom-0 z-30 -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-white/95 dark:bg-abyss-900/95 backdrop-blur border-t border-slate-200 dark:border-abyss-800">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-abyss-800 transition disabled:opacity-50"
        >
          <X size={12} />
          Hủy
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving || hasErrors}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-abyss-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-abyss-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={saving || hasErrors}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-ocean-600 hover:bg-ocean-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-glow"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
            {publishLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
