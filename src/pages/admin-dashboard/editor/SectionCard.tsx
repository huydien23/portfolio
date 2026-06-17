/** Shared wrapper for the 5 section cards in ProjectEditorPage. */

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  description?: string;
  Icon: LucideIcon;
  children: React.ReactNode;
  /** Footer hoặc nội dung phụ đặt ở header bên phải. */
  right?: React.ReactNode;
  /** Nội dung mở rộng phía dưới (vd: helper text). */
  footer?: React.ReactNode;
}

export const SectionCard = ({ title, description, Icon, children, right, footer }: SectionCardProps) => (
  <motion.section
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl overflow-hidden"
  >
    <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 dark:border-abyss-800">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 flex items-center justify-center">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">{title}</h2>
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
    <div className="px-6 py-5">{children}</div>
    {footer && (
      <div className="px-6 py-3 bg-slate-50 dark:bg-abyss-950/50 border-t border-slate-100 dark:border-abyss-800 text-[11px] text-slate-500 dark:text-slate-400">
        {footer}
      </div>
    )}
  </motion.section>
);

/* ── Field wrapper — label + hint + error ── */
interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Field = ({ label, hint, error, required, children, className }: FieldProps) => (
  <div className={className}>
    <label className="flex items-center justify-between mb-1.5">
      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {hint && <span className="text-[10px] text-slate-400 dark:text-slate-500">{hint}</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{error}</p>}
  </div>
);
