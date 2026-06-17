/** Shared VI + EN localized input used across profile-page tabs. */

import { LocalizedString } from '../../../../entities/site/model';

interface LocalizedInputProps {
  label: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export const LocalizedInput = ({ label, value, onChange, placeholder, multiline, rows = 3 }: LocalizedInputProps) => {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative">
          <span className="absolute top-2 left-2 text-[9px] font-mono font-bold text-ocean-500 bg-ocean-50 dark:bg-ocean-500/10 px-1.5 py-0.5 rounded">VI</span>
          <Tag
            value={value.vi}
            onChange={e => onChange({ ...value, vi: e.target.value })}
            placeholder={placeholder}
            rows={multiline ? rows : undefined}
            className="form-input pl-12"
          />
        </div>
        <div className="relative">
          <span className="absolute top-2 left-2 text-[9px] font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">EN</span>
          <Tag
            value={value.en}
            onChange={e => onChange({ ...value, en: e.target.value })}
            placeholder={placeholder}
            rows={multiline ? rows : undefined}
            className="form-input pl-12"
          />
        </div>
      </div>
    </div>
  );
};