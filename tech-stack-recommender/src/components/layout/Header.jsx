import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      console.log('Dark mode initialized'); // Debug log
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      console.log('Light mode initialized'); // Debug log
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Dark mode enabled'); // Debug log
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Light mode enabled'); // Debug log
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = user
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Profile', href: '/profile' },
        { label: 'Settings', href: '/settings' },
      ]
    : [
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' },
      ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="group flex items-center py-2"
            >
              <span className="mr-3 text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🚀</span>
              <span className="text-3xl logo-text tracking-wider">
                Tech IQ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            <nav className="flex space-x-1 items-center">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {user && (
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2"
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 sm:hidden">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="grid gap-1 px-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
