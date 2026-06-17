// Project id convention: `prj-<slug>`, e.g. "prj-website-nha-tro-ket-noi".
// Slugs are lowercase, Vietnamese-diacritics stripped (đ → d), non-alphanum
// collapsed to a single dash, trimmed, and capped at 50 chars so the id is
// URL-friendly and fits inside Firestore's doc-id limits.

const MAX_SLUG_LEN = 50;

export const slugify = (raw: string): string => {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics in U+0300–U+036F
    .replace(/đ/g, 'd')    // `đ` survives NFD unchanged
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LEN)
    .replace(/-+$/, '');   // re-trim if the slice cut mid-dash
};

export const generateProjectId = (title: string): string => {
  const slug = slugify(title) || 'untitled';
  return `prj-${slug}`;
};

/** Append `-2`, `-3`, … until the id is not in `existingIds`. */
export const ensureUniqueId = (base: string, existingIds: Set<string>): string => {
  if (!existingIds.has(base)) return base;
  let n = 2;
  while (existingIds.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
};
