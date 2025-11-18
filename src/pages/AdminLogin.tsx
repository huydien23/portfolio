import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Key, Eye, EyeOff, Shield, Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, isAuthenticated } = useAdmin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Navigate to dashboard when routing is implemented
      console.log('User is authenticated, should redirect to dashboard');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) return;

    const success = await login(password.trim());
    if (success) {
      console.log('Login successful - redirect to dashboard');
      // TODO: Navigate to dashboard
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Đã đăng nhập thành công!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn đã đăng nhập vào hệ thống admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Key className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-lg text-blue-100 leading-relaxed">
              Quản lý toàn bộ nội dung và cài đặt website của bạn từ một nơi duy nhất.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Dashboard analytics tức thời</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Quản lý dự án và nội dung</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Tùy chỉnh giao diện và theme</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Xuất nhập dữ liệu Firebase</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Đăng nhập để quản lý website
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Chào mừng trở lại!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Vui lòng đăng nhập vào tài khoản admin của bạn
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mật khẩu Admin
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu admin"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  disabled={loading}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Lock className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Hint */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Key className="w-5 h-5 text-blue-400 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Gợi ý:</strong> Mật khẩu mặc định là <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded font-mono">admin123</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Hệ thống bảo mật với session 24 giờ
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-400">
              <span>Secure Login</span>
              <span>•</span>
              <span>Session Management</span>
              <span>•</span>
              <span>Auto Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;