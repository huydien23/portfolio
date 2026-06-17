import { ProjectStatus } from '../../../entities/project/model';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

const STYLES: Record<ProjectStatus, string> = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
  coming_soon: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
  draft: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10',
};

const DOTS: Record<ProjectStatus, string> = {
  published: 'bg-emerald-500',
  coming_soon: 'bg-amber-500',
  draft: 'bg-slate-400',
};

const LABELS_VI: Record<ProjectStatus, string> = {
  published: 'Đang hiển thị',
  coming_soon: 'Sắp ra mắt',
  draft: 'Bản nháp',
};

export const StatusBadge = ({ status, size = 'md', showDot = true }: StatusBadgeProps) => {
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold uppercase tracking-wider ${STYLES[status]} ${sizeCls}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${DOTS[status]}`} />}
      {LABELS_VI[status]}
    </span>
  );
};
