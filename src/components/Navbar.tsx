import React, { useState } from 'react';
import { Menu, X, Moon, Sun, Key } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AdminLoginModal from './AdminLoginModal';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = () => {
    // Set a flag to show admin interface
    (window as any).showAdminInterface = true;
    window.location.reload(); // Simple way to switch to admin mode
  };

  const navLinks = [
    { name: 'Trang Chủ', href: '#home' },
    { name: 'Giới Thiệu', href: '#about' },
    { name: 'Dự Án', href: '#projects' },
    { name: 'Liên Hệ', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a 
          href="#home" 
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 text-transparent bg-clip-text"
        >
          Điền Dev
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
          
          {/* Admin Login Button */}
          <button
            onClick={handleAdminLogin}
            className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
            title="Admin Login"
            aria-label="Đăng nhập quản trị"
          >
            <Key className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          {/* Admin Login Button Mobile */}
          <button
            onClick={handleAdminLogin}
            className="p-2 mr-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
            title="Admin Login"
            aria-label="Đăng nhập quản trị"
          >
            <Key className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Mở menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white dark:bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="text-2xl font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
      
      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </nav>
  );
};

export default Navbar;