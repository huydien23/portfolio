export type ProjectCategory = 'Frontend' | 'Backend' | 'Mobile' | 'Desktop' | 'AI';

/**
 * Visibility state for a project, managed from the admin portal.
 *  - `published` — public, clickable.
 *  - `coming_soon` — shown in the archive with a "Coming Soon" overlay and
 *    not clickable; hidden from the featured rail.
 *  - `draft` — hidden from the public site entirely.
 */
export type ProjectStatus = 'published' | 'coming_soon' | 'draft';

export interface ProjectEntity {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  titleEn?: string;
  descriptionEn?: string;
  longDescriptionEn?: string;
  category: ProjectCategory;
  tags: string[];
  /** External image URL (Pexels, CDN, …). Lower priority than `imageData` when both are set. */
  imageUrl: string;
  /** Primary image as a base64 data URL — uploaded by the admin. */
  imageData?: string | null;
  /** Secondary images; may mix URLs and base64. */
  gallery?: string[];
  /** Demo video URL (YouTube embed, …). */
  videoUrl?: string;
  /** Standout project highlights, plain text. */
  highlights?: string[];
  githubUrl?: string;
  liveUrl?: string;
  year?: number;
  featured: boolean;
  status: ProjectStatus;
  /** Manual sort order, ascending. */
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export const PROJECT_STATUSES: ProjectStatus[] = ['published', 'coming_soon', 'draft'];

export const PROJECT_STATUS_LABEL_VI: Record<ProjectStatus, string> = {
  published: 'Đang hiển thị',
  coming_soon: 'Sắp ra mắt',
  draft: 'Bản nháp',
};

export const PROJECT_STATUS_LABEL_EN: Record<ProjectStatus, string> = {
  published: 'Published',
  coming_soon: 'Coming soon',
  draft: 'Draft',
};
