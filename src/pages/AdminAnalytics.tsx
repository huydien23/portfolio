import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminLayout from '../components/AdminLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Globe, 
  Clock,
  Download,
  RefreshCw,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  Activity
} from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const { analytics, refreshAnalytics, loading } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Auto refresh every minute
    const interval = setInterval(() => {
      refreshAnalytics();
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshAnalytics]);

  const handleRefresh = async () => {
    await refreshAnalytics();
    setLastUpdated(new Date());
  };

  const handleExportData = () => {
    if (!analytics) return;

    const exportData = {
      exportDate: new Date().toISOString(),
      period: selectedPeriod,
      data: analytics,
      summary: {
        totalVisitors: analytics.totalVisitors,
        totalPageViews: analytics.totalPageViews,
        realTimeVisitors: analytics.realTimeVisitors,
        topPages: Object.entries(analytics.pageStats || {})
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(link.href);
  };

  // Calculate growth rates (mock data for demo)
  const growthRates = {
    visitors: 12,
    pageViews: 24,
    avgTime: -5,
    bounceRate: -8
  };

  // Device breakdown (mock data)
  const deviceStats = [
    { device: 'Desktop', count: 65, icon: Monitor, color: 'blue' },
    { device: 'Mobile', count: 30, icon: Smartphone, color: 'green' },
    { device: 'Tablet', count: 5, icon: Tablet, color: 'purple' }
  ];

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Thống kê chi tiết về lưu lượng truy cập website
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="90d">90 ngày qua</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={handleExportData}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          Cập nhật lần cuối: {lastUpdated.toLocaleString('vi-VN')}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tổng Visitors
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalVisitors || 0}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    +{growthRates.visitors}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đang Online
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.realTimeVisitors || 0}
                </p>
                <div className="flex items-center mt-1">
                  <Activity className="w-3 h-3 text-green-500 mr-1 animate-pulse" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Real-time
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalPageViews || 0}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    +{growthRates.pageViews}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Bounce Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  42%
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1 rotate-180" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    {growthRates.bounceRate}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Trends Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Xu hướng Visitors
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Chart Container */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {Object.entries(analytics?.dailyStats || {})
                .slice(-7)
                .map(([date, count], index) => {
                  const maxCount = Math.max(...Object.values(analytics?.dailyStats || {})) as number;
                  const height = Math.max(20, ((count as number) / maxCount) * 200);
                  
                  return (
                    <div key={date} className="flex flex-col items-center space-y-2">
                      <div
                        className="bg-blue-500 dark:bg-blue-400 rounded-t transition-all duration-500 hover:bg-blue-600 dark:hover:bg-blue-300 cursor-pointer group relative"
                        style={{ 
                          height: `${height}px`, 
                          width: '32px',
                          animationDelay: `${index * 100}ms` 
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {count} visitors
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-45">
                        {new Date(date).toLocaleDateString('vi-VN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trang phổ biến nhất
              </h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(analytics?.pageStats || {})
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 6)
                .map(([page, views], index) => {
                  const maxViews = Math.max(...Object.values(analytics?.pageStats || {})) as number;
                  const percentage = ((views as number) / maxViews) * 100;
                  
                  return (
                    <div key={page} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate capitalize">
                            {page}
                          </p>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {views as number}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              animationDelay: `${index * 100}ms`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Device Stats & Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thiết bị truy cập
              </h3>
              <Monitor className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {deviceStats.map((device) => {
                const Icon = device.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                };
                
                return (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${colorClasses[device.color as keyof typeof colorClasses]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.device}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            device.color === 'blue' ? 'bg-blue-500' :
                            device.color === 'green' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${device.count}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                        {device.count}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Device Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalVisitors || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng số thiết bị
                </p>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Nguồn traffic
              </h3>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Direct
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  45%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Google Search
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  35%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Social Media
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  15%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Referral
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  5%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu analytics...</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;