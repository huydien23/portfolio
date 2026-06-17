import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ProjectStatus } from '../../../entities/project/model';

interface StatusToggleProps {
  current: ProjectStatus;
  onChange: (next: ProjectStatus) => Promise<void> | void;
  /** Khi true, hiển thị cả 3 nút radio; khi false, chỉ toggle giữa published ↔ coming_soon. */
  full?: boolean;
}

const OPTIONS: { value: ProjectStatus; label: string; dot: string }[] = [
  { value: 'published', label: 'Hiển thị', dot: 'bg-emerald-500' },
  { value: 'coming_soon', label: 'Coming soon', dot: 'bg-amber-500' },
  { value: 'draft', label: 'Bản nháp', dot: 'bg-slate-400' },
];

/**
 * Compact segmented control đổi status nhanh trong bảng.
 * Có loading state riêng từng option để UX rõ ràng.
 */
export const StatusToggle = ({ current, onChange, full = false }: StatusToggleProps) => {
  const [pending, setPending] = useState<ProjectStatus | null>(null);

  const handle = async (next: ProjectStatus) => {
    if (next === current || pending) return;
    setPending(next);
    try {
      await onChange(next);
    } finally {
      setPending(null);
    }
  };

  const visible = full ? OPTIONS : OPTIONS.filter(o => o.value !== 'draft');

  return (
    <div className="inline-flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
      {visible.map(opt => {
        const active = opt.value === current;
        const loading = pending === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => handle(opt.value)}
            disabled={!!pending}
            className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all disabled:cursor-wait ${
              active
                ? 'bg-white dark:bg-abyss-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
            {loading ? <Loader2 size={10} className="animate-spin" /> : opt.label}
            {active && (
              <motion.div
                layoutId="status-toggle-pill"
                className="absolute inset-0 rounded-md ring-1 ring-ocean-500/30 pointer-events-none"
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
