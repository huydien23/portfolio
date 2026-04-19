export type ProjectCategory = 'Frontend' | 'Backend' | 'Mobile' | 'Desktop' | 'AI';

export interface ProjectEntity {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  tags: string[];
  imageUrl: string;
  gallery?: string[];
  videoUrl?: string;
  highlights?: string[];
  githubUrl?: string;
  liveUrl?: string;
  year?: number;
  featured: boolean;
}
