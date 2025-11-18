import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider } from './contexts/AdminContext';
import { useAdmin } from './contexts/AdminContext';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AnimatePresence } from './components/AnimatePresence';
import ExportDataTest from './components/ExportDataTest';
import AdminRouter from './components/AdminRouter';

// Main App Component
const AppContent: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Check if should show admin interface
  useEffect(() => {
    const shouldShowAdmin = (window as any).showAdminInterface || isAuthenticated;
    setShowAdmin(shouldShowAdmin);
  }, [isAuthenticated]);

  // Admin Mode
  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminRouter />
        
        {/* Back to Portfolio Button */}
        {!isAuthenticated && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => {
                (window as any).showAdminInterface = false;
                setShowAdmin(false);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors"
            >
              ← Về Portfolio
            </button>
          </div>
        )}
      </div>
    );
  }

  // Portfolio Mode (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar scrolled={scrolled} />
      <AnimatePresence>
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
          {/* Temporary Export Data Test */}
          <section className="py-20">
            <ExportDataTest />
          </section>
        </main>
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
      
      {/* Admin Access Hint */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowAdmin(true)}
          className="px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          title="Admin Access"
        >
          🔑 Admin
        </button>
      </div>
    </div>
  );
};

export default App;

// Main App with Providers
function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </ThemeProvider>
  );
}