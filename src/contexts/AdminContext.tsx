import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firebaseService, type Project, type PersonalInfo, type SiteContent, type SiteSettings } from '../services/firebase';
import { analyticsService, type AnalyticsData } from '../services/analytics';

// Admin Context Types
interface AdminState {
  // Authentication
  isAuthenticated: boolean;
  loginTime?: number;
  sessionId?: string;
  
  // Data
  projects: Project[];
  personalInfo: PersonalInfo | null;
  siteContent: SiteContent | null;
  siteSettings: SiteSettings | null;
  analytics: AnalyticsData | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  isDirty: boolean;
}

interface AdminActions {
  // Authentication
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  
  // Data Management
  loadData: () => Promise<void>;
  
  // Projects
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  // Content Management
  updatePersonalInfo: (info: Omit<PersonalInfo, 'updatedAt'>) => Promise<void>;
  updateSiteContent: (content: Omit<SiteContent, 'updatedAt'>) => Promise<void>;
  updateSiteSettings: (settings: Omit<SiteSettings, 'updatedAt'>) => Promise<void>;
  
  // Data Operations
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<void>;
  
  // Analytics
  refreshAnalytics: () => Promise<void>;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

interface AdminContextType extends AdminState, AdminActions {}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin Provider Component
interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    isAuthenticated: false,
    projects: [],
    personalInfo: null,
    siteContent: null,
    siteSettings: null,
    analytics: null,
    loading: false,
    error: null,
    isDirty: false
  });

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAuthSession = () => {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          const now = Date.now();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
          
          if (session.loginTime && (now - session.loginTime) < sessionDuration) {
            setState(prev => ({
              ...prev,
              isAuthenticated: true,
              loginTime: session.loginTime,
              sessionId: session.sessionId
            }));
            loadData();
          } else {
            // Session expired
            localStorage.removeItem('adminSession');
          }
        } catch (error) {
          console.error('Invalid admin session:', error);
          localStorage.removeItem('adminSession');
        }
      }
    };

    checkAuthSession();
    
    // Subscribe to analytics updates
    const unsubscribeAnalytics = analyticsService.subscribeToAnalytics((analytics) => {
      setState(prev => ({ ...prev, analytics }));
    });

    return () => {
      unsubscribeAnalytics();
    };
  }, []);

  // Authentication
  const login = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simple password check (hardcoded as per requirements)
      if (password === 'admin123') {
        const loginTime = Date.now();
        const sessionId = `admin_${loginTime}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store session
        const session = { loginTime, sessionId };
        localStorage.setItem('adminSession', JSON.stringify(session));
        
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          loginTime,
          sessionId
        }));
        
        // Load data after successful login
        await loadData();
        
        return true;
      } else {
        setError('Mật khẩu không đúng');
        return false;
      }
    } catch (error) {
      setError('Đăng nhập thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminSession');
    setState({
      isAuthenticated: false,
      projects: [],
      personalInfo: null,
      siteContent: null,
      siteSettings: null,
      analytics: null,
      loading: false,
      error: null,
      isDirty: false
    });
  };

  // Data Management
  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const [projects, personalInfo, siteContent, siteSettings, analytics] = await Promise.all([
        firebaseService.getProjects(),
        firebaseService.getPersonalInfo(),
        firebaseService.getSiteContent(),
        firebaseService.getSiteSettings(),
        analyticsService.getAnalyticsData()
      ]);

      setState(prev => ({
        ...prev,
        projects,
        personalInfo,
        siteContent,
        siteSettings,
        analytics
      }));
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Projects
  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      setLoading(true);
      const projectId = await firebaseService.createProject(project);
      
      // Reload projects
      const projects = await firebaseService.getProjects();
      setState(prev => ({ ...prev, projects, isDirty: true }));
      
      return projectId;
    } catch (error) {
      setError('Không thể tạo dự án');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
    try {
      setLoading(true);
      await firebaseService.updateProject(projectId, updates);
      
      // Update local state
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => 
          p.id === projectId ? { ...p, ...updates, updatedAt: Date.now() } : p
        ),
        isDirty: true
      }));
    } catch (error) {
      setError('Không thể cập nhật dự án');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      setLoading(true);
      await firebaseService.deleteProject(projectId);
      
      // Update local state
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId),
        isDirty: true
      }));
    } catch (error) {
      setError('Không thể xóa dự án');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Content Management
  const updatePersonalInfo = async (info: Omit<PersonalInfo, 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      await firebaseService.updatePersonalInfo(info);
      
      setState(prev => ({
        ...prev,
        personalInfo: { ...info, updatedAt: Date.now() },
        isDirty: true
      }));
    } catch (error) {
      setError('Không thể cập nhật thông tin cá nhân');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSiteContent = async (content: Omit<SiteContent, 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      await firebaseService.updateSiteContent(content);
      
      setState(prev => ({
        ...prev,
        siteContent: { ...content, updatedAt: Date.now() },
        isDirty: true
      }));
    } catch (error) {
      setError('Không thể cập nhật nội dung trang');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSettings = async (settings: Omit<SiteSettings, 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      await firebaseService.updateSiteSettings(settings);
      
      setState(prev => ({
        ...prev,
        siteSettings: { ...settings, updatedAt: Date.now() },
        isDirty: true
      }));
    } catch (error) {
      setError('Không thể cập nhật cài đặt trang');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Data Operations
  const exportData = async (): Promise<any> => {
    try {
      setLoading(true);
      return await firebaseService.exportAllData();
    } catch (error) {
      setError('Không thể xuất dữ liệu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const importData = async (data: any): Promise<void> => {
    try {
      setLoading(true);
      await firebaseService.importAllData(data);
      
      // Reload all data
      await loadData();
    } catch (error) {
      setError('Không thể nhập dữ liệu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Analytics
  const refreshAnalytics = async (): Promise<void> => {
    try {
      const analytics = await analyticsService.getAnalyticsData();
      setState(prev => ({ ...prev, analytics }));
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    }
  };

  // UI Actions
  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const contextValue: AdminContextType = {
    ...state,
    login,
    logout,
    loadData,
    createProject,
    updateProject,
    deleteProject,
    updatePersonalInfo,
    updateSiteContent,
    updateSiteSettings,
    exportData,
    importData,
    refreshAnalytics,
    setLoading,
    setError,
    clearError
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use Admin Context
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;