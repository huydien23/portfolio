import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminLayout from '../components/AdminLayout';
import { 
  Users, 
  Eye, 
  FileText, 
  FolderOpen, 
  TrendingUp, 
  Activity,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { analytics, projects, loading, refreshAnalytics } = useAdmin();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Refresh analytics every 30 seconds
    const interval = setInterval(() => {
      refreshAnalytics();
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAnalytics]);

  // Quick stats calculations
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const recentProjects = projects.filter(p => 
    Date.now() - p.createdAt < (7 * 24 * 60 * 60 * 1000) // Last 7 days
  ).length;

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tổng quan hoạt động website của bạn
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cập nhật lúc: {currentTime.toLocaleTimeString('vi-VN')}
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Visitors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tổng Visitors
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalVisitors || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +12% so với tuần trước
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Real-time Visitors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đang Online
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.realTimeVisitors || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Visitors hiện tại
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Page Views */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalPageViews || 0}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  +24% so với tuần trước
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Total Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Dự Án
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalProjects}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  {featuredProjects} featured
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <FolderOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Xu hướng Visitors
              </h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {Object.entries(analytics?.dailyStats || {})
                .slice(-7) // Last 7 days
                .map(([date, count]) => (
                  <div key={date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(date).toLocaleDateString('vi-VN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, ((count as number) / 50) * 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                        {count as number}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trang phổ biến
              </h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {Object.entries(analytics?.pageStats || {})
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([page, views]) => (
                  <div key={page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {page}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {views as number} views
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Device Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dự án gần đây
              </h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <div key={project.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {project.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Device Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thiết bị
              </h3>
              <Monitor className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Desktop</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">65%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mobile</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">30%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tablet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tablet</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">5%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hành động nhanh
              </h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Thêm dự án mới
                </span>
                <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Xuất dữ liệu
                </span>
                <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Cài đặt trang
                </span>
                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;