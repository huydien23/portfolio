import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Settings, 
  BarChart3, 
  Upload, 
  Download, 
  LogOut, 
  Menu, 
  X,
  User,
  Palette,
  Database
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, isAuthenticated } = useAdmin();

  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Tổng quan', 
      icon: LayoutDashboard, 
      path: '/admin' 
    },
    { 
      id: 'analytics', 
      name: 'Phân tích', 
      icon: BarChart3, 
      path: '/admin/analytics' 
    },
    { 
      id: 'projects', 
      name: 'Dự án', 
      icon: FolderOpen, 
      path: '/admin/projects' 
    },
    { 
      id: 'content', 
      name: 'Nội dung', 
      icon: FileText, 
      path: '/admin/content' 
    },
    { 
      id: 'profile', 
      name: 'Hồ sơ', 
      icon: User, 
      path: '/admin/profile' 
    },
    { 
      id: 'theme', 
      name: 'Giao diện', 
      icon: Palette, 
      path: '/admin/theme' 
    },
    { 
      id: 'data', 
      name: 'Dữ liệu', 
      icon: Database, 
      path: '/admin/data' 
    },
    { 
      id: 'settings', 
      name: 'Cài đặt', 
      icon: Settings, 
      path: '/admin/settings' 
    }
  ];

  const handleMenuClick = (path: string) => {
    // Use simple navigation system
    const navigate = (window as any).adminNavigate;
    if (navigate) {
      const route = path.split('/').pop() || 'dashboard';
      navigate(route);
    }
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-600 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Admin Panel</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-r-2 border-gray-600 dark:border-gray-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-md mr-3 transition-all duration-200
                    ${isActive 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                    }
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-left">{item.name}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Quản trị viên
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 border border-red-200 dark:border-red-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="ml-4 lg:ml-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {menuItems.find(item => item.id === currentPage)?.name || 'Tổng quan'}
                </h2>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  System Online
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title="Xuất dữ liệu"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title="Nhập dữ liệu"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Admin</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;