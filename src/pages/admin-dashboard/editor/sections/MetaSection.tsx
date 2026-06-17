/** Category, year, tags, GitHub / live URLs. */

import { Tag, Github, ExternalLink, Hash, FolderTree } from 'lucide-react';
import { SectionCard, Field } from '../SectionCard';
import { FormState } from '../hooks/useProjectForm';

interface MetaSectionProps {
  form: FormState;
  errors: Record<string, string>;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const MetaSection = ({ form, errors, onUpdate }: MetaSectionProps) => (
  <SectionCard
    title="Metadata"
    description="Phân loại, thời gian, công nghệ và link ngoài."
    Icon={FolderTree}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Category">
        <div className="relative">
          <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={form.category}
            onChange={e => onUpdate('category', e.target.value as FormState['category'])}
            className="form-input pl-9"
          >
            {(['Frontend', 'Backend', 'Mobile', 'Desktop', 'AI'] as const).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </Field>

      <Field label="Năm" error={errors.year} hint="1990 - 2100">
        <input
          type="number"
          min={1990}
          max={2100}
          value={form.year}
          onChange={e => onUpdate('year', e.target.value)}
          className="form-input"
        />
      </Field>
    </div>

    <div className="mt-4">
      <Field label="Tags" hint="Phân cách bằng dấu phẩy">
        <div className="relative">
          <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={form.tagsRaw}
            onChange={e => onUpdate('tagsRaw', e.target.value)}
            placeholder="React, TypeScript, Tailwind CSS"
            className="form-input pl-9"
          />
        </div>
        {form.tagsRaw && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {form.tagsRaw
              .split(',')
              .map(t => t.trim())
              .filter(Boolean)
              .slice(0, 12)
              .map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-abyss-800 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
          </div>
        )}
      </Field>
    </div>

    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="GitHub URL">
        <div className="relative">
          <Github size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="url"
            value={form.githubUrl}
            onChange={e => onUpdate('githubUrl', e.target.value)}
            placeholder="https://github.com/..."
            className="form-input pl-9"
          />
        </div>
      </Field>
      <Field label="Live URL">
        <div className="relative">
          <ExternalLink size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="url"
            value={form.liveUrl}
            onChange={e => onUpdate('liveUrl', e.target.value)}
            placeholder="https://..."
            className="form-input pl-9"
          />
        </div>
      </Field>
    </div>
  </SectionCard>
);
