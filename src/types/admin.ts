// Admin authentication types
export interface AdminUser {
  isAuthenticated: boolean;
  loginTime?: number;
  sessionId?: string;
}

// Analytics types
export interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  thisMonthVisitors: number;
  realTimeVisitors: number;
}

export interface PageStats {
  totalPageViews: number;
  pageBreakdown: Record<string, number>;
  popularPages: Array<{
    page: string;
    views: number;
    percentage: number;
  }>;
}

export interface DeviceStats {
  mobile: number;
  desktop: number;
  tablet: number;
  browsers: Record<string, number>;
}

export interface AnalyticsSummary {
  visitors: VisitorStats;
  pageViews: PageStats;
  devices: DeviceStats;
  trends: {
    dailyVisitors: Array<{
      date: string;
      count: number;
    }>;
    monthlyVisitors: Array<{
      month: string;
      count: number;
    }>;
  };
}

// Project management types
export interface ProjectFormData {
  title: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
}

// Content management types
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaButton: {
    text: string;
    link: string;
  };
}

export interface AboutContent {
  title: string;
  content: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
}

export interface ContactContent {
  title: string;
  description: string;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
}

// Site settings types
export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
}

export interface SocialSettings {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  email: string;
}

// Form state types
export interface FormState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  isDirty: boolean;
}

// File upload types
export interface ImageUpload {
  file: File;
  preview: string;
  base64?: string;
  uploading?: boolean;
  error?: string;
}

// Dashboard widget types
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'table';
  data: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

// Navigation types
export interface AdminRoute {
  path: string;
  name: string;
  icon: string;
  component: string;
  permission?: string;
}

// Notification types
export interface AdminNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

// Export data types
export interface DataExport {
  projects: any[];
  personalInfo: any;
  siteContent: any;
  siteSettings: any;
  analytics?: any;
  exportDate: string;
  version: string;
}

// Import validation types
export interface ImportValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    projects: number;
    hasPersonalInfo: boolean;
    hasSiteContent: boolean;
    hasSiteSettings: boolean;
  };
}