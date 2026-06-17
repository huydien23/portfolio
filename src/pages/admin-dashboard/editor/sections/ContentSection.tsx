/** Bilingual content editor — VI and EN side by side so the editor can
 *  compare both translations at a glance. */

import { Languages, FileText, ListChecks } from 'lucide-react';
import { SectionCard, Field } from '../SectionCard';
import { FormState } from '../hooks/useProjectForm';

interface ContentSectionProps {
  form: FormState;
  errors: Record<string, string>;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const LangColumn = ({
  title, fields, form, errors, onUpdate,
}: {
  title: string;
  fields: { key: keyof FormState; label: string; required?: boolean; rows: number; placeholder: string; mono?: boolean }[];
  form: FormState;
  errors: Record<string, string>;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) => (
  <div className="space-y-3">
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-abyss-800 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
      <Languages size={10} />
      {title}
    </div>
    {fields.map(f => (
      <Field
        key={f.key as string}
        label={f.label}
        required={f.required}
        error={errors[f.key as string]}
      >
        {f.rows > 1 ? (
          <textarea
            rows={f.rows}
            value={String(form[f.key] ?? '')}
            onChange={e => onUpdate(f.key, e.target.value as FormState[typeof f.key])}
            placeholder={f.placeholder}
            className={`form-input resize-none ${f.mono ? 'font-mono text-xs' : ''}`}
          />
        ) : (
          <input
            type="text"
            value={String(form[f.key] ?? '')}
            onChange={e => onUpdate(f.key, e.target.value as FormState[typeof f.key])}
            placeholder={f.placeholder}
            className="form-input"
          />
        )}
      </Field>
    ))}
  </div>
);

export const ContentSection = ({ form, errors, onUpdate }: ContentSectionProps) => (
  <SectionCard
    title="Nội dung song ngữ"
    description="Tiếng Việt là bản chính, tiếng Anh sẽ tự dùng bản Việt nếu để trống."
    Icon={FileText}
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <LangColumn
        title="Tiếng Việt"
        fields={[
          { key: 'title', label: 'Tiêu đề', required: true, rows: 1, placeholder: 'VD: Website Nhà Trọ Kết Nối' },
          { key: 'description', label: 'Mô tả ngắn', required: true, rows: 3, placeholder: '1-2 câu tóm tắt, hiển thị ở card' },
          { key: 'longDescription', label: 'Mô tả chi tiết', rows: 5, placeholder: 'Mô tả đầy đủ, hiển thị ở modal chi tiết' },
          { key: 'highlightsRaw', label: 'Điểm nổi bật', rows: 4, placeholder: 'Tính năng A\nTính năng B', mono: true },
        ]}
        form={form}
        errors={errors}
        onUpdate={onUpdate}
      />
      <LangColumn
        title="English"
        fields={[
          { key: 'titleEn', label: 'Title', rows: 1, placeholder: 'Project title in English' },
          { key: 'descriptionEn', label: 'Short description', rows: 3, placeholder: '1-2 sentence summary' },
          { key: 'longDescriptionEn', label: 'Long description', rows: 5, placeholder: 'Full description shown in detail modal' },
        ]}
        form={form}
        errors={errors}
        onUpdate={onUpdate}
      />
    </div>

    <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
      <ListChecks size={11} />
      Mỗi dòng trong &quot;Điểm nổi bật&quot; là 1 ý. Có thể dùng Markdown cơ bản.
    </p>
  </SectionCard>
);
