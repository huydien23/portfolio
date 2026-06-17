/**
 * Site maintenance entity — singleton doc at `site/maintenance` (id = "main").
 *
 *  - `enabled` is the manual toggle (admin sidebar button).
 *  - `scheduledStart` / `scheduledEnd` define a window during which the site is
 *    treated as under maintenance even if `enabled` is false. The hook ticks
 *    every 30s and re-evaluates against `Date.now()`, so no Firestore write
 *    is needed for the schedule to take effect or expire.
 *  - `logs` keeps the last 20 admin actions, newest first.
 */

import { LocalizedString } from '../site/model';

export type MaintenanceAction = 'on' | 'off' | 'edit' | 'scheduled' | 'auto_off' | 'manual';

export interface MaintenanceLogEntry {
  /** Unix ms. */
  timestamp: number;
  action: MaintenanceAction;
  /** Short description, e.g. "Manual toggle on", "Schedule 14:00-16:00". */
  note?: string;
}

export interface MaintenanceContent {
  id: 'main';
  enabled: boolean;
  title: LocalizedString;
  message: LocalizedString;
  /** Optional freeform text, e.g. "Back at 6 PM today". */
  etaText?: LocalizedString;
  contactEmail?: string;
  /** Unix ms — when both are set, the hook auto-enables during the window. */
  scheduledStart?: number;
  scheduledEnd?: number;
  /** Newest-first action history, capped at 20. */
  logs: MaintenanceLogEntry[];
  updatedAt?: number;
}

const MAX_LOGS = 20;

export const DEFAULT_MAINTENANCE: MaintenanceContent = {
  id: 'main',
  enabled: false,
  title: {
    vi: 'Đang bảo trì',
    en: 'Under Maintenance',
  },
  message: {
    vi: 'Website đang được nâng cấp để phục vụ bạn tốt hơn. Vui lòng quay lại sau ít phút.',
    en: 'The site is being upgraded to serve you better. Please come back in a few minutes.',
  },
  etaText: undefined,
  contactEmail: '',
  scheduledStart: undefined,
  scheduledEnd: undefined,
  logs: [],
};

/**
 * Resolve the effective maintenance state at time `now`.
 *  - With a schedule and `now` inside `[start, end)` → true.
 *  - Otherwise (before, after, or no schedule) → fall back to manual `enabled`.
 *    A finished schedule does NOT auto-clear a stale `enabled=true` — the admin
 *    must explicitly turn the toggle off (or clear the schedule) for the gate
 *    to close.
 */
export const isEffectivelyEnabled = (
  profile: MaintenanceContent,
  now: number = Date.now(),
): boolean => {
  const { scheduledStart, scheduledEnd, enabled } = profile;
  if (scheduledStart != null && scheduledEnd != null) {
    if (now >= scheduledStart && now < scheduledEnd) return true;
    return enabled;
  }
  return enabled;
};

export const pickMaintenanceLocale = (s: LocalizedString | undefined, lang: 'vi' | 'en'): string => {
  if (!s) return '';
  return s[lang] || s.vi || s.en || '';
};

export const appendLog = (
  logs: MaintenanceLogEntry[],
  entry: MaintenanceLogEntry,
): MaintenanceLogEntry[] => {
  const next = [entry, ...logs];
  return next.slice(0, MAX_LOGS);
};

export const MAINTENANCE_MAX_LOGS = MAX_LOGS;

