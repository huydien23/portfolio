/** Sticky top bar: back button, page title, status badge, error summary. */

import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../ui/StatusBadge';
import { ProjectStatus } from '../../../entities/project/model';

interface EditorTopBarProps {
  isEdit: boolean;
  status: ProjectStatus;
  hasErrors: boolean;
  saving: boolean;
  /** URL quay lại (vd: /admin/dashboard/projects) */
  backTo?: string;
  /** Số lỗi hiện tại */
  errorCount: number;
}

export const EditorTopBar = ({
  isEdit, status, hasErrors, saving, backTo = '/admin/dashboard/projects', errorCount,
}: EditorTopBarProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (saving) return;
    navigate(backTo);
  };

  return (
    <div className="sticky top-0 z-30 -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-slate-50/95 dark:bg-abyss-950/95 backdrop-blur border-b border-slate-200 dark:border-abyss-800">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-abyss-800 transition disabled:opacity-50"
          >
            <ArrowLeft size={14} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Quay lại</span>
          </button>
          <div className="h-5 w-px bg-slate-200 dark:bg-abyss-700" />
          <h1 className="text-sm font-bold text-slate-900 dark:text-white font-display truncate">
            {isEdit ? 'Sửa dự án' : 'Đăng dự án mới'}
          </h1>
          <StatusBadge status={status} size="sm" />
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          {hasErrors ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
              <AlertCircle size={11} />
              {errorCount} lỗi cần sửa
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 size={11} />
              Sẵn sàng lưu
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
