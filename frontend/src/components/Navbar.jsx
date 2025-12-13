import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';

// Navigation links
const publicNavLinks = [
  { path: '/', text: 'Home' },
  { path: '/about', text: 'About' },
  { path: '/courses', text: 'Courses' },
  { path: '/contact', text: 'Contact' },
];

// Helper function to safely get user from localStorage
const getStoredUser = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    const user = JSON.parse(userData);
    if (user && (user.fullName || user.username || user.email)) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Memoize the stored user to prevent unnecessary re-renders
  const storedUser = useCallback(getStoredUser, []);

  // Initialize user state and set up event listeners
  useEffect(() => {
    // Initial load
    setUser(storedUser());

    // Handle storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token' || e.key === null) {
        setUser(storedUser());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, [storedUser]);

  // Helper function to get user initial
  const getInitial = useCallback((name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  }, []);

  // Get appropriate dashboard link based on user role
  const getDashboardLink = useCallback(() => {
    if (!user) return null;

    if (user.role === 'teacher') {
      return {
        path: '/mentor-dashboard',
        text: 'Mentor Dashboard',
        icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      };
    }

    // For students, always return the learner dashboard
    return {
      path: '/my-dashboard',
      text: 'My Dashboard',
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
    };
  }, [user]);

  const dashboardLink = getDashboardLink();

  // Get display name with fallbacks
  const displayName = user?.fullName || user?.username || user?.email?.split('@')[0] || 'User';

  // Handle user logout
  const handleLogout = useCallback(() => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));

    // Close mobile menu if open
    setIsOpen(false);

    // Navigate to home page
    navigate('/', { replace: true });

    // Force a full page reload to reset all states
    window.location.reload();
  }, [navigate]);

  return (
    <nav
      className="backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b border-gray-100"
      style={{ backgroundColor: 'rgba(245, 241, 232, 0.8)' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={user ? (user.role === 'teacher' ? '/mentor-dashboard' : '/my-dashboard') : '/'}
            className="flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-2xl font-bold text-primary-700">
              Next Step
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {(!user || user.role !== 'teacher') && (
            <div className="hidden md:flex items-center space-x-6">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-primary-600 font-medium hover:text-primary-800 transition-colors duration-200"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Auth Buttons & Mobile Menu Toggle */}
          <div className="flex items-center">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                // --- USER IS LOGGED IN (DESKTOP) ---
                <HeadlessMenu as="div" className="relative">
                  <div>
                    <HeadlessMenu.Button
                      className="flex items-center space-x-2 text-primary-700 hover:text-primary-900 rounded-full p-1 pr-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {getInitial(displayName)}
                      </div>
                      <span className="text-sm font-medium">{displayName}</span>
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </HeadlessMenu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-primary-700 truncate">{displayName}</p>
                        {user.email && (
                          <p className="text-xs text-primary-500 truncate">{user.email}</p>
                        )}
                      </div>

                      {/* Dashboard Link */}
                      {dashboardLink && (
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              to={dashboardLink.path}
                              className={`${active ? 'bg-gray-50' : ''} group flex w-full items-center px-4 py-2.5 text-sm text-primary-700`}
                            >
                              {dashboardLink.icon}
                              {dashboardLink.text}
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                      )}

                      {/* Logout Button */}
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? 'bg-red-50' : ''} group flex w-full items-center px-4 py-2.5 text-sm text-red-600`}
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              ) : (
                // --- USER NOT LOGGED IN (DESKTOP) ---
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary-600 font-medium hover:text-primary-800 transition-colors duration-200"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary-600 hover:text-primary-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {/* Public Navigation Links */}
            {(!user || user.role !== 'teacher') && publicNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-2 text-primary-600 font-medium hover:text-primary-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            ))}

            {user ? (
              // --- USER LOGGED IN (MOBILE) ---
              <div className="border-t border-gray-100 mt-2 pt-2">
                <div className="px-4 py-2 text-sm text-gray-500">
                  Signed in as <span className="font-bold">{displayName}</span>
                </div>

                {/* Dashboard Link */}
                {dashboardLink && (
                  <Link
                    to={dashboardLink.path}
                    className="flex items-center px-4 py-2 text-primary-600 font-medium hover:text-primary-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {dashboardLink.icon}
                    {dashboardLink.text}
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              // --- USER NOT LOGGED IN (MOBILE) ---
              <div className="pt-2 space-y-2 border-t border-gray-100 mt-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors duration-200 border border-primary-100"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2 text-center text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;