import { database } from '../config/firebase';
import { ref, set, get, update, remove, push, onValue, off } from 'firebase/database';

// Types for portfolio data
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // Base64 encoded image
  gallery: string[]; // Array of Base64 encoded images
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string; // Base64 encoded image
  email: string;
  phone?: string;
  location: string;
  resume?: string; // Base64 encoded PDF or URL
  updatedAt: number;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage?: string; // Base64 encoded
    ctaButton: {
      text: string;
      link: string;
    };
  };
  about: {
    title: string;
    content: string;
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      period: string;
      description: string;
    }>;
  };
  contact: {
    title: string;
    description: string;
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  footer: {
    copyright: string;
    links: Array<{
      text: string;
      url: string;
    }>;
  };
  updatedAt: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo: string; // Base64 encoded
  favicon: string; // Base64 encoded
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string; // Base64 encoded
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  updatedAt: number;
}

// Firebase Database Service Class
export class FirebaseService {
  
  // Projects CRUD Operations
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const projectRef = push(ref(database, 'projects'));
      const projectId = projectRef.key!;
      
      const newProject: Project = {
        ...project,
        id: projectId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await set(projectRef, newProject);
      return projectId;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const snapshot = await get(ref(database, 'projects'));
      const data = snapshot.val();
      
      if (!data) return [];
      
      return Object.values(data) as Project[];
    } catch (error) {
      console.error('Error getting projects:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('projects');
      return localData ? JSON.parse(localData) : [];
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };
      
      await update(ref(database, `projects/${projectId}`), updateData);
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      await remove(ref(database, `projects/${projectId}`));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  // Personal Info Operations
  async getPersonalInfo(): Promise<PersonalInfo | null> {
    try {
      const snapshot = await get(ref(database, 'personalInfo'));
      return snapshot.val();
    } catch (error) {
      console.error('Error getting personal info:', error);
      // Return default data if Firebase fails
      return {
        name: "Điền Dev",
        title: "Lập Trình Viên Full Stack",
        bio: "Tôi là một lập trình viên web đam mê, chuyên tạo ra những trang web đẹp và hiệu quả.",
        avatar: "",
        email: "nhdiendndc.dev@gmail.com",
        phone: "+84 123 456 789",
        location: "Việt Nam",
        resume: "",
        updatedAt: Date.now()
      };
    }
  }

  async updatePersonalInfo(info: Omit<PersonalInfo, 'updatedAt'>): Promise<void> {
    try {
      const updateData: PersonalInfo = {
        ...info,
        updatedAt: Date.now()
      };
      
      await set(ref(database, 'personalInfo'), updateData);
    } catch (error) {
      console.error('Error updating personal info:', error);
      throw new Error('Failed to update personal info');
    }
  }

  // Site Content Operations
  async getSiteContent(): Promise<SiteContent | null> {
    try {
      const snapshot = await get(ref(database, 'siteContent'));
      return snapshot.val();
    } catch (error) {
      console.error('Error getting site content:', error);
      // Return default content if Firebase fails
      return {
        hero: {
          title: "Xin chào, tôi là Điền Dev",
          subtitle: "Lập Trình Viên Full Stack",
          description: "Tôi tạo ra những trang web đẹp, tương thích với mọi thiết bị và mang lại trải nghiệm người dùng tuyệt vời.",
          backgroundImage: "",
          ctaButton: {
            text: "Xem Dự Án",
            link: "#projects"
          }
        },
        about: {
          title: "Giới Thiệu",
          content: "Tôi là một lập trình viên web với niềm đam mê tạo ra những ứng dụng web hiện đại và hiệu quả.",
          skills: ["React", "TypeScript", "JavaScript", "Node.js"],
          experience: []
        },
        contact: {
          title: "Liên Hệ",
          description: "Hãy liên hệ với tôi để thảo luận về dự án của bạn.",
          socialLinks: []
        },
        footer: {
          copyright: "© 2025 Điền Dev. Đã đăng ký bản quyền.",
          links: []
        },
        updatedAt: Date.now()
      };
    }
  }

  async updateSiteContent(content: Omit<SiteContent, 'updatedAt'>): Promise<void> {
    try {
      const updateData: SiteContent = {
        ...content,
        updatedAt: Date.now()
      };
      
      await set(ref(database, 'siteContent'), updateData);
    } catch (error) {
      console.error('Error updating site content:', error);
      throw new Error('Failed to update site content');
    }
  }

  // Site Settings Operations
  async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      const snapshot = await get(ref(database, 'siteSettings'));
      return snapshot.val();
    } catch (error) {
      console.error('Error getting site settings:', error);
      // Return default settings if Firebase fails
      return {
        siteName: "Điền Dev Portfolio",
        siteDescription: "Portfolio chuyên nghiệp của Điền Dev",
        siteUrl: "https://diendev-portfolio.netlify.app",
        logo: "",
        favicon: "🔥",
        theme: {
          primaryColor: "#3B82F6",
          secondaryColor: "#1E40AF",
          accentColor: "#60A5FA",
          darkMode: true
        },
        seo: {
          metaTitle: "Điền Dev - Lập Trình Viên Full Stack",
          metaDescription: "Portfolio chuyên nghiệp của Điền Dev",
          keywords: ["developer", "react", "typescript"],
          ogImage: ""
        },
        analytics: {
          googleAnalyticsId: "",
          facebookPixelId: ""
        },
        updatedAt: Date.now()
      };
    }
  }

  async updateSiteSettings(settings: Omit<SiteSettings, 'updatedAt'>): Promise<void> {
    try {
      const updateData: SiteSettings = {
        ...settings,
        updatedAt: Date.now()
      };
      
      await set(ref(database, 'siteSettings'), updateData);
    } catch (error) {
      console.error('Error updating site settings:', error);
      throw new Error('Failed to update site settings');
    }
  }

  // Data Export/Import Operations
  async exportAllData(): Promise<{
    projects: Project[];
    personalInfo: PersonalInfo | null;
    siteContent: SiteContent | null;
    siteSettings: SiteSettings | null;
    exportDate: string;
    version: string;
  }> {
    try {
      const [projects, personalInfo, siteContent, siteSettings] = await Promise.all([
        this.getProjects(),
        this.getPersonalInfo(),
        this.getSiteContent(),
        this.getSiteSettings()
      ]);

      return {
        projects,
        personalInfo,
        siteContent,
        siteSettings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  async importAllData(data: {
    projects?: Project[];
    personalInfo?: PersonalInfo;
    siteContent?: SiteContent;
    siteSettings?: SiteSettings;
  }): Promise<void> {
    try {
      const updates: Record<string, any> = {};

      if (data.projects) {
        // Clear existing projects and add new ones
        updates['projects'] = null;
        data.projects.forEach(project => {
          updates[`projects/${project.id}`] = project;
        });
      }

      if (data.personalInfo) {
        updates['personalInfo'] = data.personalInfo;
      }

      if (data.siteContent) {
        updates['siteContent'] = data.siteContent;
      }

      if (data.siteSettings) {
        updates['siteSettings'] = data.siteSettings;
      }

      await update(ref(database), updates);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  // Real-time listeners
  subscribeToProjects(callback: (projects: Project[]) => void): () => void {
    const projectsRef = ref(database, 'projects');
    
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      const projects = data ? Object.values(data) as Project[] : [];
      callback(projects);
    });

    return () => off(projectsRef, 'value', unsubscribe);
  }

  subscribeToPersonalInfo(callback: (info: PersonalInfo | null) => void): () => void {
    const infoRef = ref(database, 'personalInfo');
    
    const unsubscribe = onValue(infoRef, (snapshot) => {
      callback(snapshot.val());
    });

    return () => off(infoRef, 'value', unsubscribe);
  }

  subscribeToSiteContent(callback: (content: SiteContent | null) => void): () => void {
    const contentRef = ref(database, 'siteContent');
    
    const unsubscribe = onValue(contentRef, (snapshot) => {
      callback(snapshot.val());
    });

    return () => off(contentRef, 'value', unsubscribe);
  }

  subscribeToSiteSettings(callback: (settings: SiteSettings | null) => void): () => void {
    const settingsRef = ref(database, 'siteSettings');
    
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      callback(snapshot.val());
    });

    return () => off(settingsRef, 'value', unsubscribe);
  }

  // Utility function to convert file to Base64
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Utility function to validate Base64 image
  static isValidBase64Image(base64: string): boolean {
    const regex = /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/;
    return regex.test(base64);
  }

  // Utility function to get image dimensions from Base64
  static getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = base64;
    });
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();