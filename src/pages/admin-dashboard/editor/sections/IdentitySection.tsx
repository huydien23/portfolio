/** ID (slug) and Featured toggle.
 *  - Create: id auto-generated from the title with a regenerate button and
 *    a duplicate-id warning.
 *  - Edit: id is read-only; shows a warning if the user picked one that
 *    collides with an existing project.
 */

import { motion } from 'framer-motion';
import { Hash, Star, RefreshCw, AlertTriangle, CheckCircle2, Edit3 } from 'lucide-react';
import { SectionCard, Field } from '../SectionCard';
import { FormState } from '../hooks/useProjectForm';

interface IdentitySectionProps {
  form: FormState;
  isEdit: boolean;
  idConflict: boolean;
  /** True nếu id hiện tại KHÁC id tự sinh từ title → user đã sửa tay (chỉ áp dụng tạo mới). */
  isManuallyEdited?: boolean;
  onChangeId: (val: string) => void;
  onRegenerateId: () => void;
  onToggleFeatured: () => void;
}

export const IdentitySection = ({
  form, isEdit, idConflict, isManuallyEdited,
  onChangeId, onRegenerateId, onToggleFeatured,
}: IdentitySectionProps) => {
  // Cho phép edit id thoải mái ở chế độ tạo mới; ở edit mode, id readonly.
  // Nếu isEdit=true và form.id !== initial.id, hiện banner cảnh báo idConflict.

  return (
    <SectionCard
      title="Định danh"
      description="ID là khóa chính của document trong Firestore. Slug tự sinh từ tiêu đề, có thể chỉnh tay."
      Icon={Hash}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 items-start">
        <Field
          label="ID (slug)"
          required
          hint={isEdit ? 'Không thể đổi ID khi sửa' : 'Tự sinh từ tiêu đề'}
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.id}
                onChange={e => onChangeId(e.target.value)}
                readOnly={isEdit}
                className={`form-input pl-9 font-mono text-xs ${
                  isEdit ? 'bg-slate-50 dark:bg-abyss-950/40 cursor-not-allowed opacity-70' : ''
                }`}
              />
            </div>
            {!isEdit && (
              <button
                type="button"
                onClick={onRegenerateId}
                title="Tạo lại từ tiêu đề"
                className="px-3 rounded-lg border border-slate-200 dark:border-abyss-700 text-slate-500 dark:text-slate-400 hover:border-ocean-500 hover:text-ocean-500 transition inline-flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Tạo lại</span>
              </button>
            )}
          </div>

          {/* Trạng thái id */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            {idConflict ? (
              <>
                <AlertTriangle size={12} className="text-red-500" />
                <span className="text-red-600 dark:text-red-400">
                  ID này đã được dùng bởi dự án khác — sửa id hoặc chọn dự án khác.
                </span>
              </>
            ) : isEdit ? (
              <>
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400">ID hợp lệ, đang dùng cho dự án này.</span>
              </>
            ) : isManuallyEdited ? (
              <>
                <Edit3 size={12} className="text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">Đã chỉnh tay — bấm &quot;Tạo lại&quot; để trở về auto.</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400">Tự động tạo từ tiêu đề.</span>
              </>
            )}
          </div>
        </Field>

        {/* Featured toggle */}
        <button
          type="button"
          onClick={onToggleFeatured}
          className={`lg:self-stretch flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition min-w-[260px] ${
            form.featured
              ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10'
              : 'border-slate-200 dark:border-abyss-700 hover:border-slate-300 dark:hover:border-abyss-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star
              size={14}
              className={form.featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}
            />
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Featured</div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Hiển thị ở trang chủ</div>
            </div>
          </div>
          <motion.div
            animate={{ x: form.featured ? 18 : 0 }}
            className={`relative w-10 h-5 rounded-full p-0.5 transition ${form.featured ? 'bg-amber-500' : 'bg-slate-300 dark:bg-abyss-700'}`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow" />
          </motion.div>
        </button>
      </div>
    </SectionCard>
  );
};
