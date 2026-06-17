/**
 * Shared drawer used by all profile-page CRUD tabs (Experiences, Certifications,
 * English certs). Mirrors the visual style of the other admin forms.
 */

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';

interface ItemDrawerProps {
  open: boolean;
  title: string;
  saving?: boolean;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
}

export const ItemDrawer = ({ open, title, saving, onClose, onSave, children }: ItemDrawerProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, saving, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9400] bg-slate-900/50 backdrop-blur-sm flex items-stretch justify-end"
          onClick={() => !saving && onClose()}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-abyss-900 shadow-2xl border-l border-slate-200 dark:border-abyss-700 flex flex-col h-screen"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-abyss-700 shrink-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                disabled={saving}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-abyss-800 disabled:opacity-50"
                aria-label="Đóng"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {children}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-abyss-950/50 border-t border-slate-200 dark:border-abyss-700 flex justify-end gap-2 shrink-0">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-abyss-800 disabled:opacity-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-ocean-600 hover:bg-ocean-500 text-white transition disabled:opacity-60"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                Lưu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};