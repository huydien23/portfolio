import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

// Import admin pages
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AdminProjects from '../pages/AdminProjects';
import AdminAnalytics from '../pages/AdminAnalytics';

// Simple routing without React Router
type AdminRoute = 'login' | 'dashboard' | 'projects' | 'analytics' | 'content' | 'profile' | 'theme' | 'data' | 'settings';

const AdminRouter: React.FC = () => {
  const { isAuthenticated } = useAdmin();
  const [currentRoute, setCurrentRoute] = useState<AdminRoute>('login');

  // If not authenticated, always show login
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Navigate function for child components
  const navigate = (route: AdminRoute) => {
    setCurrentRoute(route);
  };

  // Render current route
  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'projects':
        return <AdminProjects />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'content':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Content Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Coming soon - Quản lý nội dung trang
              </p>
              <button
                onClick={() => navigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Về Dashboard
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Profile Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Coming soon - Quản lý hồ sơ cá nhân
              </p>
              <button
                onClick={() => navigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Về Dashboard
              </button>
            </div>
          </div>
        );
      case 'theme':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Theme Customization
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Coming soon - Tùy chỉnh giao diện
              </p>
              <button
                onClick={() => navigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Về Dashboard
              </button>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Data Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Coming soon - Quản lý dữ liệu
              </p>
              <button
                onClick={() => navigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Về Dashboard
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Coming soon - Cài đặt hệ thống
              </p>
              <button
                onClick={() => navigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Về Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div>
      {/* Inject navigation function into components */}
      <div style={{ display: 'none' }}>
        {/* This is a hack to pass navigation to AdminLayout */}
        {window && ((window as any).adminNavigate = navigate)}
      </div>
      
      {renderCurrentRoute()}
    </div>
  );
};

export default AdminRouter;