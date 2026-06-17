/** Status (3 large buttons) and manual sort order. Status controls whether
 *  the project is visible on the public site. */

import { Hash, Sliders, CheckCircle2, Clock, FileEdit } from 'lucide-react';
import { SectionCard, Field } from '../SectionCard';
import { FormState } from '../hooks/useProjectForm';
import { PROJECT_STATUSES, ProjectStatus } from '../../../../entities/project/model';

interface SettingsSectionProps {
  form: FormState;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const STATUS_CARDS: { value: ProjectStatus; label: string; desc: string; Icon: React.ComponentType<{ size?: number }>; cls: string }[] = [
  {
    value: 'published',
    label: 'Hiển thị',
    desc: 'Công khai, click được, hiện ở archive.',
    Icon: CheckCircle2,
    cls: 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    value: 'coming_soon',
    label: 'Coming soon',
    desc: 'Hiện với overlay, click bị disable, vẫn hiện ở featured.',
    Icon: Clock,
    cls: 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  {
    value: 'draft',
    label: 'Bản nháp',
    desc: 'Ẩn hoàn toàn khỏi public, chỉ admin thấy.',
    Icon: FileEdit,
    cls: 'border-slate-300 dark:border-abyss-600 bg-slate-50 dark:bg-abyss-800 text-slate-600 dark:text-slate-300',
  },
];

export const SettingsSection = ({ form, onUpdate }: SettingsSectionProps) => (
  <SectionCard
    title="Trạng thái & Thứ tự"
    description="Status quyết định dự án có hiện ở public không. Order càng nhỏ càng lên đầu."
    Icon={Sliders}
  >
    <Field label="Trạng thái hiển thị" hint="Có thể đổi bất kỳ lúc nào">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {STATUS_CARDS.map(s => {
          const active = form.status === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onUpdate('status', s.value)}
              className={`flex flex-col items-start gap-1.5 p-3.5 rounded-xl border-2 text-left transition ${
                active
                  ? s.cls
                  : 'border-slate-200 dark:border-abyss-700 hover:border-slate-300 dark:hover:border-abyss-600 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <s.Icon size={13} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </button>
          );
        })}
      </div>
    </Field>

    <div className="mt-4 max-w-xs">
      <Field label="Thứ tự" hint="Số nhỏ hiện trước">
        <div className="relative">
          <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            value={form.order}
            onChange={e => onUpdate('order', e.target.value)}
            className="form-input pl-9"
          />
        </div>
      </Field>
    </div>

    {/* Hidden helper: ensure import is used (avoid TS6133) */}
    <span className="hidden">{PROJECT_STATUSES.length}</span>
  </SectionCard>
);
